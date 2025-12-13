# Christmas Quiz 2025

A full-stack Christmas quiz application with React frontend and Express backend.

## Project Structure

```
xmas-quiz-2025/
├── frontend/          # React frontend application
│   ├── public/        # Static assets and images
│   ├── src/           # React source code
│   └── package.json   # Frontend dependencies
├── backend/           # Express API backend
│   ├── api/           # API endpoints
│   ├── models/        # MongoDB models
│   └── package.json   # Backend dependencies
└── README.md          # This file
```

## Features

- 25 Christmas-themed quiz questions
- 20-second timer per question with visual progress bar
- Real-time leaderboard
- Score tracking with MongoDB
- Responsive design with Tailwind CSS
- Deployed separately to Vercel (frontend and backend)

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Lucide React (icons)
- Create React App

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Vercel serverless functions

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (MongoDB Atlas recommended)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
MONGODB_URI=your_mongodb_connection_string
```

4. For local development, you can test with Vercel CLI:
```bash
npm install -g vercel
vercel dev
```

## Deployment

### Frontend Deployment to Vercel

1. Navigate to the frontend directory
2. Build the project:
```bash
npm run build
```
3. Deploy to Vercel:
```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Backend Deployment to Vercel

1. Navigate to the backend directory
2. Deploy to Vercel:
```bash
vercel --prod
```

3. Set environment variables in Vercel:
   - Go to your Vercel project settings
   - Add `MONGODB_URI` environment variable

### Important: Update API URL

After deploying the backend, update the API URL in the frontend:

Edit [frontend/src/components/QuizApp.js](frontend/src/components/QuizApp.js):
```javascript
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-backend-url.vercel.app/api'  // Update this
    : 'http://localhost:3000/api';
```

Also update the CORS origins in [backend/api/index.js](backend/api/index.js):
```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend-url.vercel.app',  // Add your frontend URL
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
```

## API Endpoints

### GET `/`
Root endpoint - Returns API information

### GET `/api/health`
Health check endpoint

### GET `/api/leaderboard`
Get top 50 scores, sorted by score (descending) and timestamp (ascending)

### POST `/api/score`
Add a new score to the database

Request body:
```json
{
  "name": "Player Name",
  "score": 25
}
```

## Database Schema

### Score Model
```javascript
{
  name: String (required, trimmed),
  score: Number (required, min: 0, max: 30),
  timestamp: Date (default: Date.now)
}
```

## Development Notes

- The frontend uses Create React App for zero-config setup
- Tailwind CSS is configured with PostCSS for styling
- The backend uses cached database connections for optimal Vercel serverless performance
- All quiz questions and images are stored in the frontend
- The max score is 25 (one point per correct answer)

## License

Private project for 10 Squared

## Questions or Issues?

Contact the development team for support.
