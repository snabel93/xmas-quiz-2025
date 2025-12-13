# Christmas Quiz 2025 - Backend

Express.js backend API for the Christmas Quiz application, configured for Vercel serverless deployment.

## API Endpoints

### `GET /`
Root endpoint - Returns API information and available endpoints

### `GET /api/health`
Health check endpoint

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### `GET /api/leaderboard`
Get top 50 scores, sorted by score (descending) and timestamp (ascending)

Response:
```json
[
  {
    "_id": "...",
    "name": "Player Name",
    "score": 25,
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
]
```

### `POST /api/score`
Add a new score to the database

Request body:
```json
{
  "name": "Player Name",
  "score": 25
}
```

Response:
```json
{
  "_id": "...",
  "name": "Player Name",
  "score": 25,
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
MONGODB_URI=your_mongodb_connection_string
```

3. Test locally with Vercel CLI:
```bash
npm install -g vercel
vercel dev
```

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

### Environment Variables

Set the following environment variable in your Vercel project:
- `MONGODB_URI` - Your MongoDB connection string

### CORS Configuration

Update allowed origins in [api/index.js](api/index.js) to include your frontend URL:
```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend-url.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
```

## Database

Uses MongoDB with Mongoose ODM.

### Score Schema
```javascript
{
  name: String (required, trimmed),
  score: Number (required, min: 0, max: 30),
  timestamp: Date (default: Date.now)
}
```

## Performance

- Uses cached database connections for optimal serverless performance
- Connection pooling enabled
- Automatic reconnection on connection loss
