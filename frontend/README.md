# Christmas Quiz 2025 - Frontend

React frontend for the Christmas Quiz application.

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
frontend/
├── public/
│   ├── images/        # Quiz question images (1.jpg - 25.webp)
│   ├── index.html     # Main HTML template
│   ├── manifest.json  # PWA manifest
│   └── robots.txt     # Robots file
├── src/
│   ├── components/
│   │   └── QuizApp.js # Main quiz component
│   ├── App.js         # Root component
│   ├── index.js       # React entry point
│   ├── index.css      # Tailwind directives
│   └── quiz.json      # 25 quiz questions
├── package.json
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration
```

## Configuration

### API URL
Update the backend API URL in [src/components/QuizApp.js](src/components/QuizApp.js):
```javascript
const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-backend-url.vercel.app/api'
    : 'http://localhost:3000/api';
```

## Deployment

This project is designed to be deployed on Vercel:

1. Build the project: `npm run build`
2. Deploy: `vercel --prod`

Or connect your GitHub repository to Vercel for automatic deployments.

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
