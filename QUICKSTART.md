# Quick Start Guide

Get the Christmas Quiz 2025 running locally in under 5 minutes!

## Prerequisites
no
- Node.js (v14 or higher)
- MongoDB connection string (from MongoDB Atlas or local MongoDB)

## 1. Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

## 2. Configure Backend

Create a `.env` file in the `backend` directory:

```bash
cd backend
echo "MONGODB_URI=your_mongodb_connection_string" > .env
```

Or manually create `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz-db
```

## 3. Start Backend (Terminal 1)

```bash
cd backend
npm install -g vercel
vercel dev
```

The backend will start on `http://localhost:3000`

## 4. Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000` (or the next available port)

## 5. Open in Browser

The browser should open automatically to `http://localhost:3000`

If not, manually navigate to the URL shown in the terminal.

## 6. Test the Application

1. Enter your name
2. Click "Start Quiz"
3. Answer the questions
4. Complete the quiz and see your score on the leaderboard!

## Common Issues

### "Cannot connect to database"
- Check that your MongoDB connection string is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure the database user has read/write permissions

### "Port already in use"
- Kill the process using the port or use a different port
- The frontend will automatically use the next available port

### "Module not found"
- Make sure you ran `npm install` in both frontend and backend directories
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Images not loading
- Verify images are in `frontend/public/images/`
- Check that the paths in `frontend/src/quiz.json` match the filenames

## Next Steps

- Read [README.md](README.md) for full documentation
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Customize the quiz questions in `frontend/src/quiz.json`
- Update the welcome message in `frontend/src/components/QuizApp.js`

## Project Structure

```
xmas-quiz-2025/
├── frontend/          # React app (runs on localhost:3000)
│   ├── src/
│   │   ├── components/QuizApp.js  # Main quiz logic
│   │   └── quiz.json              # 25 quiz questions
│   └── public/images/             # All quiz images
├── backend/           # Express API (runs on localhost:3000/api)
│   ├── api/index.js   # API endpoints
│   └── models/        # MongoDB schemas
└── README.md          # Full documentation
```

Enjoy your quiz! 🎄
