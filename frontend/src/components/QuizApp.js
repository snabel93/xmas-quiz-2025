import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Circle, CircleDot } from 'lucide-react';
import quizData from '../quiz.json';
import Snow from './Snow';

const API_URL = process.env.NODE_ENV === 'production'
    //? 'https://quiz-app-backend-sable.vercel.app/api'
    ? 'https://xmas-quiz-2025.vercel.app/api'
    : 'http://localhost:3000/api';

const QuizApp = () => {
  const [screen, setScreen] = useState('start');
  const [sortedLeaderboard, setSortedLeaderboard] = useState([]);
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerProgress, setTimerProgress] = useState(100);
  const [isAnswered, setIsAnswered] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const timerStartRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      const sorted = [...data].sort((a, b) => b.score - a.score);
      setLeaderboard(data);
      setSortedLeaderboard(sorted);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    }
  }, []);

  // Fetch leaderboard on mount and when updated
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const createSparkles = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newSparkles = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 40 + Math.random() * 20;
      newSparkles.push({
        id: Date.now() + i,
        left: centerX,
        top: centerY,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance
      });
    }
    setSparkles(newSparkles);

    // Clear sparkles after animation
    setTimeout(() => setSparkles([]), 600);
  }, []);

  const handleAnswerClick = useCallback((option, event) => {
    if (!isAnswered && !selectedAnswer) {
      setSelectedAnswer(option);
      createSparkles(event);

      // Auto-submit after selecting answer
      const currentQ = quizData.questions[currentQuestion];
      const isCorrect = option === currentQ.correctAnswer;

      if (isCorrect) {
        setScore(prev => prev + 1);
      }

      setIsAnswered(true);
    }
  }, [isAnswered, selectedAnswer, createSparkles, currentQuestion]);

  const handleAnswer = useCallback(() => {
    const currentQ = quizData.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setIsAnswered(true);
  }, [currentQuestion, selectedAnswer]);

  // Initialize timer start time when question starts
  useEffect(() => {
    if (screen === 'question' && !isAnswered) {
      timerStartRef.current = Date.now();
    }
  }, [currentQuestion, screen, isAnswered]);

  // Countdown timer effect - update both timer and progress together
  useEffect(() => {
    if (screen === 'question' && timeLeft > 0 && !isAnswered && !selectedAnswer) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Update progress bar - it will animate to this value over 1 second
          setTimerProgress((newTime / 20) * 100);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && !isAnswered) {
      setTimerProgress(0);
      handleAnswer();
    }
  }, [timeLeft, screen, isAnswered, selectedAnswer, handleAnswer]);

  const handleStart = () => {
    if (userName.trim()) {
      setScreen('question');
      setTimerProgress(100);
      setTimeLeft(20);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.questions.length - 1) {
      // Disable transitions and reset states
      setIsTransitioning(true);
      setSelectedAnswer('');
      setIsAnswered(false);
      setSparkles([]);
      setTimeLeft(20);
      setTimerProgress(100);

      // Re-enable transitions and move to next question
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentQuestion(currentQuestion + 1);
      }, 50);
    } else {
      // Always transition to completed screen first
      setScreen('completed');

      try {
        const response = await fetch(`${API_URL}/score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userName,
            score: score
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save score');
        }

        await fetchLeaderboard();
        setError(null);
      } catch (err) {
        console.error('Error saving score:', err);
        setError('Failed to save score. Your score was: ' + score);
        // Try to fetch leaderboard anyway
        fetchLeaderboard().catch(console.error);
      }
    }
  };

  // Start Screen
  if (screen === 'start') {
    return (
      <>
        <Snow />
        <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Welcome to the 10 Squared Mince Pie Quiz 2025
              </h3>
            </div>
            <img
              src="/images/welcome.jpg"
              alt="Welcome"
              className="w-full rounded-lg mb-6"
            />
            <div className="mb-6">
              <p className="text-lg text-white mb-4 text-center font-bold cursor-default" onClick={() => setScreen('fullresults')}>Quiz Rules:</p>
               <ul className="space-y-3">
                {[
                  'No Cheating!',
                  'You have 20 seconds to answer each question',
                  'Each correct answer is worth 1 point',
                  'Your score will be added to the leaderboard'
                ].map((rule, index) => (
                  <li key={index} className="flex items-center text-lg text-white">
                    <Circle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border-gray-600"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleStart}
                  disabled={!userName.trim()}
                  className={`px-8 py-2 rounded-full text-xl font-semibold transition-colors
                    ${!userName.trim()
                      ? 'bg-green-500/50 text-white cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                    }`}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Question Screen
  if (screen === 'question') {
    const currentQ = quizData.questions[currentQuestion];

    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg">
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Christmas Quiz</h2>
              <span className="text-xl text-white">Question {currentQuestion + 1}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-8">{currentQ.question}</h3>

            {currentQ.image && (
              <img
                src={`/images/${currentQ.image}`}
                alt="Question"
                className="w-full rounded-lg mb-6"
              />
            )}

            <div className="mb-6 w-full">
              <div className="flex items-center mb-2">
                <Timer className="text-green-500 w-6 h-6 mr-1" />
                <span className="text-green-500 text-xl font-medium mr-4">{timeLeft}</span>
                <div className="flex-1 relative h-2 bg-gray-700 rounded">
                  <div
                    className="absolute inset-y-0 left-0 bg-green-500 rounded"
                    style={{
                      width: `${timerProgress}%`,
                      transition: (selectedAnswer || isTransitioning) ? 'none' : 'width 1s linear'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={(e) => handleAnswerClick(option, e)}
                  className={`sparkle-container w-full p-4 rounded text-left text-lg ${
                    selectedAnswer === option
                      ? 'bg-green-800 text-white single-pulse'
                      : selectedAnswer
                      ? 'bg-gray-700 text-white opacity-50 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
                  }`}
                  disabled={isAnswered || selectedAnswer !== ''}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {selectedAnswer === option ? (
                        <CircleDot className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" strokeWidth={2.5} fill="currentColor" />
                      ) : (
                        <Circle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-right">{option}</span>
                  </div>
                  {selectedAnswer === option && sparkles.map(sparkle => (
                    <div
                      key={sparkle.id}
                      className="sparkle"
                      style={{
                        left: `${sparkle.left}px`,
                        top: `${sparkle.top}px`,
                        '--tx': `${sparkle.tx}px`,
                        '--ty': `${sparkle.ty}px`
                      }}
                    />
                  ))}
                </button>
              ))}
            </div>

            {isAnswered && (
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-2 rounded-full text-xl font-semibold bg-green-500 hover:bg-green-600 text-white cursor-pointer transition-colors pulse"
                >
                  {currentQuestion < quizData.questions.length - 1 ? 'Next Question' : 'See Your Score'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

   // Full Results Screen
   if (screen === 'fullresults') {
    return (
      <>
        <Snow />
        <div className="min-h-screen bg-gray-900 text-white p-4 relative">
        <div className="relative z-10 h-full">
          <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg h-full">
            <div className="p-6 h-full">
              <div className="mb-6">
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg mb-4 text-center">
                  <h4 className="text-2xl font-bold mb-2">Full Leaderboard</h4>
                  <p className="text-lg">All quiz scores from highest to lowest</p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-800 rounded-lg">
                  <div className="p-6">
                    <div className="flex justify-center mb-6">
                      <button
                        onClick={() => setScreen('start')}
                        className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
                      >
                        Return to Start
                      </button>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-6 text-center">All Scores</h2>
                    <div className="space-y-4">
                      {sortedLeaderboard.map((entry, index) => (
                        <div
                          key={index}
                          className="flex justify-between p-4 bg-gray-700 bg-opacity-50 rounded items-center"
                        >
                          <div className="flex items-center">
                            <Circle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                            <span className="text-lg text-white">{entry.name}</span>
                          </div>
                          <span className="text-lg text-white">{entry.score} points</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Completed Screen
  return (
    <>
      <Snow />
      <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      <div className="relative z-10 h-full">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg h-full">
          <div className="p-6 h-full">
            <div className="mb-6">
              {error && (
                <div className="text-red-500 mb-4">
                  {error}
                </div>
              )}
              <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg mb-4 text-center">
                <h4 className="text-2xl font-bold mb-2">Thanks {userName}!</h4>
                <p className="text-lg">for playing the 10Squared Mince Pie Quiz</p>
                <p className="text-xl font-semibold mt-4">Well done, your score is {score} points</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/score.jpg"
                alt="Complete"
                className="w-full rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-6 text-center">Top Scores</h2>
                  <div className="space-y-4">
                    {leaderboard.slice(0, 3).map((entry, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-4 bg-gray-700 bg-opacity-50 rounded items-center backdrop-blur-sm"
                      >
                        <div className="flex items-center">
                          <Circle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                          <span className="text-lg text-white">{entry.name}</span>
                        </div>
                        <span className="text-lg text-white">{entry.score} points</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default QuizApp;
