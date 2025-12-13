# Deployment Guide - Christmas Quiz 2025

This guide walks you through deploying both the frontend and backend to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (can sign up with GitHub)
- MongoDB Atlas account (or another MongoDB hosting service)
- Git installed on your computer
- Node.js installed on your computer

## Step 1: Set Up MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/quiz-db`)
6. Save this connection string - you'll need it later

## Step 2: Initialize Git Repository

Open a terminal in the `xmas-quiz-2025` directory:

```bash
cd xmas-quiz-2025
git init
git add .
git commit -m "Initial commit - Christmas Quiz 2025"
```

## Step 3: Create GitHub Repository

### Option A: Using GitHub Website

1. Go to [GitHub](https://github.com)
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it `xmas-quiz-2025`
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### Option B: Using GitHub CLI

```bash
gh repo create xmas-quiz-2025 --public --source=. --remote=origin --push
```

### Push to GitHub (if using Option A)

```bash
git remote add origin https://github.com/YOUR-USERNAME/xmas-quiz-2025.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy Backend to Vercel

### 4.1 Deploy via Vercel CLI

```bash
cd backend
npm install -g vercel
vercel login
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `xmas-quiz-2025-backend`
- In which directory is your code located? `./` (current directory)
- Want to override the settings? **N**

### 4.2 Add Environment Variables

```bash
vercel env add MONGODB_URI
```

When prompted:
- Enter the value: Your MongoDB connection string from Step 1
- Which environments? Select **Production**, **Preview**, and **Development**

### 4.3 Deploy to Production

```bash
vercel --prod
```

### 4.4 Save Your Backend URL

After deployment, you'll see a URL like:
```
https://xmas-quiz-2025-backend.vercel.app
```

**Save this URL - you'll need it for the frontend!**

## Step 5: Update Frontend Configuration

### 5.1 Update API URL

Edit `frontend/src/components/QuizApp.js` and find this line (around line 6):

```javascript
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://quiz-app-backend-sable.vercel.app/api'  // ← UPDATE THIS
    : 'http://localhost:3000/api';
```

Replace it with your backend URL from Step 4.4:

```javascript
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://xmas-quiz-2025-backend.vercel.app/api'  // ← Your backend URL
    : 'http://localhost:3000/api';
```

### 5.2 Commit the Change

```bash
git add frontend/src/components/QuizApp.js
git commit -m "Update backend API URL"
git push
```

## Step 6: Deploy Frontend to Vercel

### 6.1 Deploy via Vercel CLI

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `xmas-quiz-2025-frontend`
- In which directory is your code located? `./` (current directory)
- Want to override the settings? **N**

### 6.2 Deploy to Production

```bash
vercel --prod
```

### 6.3 Save Your Frontend URL

After deployment, you'll see a URL like:
```
https://xmas-quiz-2025-frontend.vercel.app
```

**Save this URL!**

## Step 7: Update Backend CORS Settings

### 7.1 Update Allowed Origins

Edit `backend/api/index.js` and find the CORS configuration (around line 9):

```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://xmas-quiz-opal.vercel.app',  // ← OLD URLs
        'https://quiz.10squared.co.uk',
        // ... more old URLs
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
```

Replace with your frontend URL:

```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',  // Keep for local development
        'https://xmas-quiz-2025-frontend.vercel.app',  // ← Your frontend URL
        // Add any custom domain here later
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
```

### 7.2 Commit and Redeploy Backend

```bash
git add backend/api/index.js
git commit -m "Update CORS origins for new frontend"
git push

cd backend
vercel --prod
```

## Step 8: Test Your Deployment

1. Open your frontend URL in a browser
2. Test the quiz functionality:
   - Enter your name and start the quiz
   - Answer some questions
   - Complete the quiz
   - Check if your score appears on the leaderboard

## Step 9: (Optional) Add Custom Domain

### For Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to "Settings" → "Domains"
4. Add your custom domain (e.g., `quiz.yourdomain.com`)
5. Follow Vercel's DNS configuration instructions

### For Backend

1. Select your backend project in Vercel
2. Go to "Settings" → "Domains"
3. Add your custom domain (e.g., `quiz-api.yourdomain.com`)

### Update CORS Again

If you add a custom domain for the frontend, update the CORS settings in `backend/api/index.js` to include it.

## Automatic Deployments

### Set Up GitHub Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select "Import Git Repository"
4. Choose your `xmas-quiz-2025` repository
5. Import **twice** - once for frontend, once for backend:

#### Frontend Project
- **Project Name:** `xmas-quiz-2025-frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `build`

#### Backend Project
- **Project Name:** `xmas-quiz-2025-backend`
- **Root Directory:** `backend`
- **Environment Variables:** Add `MONGODB_URI`

Now, every time you push to GitHub, Vercel will automatically deploy!

## Troubleshooting

### Frontend shows "Failed to load leaderboard"
- Check that the backend API URL is correct
- Verify the backend is deployed and running
- Check browser console for CORS errors

### Backend CORS errors
- Verify the frontend URL is in the CORS origins list
- Redeploy the backend after updating CORS settings

### Database connection errors
- Verify `MONGODB_URI` environment variable is set in Vercel
- Check MongoDB Atlas IP whitelist includes Vercel IPs (or use 0.0.0.0/0)
- Verify database user credentials are correct

### Images not loading
- Check that all images are in `frontend/public/images/`
- Verify the image paths in `quiz.json` match the actual filenames
- Check browser console for 404 errors

## Support

For any issues, check:
- Vercel deployment logs
- Browser console
- Network tab in browser DevTools

## Summary of URLs

After deployment, you should have:
- **Frontend:** `https://xmas-quiz-2025-frontend.vercel.app`
- **Backend:** `https://xmas-quiz-2025-backend.vercel.app`
- **GitHub:** `https://github.com/YOUR-USERNAME/xmas-quiz-2025`
- **MongoDB:** `mongodb+srv://...`

Keep these URLs saved for future reference!
