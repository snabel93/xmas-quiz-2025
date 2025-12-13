const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Score = require('../models/Score');

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'xmas-quiz-2025-frontend.vercel.app',
        'https://quiz.10squared.co.uk',
      //  'https://quiz-backend-snabel93.vercel.app',
      //  'https://quiz-app-backend-fnfnvq1ae-snabel93s-projects.vercel.app',
      //  'https://quiz-app-backend-sable.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Cached database connection
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        console.log('Using cached database connection');
        return cachedDb;
    }

    try {
        const client = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = client;
        console.log('New database connection established');
        return client;
    } catch (error) {
        console.error('MongoDB connection error:', {
            name: error.name,
            message: error.message,
            code: error.code
        });
        throw error;
    }
}

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Quiz API is running',
        endpoints: {
            health: '/api/health',
            leaderboard: '/api/leaderboard',
            score: '/api/score'
        }
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        await connectToDatabase();
        const scores = await Score.find()
            .sort({ score: -1, timestamp: 1 })
            .limit(50);
        res.json(scores);
    } catch (err) {
        console.error('Leaderboard error:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        res.status(500).json({
            message: 'Failed to fetch leaderboard',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// Add new score
app.post('/api/score', async (req, res) => {
    try {
        await connectToDatabase();

        // Validate input
        if (!req.body.name || typeof req.body.score !== 'number') {
            return res.status(400).json({
                message: 'Invalid input. Name and score are required.',
                received: {
                    name: !!req.body.name,
                    score: typeof req.body.score
                }
            });
        }

        const score = new Score({
            name: req.body.name,
            score: req.body.score
        });

        const newScore = await score.save();
        res.status(201).json(newScore);
    } catch (err) {
        console.error('Score saving error:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        res.status(400).json({
            message: 'Failed to save score',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
    });
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

// Vercel requires this
module.exports = app;
