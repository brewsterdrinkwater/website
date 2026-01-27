import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Sparkles, Grid3x3, Image, BookOpen, ShoppingBag, Trophy, RefreshCw, Award, Construction, Instagram, Sun, Moon } from 'lucide-react';

// Middle Tennessee topography map background (light, optimized for web/mobile)
const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80';

// Drudge-style news links
const NEWS_LINKS = [
  { title: 'ATLANTIC', url: 'https://theatlantic.com' },
  { title: 'AXIOS', url: 'https://axios.com' },
  { title: 'BBC', url: 'https://bbc.com' },
  { title: 'BILLBOARD', url: 'https://billboard.com' },
  { title: 'BOSTON GLOBE', url: 'https://bostonglobe.com' },
  { title: 'BOSTON HERALD', url: 'https://bostonherald.com' },
  { title: 'BREITBART', url: 'https://breitbart.com' },
  { title: 'BUSINESS INSIDER', url: 'https://businessinsider.com' },
  { title: 'CBS NEWS', url: 'https://cbsnews.com' },
  { title: 'C-SPAN', url: 'https://c-span.org' },
  { title: 'CHICAGO SUN-TIMES', url: 'https://chicago.suntimes.com' },
  { title: 'CHICAGO TRIB', url: 'https://chicagotribune.com' },
  { title: 'CNBC', url: 'https://cnbc.com' },
  { title: 'CNN', url: 'https://cnn.com' },
  { title: 'DAILY BEAST', url: 'https://thedailybeast.com' },
  { title: 'DAILY CALLER', url: 'https://dailycaller.com' },
  { title: 'DEADLINE HOLLYWOOD', url: 'https://deadline.com' },
  { title: 'ENT WEEKLY', url: 'https://ew.com' },
  { title: 'FOXNEWS', url: 'https://foxnews.com' },
  { title: 'H\'WOOD REPORTER', url: 'https://hollywoodreporter.com' },
  { title: 'HUFFINGTON POST', url: 'https://huffpost.com' },
  { title: 'INTERCEPT', url: 'https://theintercept.com' },
  { title: 'LA TIMES', url: 'https://latimes.com' },
  { title: 'MARKETWATCH', url: 'https://marketwatch.com' },
  { title: 'MOTHER JONES', url: 'https://motherjones.com' },
  { title: 'NATION', url: 'https://thenation.com' },
  { title: 'NATIONAL REVIEW', url: 'https://nationalreview.com' },
  { title: 'NBC NEWS', url: 'https://nbcnews.com' },
  { title: 'NEW REPUBLIC', url: 'https://newrepublic.com' },
  { title: 'NEW YORK TIMES', url: 'https://nytimes.com' },
  { title: 'NY POST', url: 'https://nypost.com' },
  { title: 'NEW YORKER', url: 'https://newyorker.com' },
  { title: 'NEWSMAX', url: 'https://newsmax.com' },
  { title: 'PEOPLE', url: 'https://people.com' },
  { title: 'POLITICO', url: 'https://politico.com' },
  { title: 'REASON', url: 'https://reason.com' },
  { title: 'ROLL CALL', url: 'https://rollcall.com' },
  { title: 'ROLLING STONE', url: 'https://rollingstone.com' },
  { title: 'SALON', url: 'https://salon.com' },
  { title: 'SAN FRAN CHRON', url: 'https://sfchronicle.com' },
  { title: 'SEMAFOR', url: 'https://semafor.com' },
  { title: 'SKY NEWS', url: 'https://news.sky.com' },
  { title: 'TMZ', url: 'https://tmz.com' },
  { title: 'US NEWS', url: 'https://usnews.com' },
  { title: 'USA TODAY', url: 'https://usatoday.com' },
  { title: 'VANITY FAIR', url: 'https://vanityfair.com' },
  { title: 'VARIETY', url: 'https://variety.com' },
  { title: 'WALL STREET JOURNAL', url: 'https://wsj.com' },
  { title: 'WASH EXAMINER', url: 'https://washingtonexaminer.com' },
  { title: 'WASH POST', url: 'https://washingtonpost.com' },
  { title: 'WASH TIMES', url: 'https://washingtontimes.com' },
  { title: 'WRAP', url: 'https://thewrap.com' },
];

const AltTabWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const [showHighScore, setShowHighScore] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [golfBall, setGolfBall] = useState({ x: 0, y: 0, visible: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentGameType, setCurrentGameType] = useState(() => {
    const games = ['math', 'tictactoe', 'pattern', 'simon', 'reaction', 'wordscramble'];
    return games[Math.floor(Math.random() * games.length)];
  });
  const [letterPositions, setLetterPositions] = useState({
    A: { x: 0, y: 0 },
    L: { x: 0, y: 0 },
    T: { x: 0, y: 0 },
    '-': { x: 0, y: 0 },
    T2: { x: 0, y: 0 },
    A2: { x: 0, y: 0 },
    B: { x: 0, y: 0 },
  });
  const [draggingLetter, setDraggingLetter] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update time every second for world clocks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completeGame = (points) => {
    setTotalScore(prev => prev + points);
    setGamesCompleted(prev => {
      const newCount = prev + 1;
      if (newCount % 5 === 0) {
        setShowHighScore(true);
      }
      return newCount;
    });
  };

  const getRandomGame = () => {
    const games = ['math', 'tictactoe', 'pattern', 'simon', 'reaction', 'wordscramble'];
    const availableGames = games.filter(g => g !== currentGameType);
    return availableGames[Math.floor(Math.random() * availableGames.length)];
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Golf ball cursor effect
  const handleMouseMove = useCallback((e) => {
    setGolfBall({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });

    // Handle letter dragging
    if (draggingLetter) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setLetterPositions(prev => ({
        ...prev,
        [draggingLetter]: {
          x: prev[draggingLetter].x + deltaX,
          y: prev[draggingLetter].y + deltaY,
        }
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggingLetter, dragStart]);

  const handleLetterMouseDown = (letter, e) => {
    e.preventDefault();
    setDraggingLetter(letter);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = useCallback(() => {
    setDraggingLetter(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  const HighScorePopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-cyan-500/90 to-purple-500/90 p-8 rounded-2xl border-4 border-yellow-400 max-w-md mx-4 animate-bounce">
        <div className="text-center space-y-4">
          <Award size={64} className="mx-auto text-yellow-400" />
          <h2 className="text-4xl font-black text-white">Amazing!</h2>
          <p className="text-2xl text-white">You have completed {gamesCompleted} games!</p>
          <p className="text-3xl font-bold text-yellow-400">Total Score: {totalScore}</p>
          <button
            onClick={() => setShowHighScore(false)}
            className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:scale-110 transition-transform"
          >
            Keep Playing!
          </button>
        </div>
      </div>
    </div>
  );

  const MathGame = () => {
    const [problem] = useState(() => {
      const operations = [
        { a: Math.floor(Math.random() * 10) + 5, b: Math.floor(Math.random() * 10) + 1, op: '+' },
        { a: Math.floor(Math.random() * 10) + 10, b: Math.floor(Math.random() * 8) + 1, op: '-' },
        { a: Math.floor(Math.random() * 8) + 2, b: Math.floor(Math.random() * 8) + 2, op: '×' },
      ];
      const selected = operations[Math.floor(Math.random() * operations.length)];
      let answer;
      if (selected.op === '+') answer = selected.a + selected.b;
      else if (selected.op === '-') answer = selected.a - selected.b;
      else answer = selected.a * selected.b;
      return { ...selected, answer };
    });
    const [options] = useState(() => {
      const opts = [problem.answer];
      while (opts.length < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const wrong = problem.answer + offset;
        if (wrong !== problem.answer && wrong > 0 && !opts.includes(wrong)) {
          opts.push(wrong);
        }
      }
      return opts.sort(() => Math.random() - 0.5);
    });
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('Tap the correct answer!');
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleClick = (answer) => {
      if (won) return;
      setSelectedAnswer(answer);

      if (answer === problem.answer) {
        setWon(true);
        setMessage('Correct! +2 points');
        completeGame(2);
      } else {
        setMessage('Wrong! Try again');
        setTimeout(() => setSelectedAnswer(null), 500);
      }
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Quick Math</h3>
            <p className="text-sm text-white/70">Easy • 2 points</p>
          </div>
        </div>
        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-white mb-2">
            {problem.a} {problem.op} {problem.b} = ?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(opt)}
              disabled={won}
              className={`py-4 text-2xl font-bold rounded-xl transition-all ${
                won && opt === problem.answer
                  ? 'bg-green-500 text-white'
                  : selectedAnswer === opt && opt !== problem.answer
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              } ${won ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            >
              {opt}
            </button>
          ))}
        </div>
        <p className={`text-center text-lg font-medium ${won ? 'text-yellow-300' : 'text-white'}`}>
          {message}
        </p>
        {won && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentGameType(getRandomGame())}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Next Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const TicTacToeGame = () => {
    const [board, setBoard] = useState(['X', 'O', 'X', 'O', 'X', '', '', 'O', '']);
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('Complete the line! (X\'s turn)');

    const handleClick = (idx) => {
      if (won || board[idx]) return;

      if (idx === 8) {
        const newBoard = [...board];
        newBoard[idx] = 'X';
        setBoard(newBoard);
        setWon(true);
        setMessage('You won! +1 point');
        completeGame(1);
      } else {
        setMessage('That won\'t win! Try again');
      }
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Win in 1 Move</h3>
            <p className="text-sm text-white/70">Easy • 1 point</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`aspect-square flex items-center justify-center text-4xl font-bold rounded-xl transition-all ${
                won ? 'cursor-not-allowed bg-white/10' : 'hover:bg-white/30 cursor-pointer bg-white/20'
              } ${cell === 'X' ? 'text-cyan-400' : 'text-pink-400'}`}
            >
              {cell}
            </button>
          ))}
        </div>
        <p className={`text-center text-lg font-medium ${won ? 'text-yellow-300' : 'text-white'}`}>
          {message}
        </p>
        {won && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentGameType(getRandomGame())}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Next Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const PatternGame = () => {
    const [pattern] = useState(() => {
      const p = Array(9).fill(0);
      p[Math.floor(Math.random() * 9)] = 1;
      return p;
    });
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('Find the different one!');

    const handleClick = (idx) => {
      if (won) return;

      if (pattern[idx] === 1) {
        setWon(true);
        setMessage('Found it! +1 point');
        completeGame(1);
      } else {
        setMessage('Not that one! Keep looking');
      }
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Odd One Out</h3>
            <p className="text-sm text-white/70">Easy • 1 point</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
          {pattern.map((type, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`aspect-square flex items-center justify-center rounded-xl transition-all ${
                won ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'
              } ${type === 0 ? 'bg-cyan-500' : 'bg-cyan-400'}`}
            >
              <div className={`w-12 h-12 rounded-full ${type === 0 ? 'bg-cyan-700' : 'bg-cyan-600'}`} />
            </button>
          ))}
        </div>
        <p className={`text-center text-lg font-medium ${won ? 'text-yellow-300' : 'text-white'}`}>
          {message}
        </p>
        {won && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentGameType(getRandomGame())}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Next Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const SimonGame = () => {
    const [sequence] = useState(() => [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4)
    ]);
    const [userSequence, setUserSequence] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('Watch the pattern...');
    const [highlightIdx, setHighlightIdx] = useState(null);

    useEffect(() => {
      sequence.forEach((idx, i) => {
        setTimeout(() => {
          setHighlightIdx(idx);
          setTimeout(() => setHighlightIdx(null), 400);
          if (i === sequence.length - 1) {
            setTimeout(() => {
              setIsPlaying(false);
              setMessage('Now repeat the pattern!');
            }, 500);
          }
        }, i * 800);
      });
    }, []);

    const handleClick = (idx) => {
      if (isPlaying || won) return;

      const newUserSeq = [...userSequence, idx];
      setUserSequence(newUserSeq);

      if (sequence[newUserSeq.length - 1] !== idx) {
        setMessage('Wrong! Starting over...');
        setTimeout(() => {
          setUserSequence([]);
          setMessage('Watch again!');
          setIsPlaying(true);
          sequence.forEach((idx, i) => {
            setTimeout(() => {
              setHighlightIdx(idx);
              setTimeout(() => setHighlightIdx(null), 400);
              if (i === sequence.length - 1) {
                setTimeout(() => {
                  setIsPlaying(false);
                  setMessage('Try again!');
                }, 500);
              }
            }, i * 800);
          });
        }, 1000);
      } else if (newUserSeq.length === sequence.length) {
        setWon(true);
        setMessage('Perfect memory! +3 points');
        completeGame(3);
      }
    };

    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Pattern Memory</h3>
            <p className="text-sm text-white/70">Hard • 3 points</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`aspect-square rounded-xl transition-all ${colors[idx]} ${
                highlightIdx === idx ? 'opacity-100 scale-95' : 'opacity-50'
              } ${isPlaying || won ? 'cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
            />
          ))}
        </div>
        <p className={`text-center text-lg font-medium ${won ? 'text-yellow-300' : 'text-white'}`}>
          {message}
        </p>
        {won && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentGameType(getRandomGame())}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Next Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Reaction Time Game
  const ReactionGame = () => {
    const [gameState, setGameState] = useState('waiting'); // waiting, ready, done
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [won, setWon] = useState(false);

    useEffect(() => {
      if (gameState === 'waiting') {
        const delay = Math.random() * 3000 + 2000;
        const timer = setTimeout(() => {
          setStartTime(Date.now());
          setGameState('ready');
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [gameState]);

    const handleClick = () => {
      if (gameState === 'waiting') {
        // Too early - restart
        setGameState('waiting');
      } else if (gameState === 'ready') {
        const time = Date.now() - startTime;
        setReactionTime(time);
        setGameState('done');
        if (time < 500) {
          setWon(true);
          completeGame(3);
        }
      }
    };

    return (
      <div className={`p-6 rounded-2xl backdrop-blur-md border-2 border-white/40 ${darkMode ? 'bg-gray-800/40' : 'bg-white/20'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-white'}`}>Reaction Test</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-white/70'}`}>Medium • 3 points</p>
          </div>
        </div>
        <button
          onClick={handleClick}
          className={`w-full h-40 rounded-xl text-2xl font-bold transition-all ${
            gameState === 'waiting' ? 'bg-red-500 text-white' :
            gameState === 'ready' ? 'bg-green-500 text-white animate-pulse' :
            won ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
          }`}
        >
          {gameState === 'waiting' && 'Wait for green...'}
          {gameState === 'ready' && 'CLICK NOW!'}
          {gameState === 'done' && (won ? `${reactionTime}ms - Great! +3` : `${reactionTime}ms - Try again!`)}
        </button>
        {gameState === 'done' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentGameType(getRandomGame())}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Next Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2 rounded-lg hover:bg-white/30 transition-colors ${darkMode ? 'bg-gray-700 text-white' : 'bg-white/20 text-white'}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Word Scramble Game
  const WordScrambleGame = () => {
    const words = ['DESIGN', 'CREATE', 'BUILD', 'THINK', 'DREAM', 'CRAFT'];
    const [word] = useState(() => words[Math.floor(Math.random() * words.length)]);
    const [scrambled] = useState(() => word.split('').sort(() => Math.random() - 0.5).join(''));
    const [guess, setGuess] = useState('');
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('Unscramble the word!');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (guess.toUpperCase() === word) {
        setWon(true);
        setMessage('Correct! +2 points');
        completeGame(2);
      } else {
        setMessage('Try again!');
        setGuess('');
      }
    };

    return (
      <div className={`p-6 rounded-2xl backdrop-blur-md border-2 border-white/40 ${darkMode ? 'bg-gray-800/40' : 'bg-white/20'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-white'}`}>Word Scramble</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-white/70'}`}>Easy • 2 points</p>
          </div>
        </div>
        <div className="text-center mb-6">
          <p className={`text-5xl font-bold mb-2 tracking-widest ${darkMode ? 'text-gray-100' : 'text-white'}`}>
            {scrambled}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={won}
            placeholder="Your answer..."
            className={`w-full px-4 py-3 rounded-lg border-2 text-center text-xl font-bold uppercase ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white/20 border-white/30 text-white placeholder-white/50'
            }`}
          />
          {!won && (
            <button type="submit" className="w-full py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors">
              Submit
            </button>
          )}
        </form>
        <p className={`text-center text-lg font-medium mt-4 ${won ? 'text-yellow-300' : darkMode ? 'text-gray-200' : 'text-white'}`}>
          {message}
        </p>
        {won && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentGameType(getRandomGame())}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 transition-colors"
            >
              Next Game
            </button>
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2 rounded-lg hover:bg-white/30 transition-colors ${darkMode ? 'bg-gray-700 text-white' : 'bg-white/20 text-white'}`}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const NavItem = ({ icon: Icon, label, page }) => (
    <button
      onClick={() => navigateTo(page)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        currentPage === page
          ? 'bg-black/20 text-black shadow-lg scale-105'
          : 'hover:bg-black/10 text-black/70 hover:text-black'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const GameSection = () => (
    <div className="w-full">
      {currentGameType === 'math' && <MathGame />}
      {currentGameType === 'tictactoe' && <TicTacToeGame />}
      {currentGameType === 'pattern' && <PatternGame />}
      {currentGameType === 'simon' && <SimonGame />}
      {currentGameType === 'reaction' && <ReactionGame />}
      {currentGameType === 'wordscramble' && <WordScrambleGame />}
    </div>
  );

  // Drudge-style links component
  const NewsLinks = () => (
    <div className="p-4 rounded-2xl bg-black/90 border-2 border-white/20">
      <h3 className="text-center font-bold text-red-500 text-lg mb-3 border-b border-white/20 pb-2">
        ★ HEADLINES ★
      </h3>
      <div className="max-h-80 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
        {NEWS_LINKS.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-white hover:text-cyan-400 hover:bg-white/10 px-2 py-1 rounded transition-colors"
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="space-y-8">
      {/* Retro 90s header */}
      <div className="text-center space-y-3 py-8 border-4 border-black bg-yellow-300">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">★</span>
          <span className="text-xs uppercase tracking-widest font-bold text-black">Established 2024</span>
          <span className="text-xl">★</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-black leading-none select-none" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          {[
            { key: 'A', char: 'A' },
            { key: 'L', char: 'L' },
            { key: 'T', char: 'T' },
            { key: '-', char: '-' },
            { key: 'T2', char: 'T' },
            { key: 'A2', char: 'A' },
            { key: 'B', char: 'B' },
          ].map((letter) => (
            <span
              key={letter.key}
              onMouseDown={(e) => handleLetterMouseDown(letter.key, e)}
              style={{
                display: 'inline-block',
                color: '#000000',
                textShadow: '2px 2px 0px #ff0000, 4px 4px 0px #0000ff',
                cursor: 'grab',
                transform: `translate(${letterPositions[letter.key].x}px, ${letterPositions[letter.key].y}px)`,
                transition: draggingLetter === letter.key ? 'none' : 'transform 0.1s ease-out',
                userSelect: 'none',
              }}
              className="hover:scale-110 active:cursor-grabbing"
            >
              {letter.char}
            </span>
          ))}
        </h1>
        <p className="text-base md:text-lg text-black font-bold uppercase px-4">
          ★★ Multi-Disciplinary Think Tank ★★
        </p>
      </div>

      {/* World Clocks */}
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        {[
          { city: 'LOS ANGELES', tz: 'America/Los_Angeles' },
          { city: 'NASHVILLE', tz: 'America/Chicago' },
          { city: 'NEW YORK', tz: 'America/New_York' },
          { city: 'LISBON', tz: 'Europe/Lisbon' },
          { city: 'JOHANNESBURG', tz: 'Africa/Johannesburg' },
          { city: 'TOKYO', tz: 'Asia/Tokyo' },
        ].map((clock) => (
          <div key={clock.city} className="bg-black text-lime-400 px-3 py-2 border-2 border-lime-400 font-mono">
            <span className="text-white/60">{clock.city}:</span>{' '}
            {currentTime.toLocaleTimeString('en-US', {
              timeZone: clock.tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        ))}
      </div>

      {/* Game + News Links section */}
      <div className="border-4 border-black bg-gradient-to-b from-gray-200 to-gray-300 p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <GameSection />
          <NewsLinks />
        </div>
      </div>

      {/* About sections */}
      <div className="border-4 border-black bg-white">
        <div className="bg-red-600 text-white px-4 py-3 border-b-4 border-black">
          <h2 className="font-bold text-2xl md:text-3xl uppercase text-center">About Alt-Tab</h2>
        </div>
        <div className="grid md:grid-cols-3">
          <button onClick={() => navigateTo('about')} className="border-2 border-black p-6 bg-gray-100 hover:bg-gray-200 transition-colors text-left">
            <h3 className="font-bold text-black mb-3 underline text-lg">Human-Centric Design</h3>
            <p className="text-sm text-black">Founded by a library scientist and industrial designer, we blend research with creativity.</p>
          </button>
          <button onClick={() => navigateTo('about')} className="border-2 border-black p-6 bg-gray-100 hover:bg-gray-200 transition-colors text-left">
            <h3 className="font-bold text-black mb-3 underline text-lg">Multi-Disciplinary</h3>
            <p className="text-sm text-black">From digital goods to policy, we create experiences that matter.</p>
          </button>
          <button onClick={() => navigateTo('about')} className="border-2 border-black p-6 bg-gray-100 hover:bg-gray-200 transition-colors text-left">
            <h3 className="font-bold text-black mb-3 underline text-lg">Future-Forward</h3>
            <p className="text-sm text-black">Bridging nostalgia with innovation, one project at a time.</p>
          </button>
        </div>
      </div>


      {/* Navigation buttons - now functional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { text: 'VIEW PROJECTS', color: 'bg-blue-500', page: 'projects' },
          { text: 'MOODBOARDS', color: 'bg-green-500', page: 'moodboards' },
          { text: 'PHILOSOPHY', color: 'bg-purple-500', page: 'about' },
          { text: 'SHOP', color: 'bg-red-500', page: 'shop' }
        ].map((link, i) => (
          <button
            key={i}
            onClick={() => navigateTo(link.page)}
            className={`${link.color} text-white font-bold py-4 px-3 border-4 border-black hover:brightness-110 transition-all text-sm md:text-base active:scale-95`}
            style={{ boxShadow: '5px 5px 0px black' }}
          >
            ► {link.text} ◄
          </button>
        ))}
      </div>

      {/* Badges section */}
      <div className="text-center space-y-3 bg-white border-4 border-black p-6">
        <div className="flex justify-center gap-3 items-center flex-wrap">
          <div className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-3 py-1 text-xs font-bold border-2 border-black">
            REACT 18
          </div>
          <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-black px-3 py-1 text-xs font-bold border-2 border-black">
            TAILWIND CSS
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold border-2 border-black">
            VITE
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectsPage = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: '',
      message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', company: '', message: '' });
      }, 3000);
    };

    const categories = ['All', 'Product', 'Experience', 'Research', 'Digital', 'Sport', 'Education'];

    const projects = [
      { name: 'USM Furniture', category: 'Product', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/USM_Logo.svg/512px-USM_Logo.svg.png', description: 'Modular furniture system design' },
      { name: 'Nike NYC', category: 'Experience', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/512px-Logo_NIKE.svg.png', description: 'Retail experience design' },
      { name: 'MLB Streaming', category: 'Digital', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Major_League_Baseball_logo.svg/440px-Major_League_Baseball_logo.svg.png', description: 'Digital streaming platform' },
      { name: 'Live Breathe Futbol', category: 'Sport', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop', description: 'Football apparel brand' },
      { name: 'Stanford Research Lab', category: 'Research', logo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop', description: 'Research methodology design' },
      { name: 'EdTech Platform', category: 'Education', logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop', description: 'Learning experience design' },
      { name: 'Retail Analytics', category: 'Digital', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop', description: 'Data visualization dashboard' },
      { name: 'Museum Interactive', category: 'Experience', logo: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=200&h=200&fit=crop', description: 'Interactive exhibit design' },
    ];

    const filteredProjects = activeFilter === 'All'
      ? projects
      : projects.filter(p => p.category === activeFilter);

    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Our Work</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            From digital tools to physical spaces, policy frameworks to immersive experiences
          </p>
        </div>

        {/* Filter Labels */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                activeFilter === cat
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              } border-2 border-white/30 hover:border-white/60`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProjects.map((project, i) => (
            <div
              key={i}
              className="group bg-white rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-black hover:shadow-xl"
            >
              <div className="h-24 flex items-center justify-center mb-4">
                <img
                  src={project.logo}
                  alt={project.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="font-bold text-black text-center text-lg">{project.name}</h3>
              <p className="text-sm text-gray-600 text-center mt-2">{project.description}</p>
              <div className="mt-3 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{project.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto pt-12">
          <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3">Work With Us</h3>
              <p className="text-white/80 text-lg">
                Have a project in mind? Let's create something amazing together.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles size={40} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Thank You!</h4>
                <p className="text-white/80">We will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:border-white/60 focus:outline-none backdrop-blur-sm transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:border-white/60 focus:outline-none backdrop-blur-sm transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:border-white/60 focus:outline-none backdrop-blur-sm transition-colors"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Tell us about your project *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:border-white/60 focus:outline-none backdrop-blur-sm transition-colors resize-none"
                    placeholder="What are you looking to create? What challenges are you facing?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MoodboardsPage = () => {
    const moodboardItems = [
      // XL - Hero items
      { type: 'image', src: 'https://images.unsplash.com/photo-1545419913-775e2e148963?w=1200&q=80', alt: 'Nashville Skyline', size: 'xl' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=1200&q=80', alt: 'Minimalist Furniture', size: 'xl' },
      // Large
      { type: 'image', src: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1000&q=80', alt: 'Muralist', size: 'large' },
      { type: 'video', src: 'https://img.youtube.com/vi/cFwytlpCJ9U/maxresdefault.jpg', alt: 'Video', link: 'https://www.youtube.com/watch?v=cFwytlpCJ9U', size: 'large' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1000&q=80', alt: 'Brutalist Architecture', size: 'large' },
      // Medium
      { type: 'image', src: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80', alt: 'Retail Interior', size: 'medium' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80', alt: 'Fine Art', size: 'medium' },
      { type: 'video', src: 'https://img.youtube.com/vi/tdrRKLjztcQ/maxresdefault.jpg', alt: 'Video', link: 'https://www.youtube.com/watch?v=tdrRKLjztcQ', size: 'medium' },
      // Small
      { type: 'image', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', alt: 'Sneaker', size: 'small' },
      { type: 'logo', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Prada-Logo.svg/512px-Prada-Logo.svg.png', alt: 'Prada', size: 'small' },
      // Large
      { type: 'image', src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80', alt: 'Street Artist', size: 'large' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1000&q=80', alt: 'Japanese Architecture', size: 'large' },
      // Medium
      { type: 'video', src: 'https://img.youtube.com/vi/sKE1nLc5P_c/maxresdefault.jpg', alt: 'Video', link: 'https://www.youtube.com/watch?v=sKE1nLc5P_c', size: 'medium' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80', alt: 'Abstract Art', size: 'medium' },
      // Small
      { type: 'logo', src: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/New_York_Mets.svg/440px-New_York_Mets.svg.png', alt: 'Mets', size: 'small' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', alt: 'Geometric', size: 'small' },
      { type: 'logo', src: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/440px-Arsenal_FC.svg.png', alt: 'Arsenal', size: 'small' },
      // XL
      { type: 'image', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', alt: 'Urban Culture', size: 'xl' },
      // Medium
      { type: 'image', src: 'https://images.unsplash.com/photo-1574182245530-967d9b3831af?w=800&q=80', alt: 'Impressionist', size: 'medium' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&q=80', alt: 'Street Art', size: 'medium' },
      // Small
      { type: 'image', src: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=600&q=80', alt: 'Neon', size: 'small' },
      // Large
      { type: 'image', src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80', alt: 'Fashion', size: 'large' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1000&q=80', alt: 'Installation', size: 'large' },
      // Medium
      { type: 'image', src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', alt: 'Architecture', size: 'medium' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80', alt: 'Sunset', size: 'medium' },
      // Small
      { type: 'image', src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', alt: 'Basketball', size: 'small' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&q=80', alt: 'Hoops', size: 'small' },
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Moodboards</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Visual inspiration from architecture, fine art, and contemporary design
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {moodboardItems.map((item, i) => {
            const heightClass = item.size === 'xl' ? 'h-96 md:h-[28rem]' : item.size === 'large' ? 'h-80 md:h-96' : item.size === 'medium' ? 'h-64 md:h-72' : 'h-48 md:h-56';

            if (item.type === 'video') {
              return (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block ${heightClass} rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group break-inside-avoid mb-4`}
                >
                  <img src={item.src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" style={{ borderLeftWidth: '12px', borderLeftColor: 'white', borderLeftStyle: 'solid' }} />
                    </div>
                  </div>
                </a>
              );
            }

            if (item.type === 'logo') {
              return (
                <div
                  key={i}
                  className={`${heightClass} rounded-xl bg-white border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group break-inside-avoid mb-4 flex items-center justify-center p-6`}
                >
                  <img src={item.src} alt="" loading="lazy" decoding="async" className="max-w-full max-h-full object-contain" />
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`${heightClass} rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group break-inside-avoid mb-4`}
              >
                <img src={item.src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AboutPage = () => {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Philosophy</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Where research meets creativity, and ideas become reality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30">
            <h3 className="text-2xl font-bold text-white mb-4">Human-Centric Design</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              At Alt-Tab, we believe that exceptional design begins with deep understanding. Our human-centric approach places people at the center of every project, ensuring that the products and experiences we create genuinely improve lives.
            </p>
            <p className="text-white/80 leading-relaxed">
              Through rigorous user research and empathy-driven methodologies, we uncover insights that inform meaningful solutions. We don't design for users—we design with them.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30">
            <h3 className="text-2xl font-bold text-white mb-4">Research-Driven Process</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              Our process is grounded in systematic research and evidence-based decision making. We combine qualitative and quantitative methods to build a comprehensive understanding of complex challenges.
            </p>
            <p className="text-white/80 leading-relaxed">
              From ethnographic studies to data analysis, our research practice ensures that every design decision is informed by real-world insights rather than assumptions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30">
            <h3 className="text-2xl font-bold text-white mb-4">Rapid Prototyping</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              We believe in learning by making. Our rapid prototyping approach allows us to quickly test ideas, gather feedback, and iterate toward optimal solutions.
            </p>
            <p className="text-white/80 leading-relaxed">
              By creating tangible artifacts early in the process, we reduce risk and accelerate innovation. Fail fast, learn faster—that's the Alt-Tab way.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30">
            <h3 className="text-2xl font-bold text-white mb-4">Multi-Disciplinary Collaboration</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              Complex problems require diverse perspectives. Our team brings together expertise from industrial design, library science, technology, and strategic consulting.
            </p>
            <p className="text-white/80 leading-relaxed">
              This cross-pollination of disciplines enables us to approach challenges from multiple angles and deliver holistic solutions that address both immediate needs and long-term impact.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 backdrop-blur-md border-2 border-white/30">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-xl text-white/90 leading-relaxed mb-6">
              Alt-Tab exists to bridge the gap between human needs and technological possibility. We are a think tank dedicated to designing experiences and products that enhance the quality of human life.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              Whether developing digital platforms, physical products, policy frameworks, or immersive experiences, we maintain an unwavering commitment to thoughtful, intentional design that serves people first.
            </p>
          </div>
        </div>

        <GameSection />
      </div>
    );
  };

  const ShopPage = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Shop</h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Curated goods from Alt-Tab
        </p>
      </div>

      {/* Under Construction Notice */}
      <div className="max-w-2xl mx-auto">
        <div className="p-8 md:p-12 rounded-2xl bg-yellow-400/90 border-4 border-black text-center">
          <Construction size={64} className="mx-auto text-black mb-4" />
          <h3 className="text-3xl font-black text-black mb-4">Under Construction</h3>
          <p className="text-lg text-black/80 mb-6">
            We're working on something special. Our shop will feature limited edition goods,
            digital zines, and exclusive Alt-Tab merchandise.
          </p>
          <p className="text-sm text-black/60 font-mono">
            Check back soon for updates.
          </p>
        </div>
      </div>

      <GameSection />
    </div>
  );

  return (
    <div className={`min-h-screen overflow-x-hidden cursor-none ${darkMode ? 'bg-gray-100 text-gray-900' : 'text-white'}`}>
      {/* Golf Ball Cursor */}
      {golfBall.visible && (
        <div
          className="fixed w-6 h-6 rounded-full pointer-events-none z-[100] shadow-lg"
          style={{
            left: golfBall.x - 12,
            top: golfBall.y - 12,
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0, #a0a0a0)',
            boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 2px 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {/* Golf ball dimples */}
          <div className="absolute inset-1 rounded-full opacity-30" style={{
            background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)'
          }} />
        </div>
      )}

      {/* Background - Light or Dark mode */}
      {darkMode ? (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200" />
      ) : (
        <>
          <div
            className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${BACKGROUND_IMAGE})`,
            }}
          />
          <div className="fixed inset-0 bg-black/60" />
        </>
      )}

      {showHighScore && <HighScorePopup />}

      <nav className="relative z-50 p-4 md:p-6 border-b-4 border-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={() => navigateTo('home')}
            className="text-2xl md:text-3xl font-black hover:scale-110 transition-transform text-black drop-shadow-sm"
          >
            ALT-TAB
          </button>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition-all bg-black/10 hover:bg-black/20 text-black"
              title={darkMode ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 border-2 border-black/20">
              <Trophy size={20} className="text-black" />
              <span className="font-bold text-black">{totalScore}</span>
            </div>
          </div>

          <div className="hidden md:flex gap-2">
            <NavItem icon={Sparkles} label="Home" page="home" />
            <NavItem icon={Grid3x3} label="Projects" page="projects" />
            <NavItem icon={Image} label="Moodboards" page="moodboards" />
            <NavItem icon={BookOpen} label="About" page="about" />
            <NavItem icon={ShoppingBag} label="Shop" page="shop" />
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/10 text-black"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 p-4 space-y-2 border-b-4 border-black">
            <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-black/10 border-2 border-black/20">
              <Trophy size={20} className="text-black" />
              <span className="text-black font-bold">{totalScore} points</span>
            </div>
            <NavItem icon={Sparkles} label="Home" page="home" />
            <NavItem icon={Grid3x3} label="Projects" page="projects" />
            <NavItem icon={Image} label="Moodboards" page="moodboards" />
            <NavItem icon={BookOpen} label="About" page="about" />
            <NavItem icon={ShoppingBag} label="Shop" page="shop" />
          </div>
        )}
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'projects' && <ProjectsPage />}
        {currentPage === 'moodboards' && <MoodboardsPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'shop' && <ShopPage />}
      </main>

      <footer className={`relative z-10 text-center py-8 text-sm ${darkMode ? 'text-gray-600' : 'text-white/80'}`}>
        <div className="flex items-center justify-center gap-4 mb-3">
          <a
            href="https://www.instagram.com/alttab.xyz/#"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105 ${darkMode ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-white/20 hover:bg-white/30 text-white'}`}
          >
            <Instagram size={18} />
            <span className="font-medium">@alttab</span>
          </a>
        </div>
        <p>© 2024 Alt-Tab Think Tank · Multi-Disciplinary</p>
      </footer>
    </div>
  );
};

export default AltTabWebsite;
