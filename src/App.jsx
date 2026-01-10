import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, Zap, Grid3x3, Image, BookOpen, ShoppingBag, Trophy, RefreshCw, Award, MapPin } from 'lucide-react';

// City data with coordinates for map background
const CITIES = [
  { name: 'Nashville, TN', lat: 36.1627, lng: -86.7816, country: 'USA' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { name: 'New York, NY', lat: 40.7128, lng: -74.0060, country: 'USA' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
  { name: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, country: 'USA' },
  { name: 'Copenhagen', lat: 55.6761, lng: 12.5683, country: 'Denmark' },
];

const AltTabWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [cursorTrail, setCursorTrail] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const [showHighScore, setShowHighScore] = useState(false);
  const [currentGameType, setCurrentGameType] = useState(() => {
    const games = ['math', 'tictactoe', 'pattern', 'simon'];
    return games[Math.floor(Math.random() * games.length)];
  });
  const [currentCity] = useState(() => CITIES[Math.floor(Math.random() * CITIES.length)]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
      setCursorTrail(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY, id: Date.now() }]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas map background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawMap();
    };

    const drawMap = () => {
      // Draw gradient background first
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load map tiles from OpenStreetMap (free, no API key required)
      const zoom = 14;
      const tileSize = 256;

      // Convert lat/lng to tile coordinates
      const latRad = currentCity.lat * Math.PI / 180;
      const n = Math.pow(2, zoom);
      const xTile = Math.floor((currentCity.lng + 180) / 360 * n);
      const yTile = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);

      // Calculate how many tiles we need to cover the screen
      const tilesX = Math.ceil(canvas.width / tileSize) + 2;
      const tilesY = Math.ceil(canvas.height / tileSize) + 2;

      // Load and draw map tiles
      const startX = xTile - Math.floor(tilesX / 2);
      const startY = yTile - Math.floor(tilesY / 2);

      for (let i = 0; i < tilesX; i++) {
        for (let j = 0; j < tilesY; j++) {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';

          const tileX = startX + i;
          const tileY = startY + j;

          // Use CartoDB dark tiles (free, no API key, CORS-enabled)
          img.src = `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${zoom}/${tileX}/${tileY}.png`;

          img.onload = () => {
            const posX = i * tileSize - (tilesX * tileSize - canvas.width) / 2;
            const posY = j * tileSize - (tilesY * tileSize - canvas.height) / 2;

            ctx.globalAlpha = 0.4;
            ctx.drawImage(img, posX, posY, tileSize, tileSize);
            ctx.globalAlpha = 1;
          };
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentCity]);

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
    const games = ['math', 'tictactoe', 'pattern', 'simon'];
    const availableGames = games.filter(g => g !== currentGameType);
    return availableGames[Math.floor(Math.random() * availableGames.length)];
  };

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

  const NavItem = ({ icon: Icon, label, page }) => (
    <button
      onClick={() => { setCurrentPage(page); setMenuOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
        currentPage === page
          ? 'bg-white/30 text-white shadow-lg scale-105 backdrop-blur-md'
          : 'hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-sm'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const InteractiveCard = ({ title, children, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-6 rounded-2xl border-2 backdrop-blur-md transition-all duration-500 cursor-pointer ${
          isHovered
            ? 'border-white/60 bg-white/30 shadow-2xl scale-105 -translate-y-2'
            : 'border-white/30 bg-white/10'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {isHovered && (
          <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl -z-10" />
        )}
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        {children}
      </div>
    );
  };

  const GameSection = () => (
    <div className="max-w-2xl mx-auto">
      {currentGameType === 'math' && <MathGame />}
      {currentGameType === 'tictactoe' && <TicTacToeGame />}
      {currentGameType === 'pattern' && <PatternGame />}
      {currentGameType === 'simon' && <SimonGame />}
    </div>
  );

  const HomePage = () => (
    <div className="space-y-8">
      {/* Retro 90s header with marquee feel */}
      <div className="text-center space-y-3 py-8 border-4 border-black bg-yellow-300">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">★</span>
          <span className="text-xs uppercase tracking-widest font-bold text-black">Est. 2024</span>
          <span className="text-xl">★</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-black leading-none" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          <span style={{
            display: 'inline-block',
            color: '#000000',
            textShadow: '2px 2px 0px #ff0000, 4px 4px 0px #0000ff'
          }}>
            ALT-TAB
          </span>
        </h1>
        <p className="text-base md:text-lg text-black font-bold uppercase px-4">
          ★★ Multi-Disciplinary Think Tank ★★ Based on Earth ★★
        </p>
        <div className="flex gap-3 justify-center items-center text-black text-sm font-bold">
          <span className="animate-pulse text-lg">►</span>
          <span>EXPLORE · CREATE · TRANSFORM</span>
          <span className="animate-pulse text-lg">◄</span>
        </div>
      </div>

      {/* Visitor counter style */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="bg-black text-lime-400 px-4 py-2 border-2 border-lime-400 font-mono">
          VISITORS: {Math.floor(Math.random() * 99999)}
        </div>
        <div className="bg-black text-cyan-400 px-4 py-2 border-2 border-cyan-400 font-mono">
          ONLINE NOW: {Math.floor(Math.random() * 50)}
        </div>
      </div>

      {/* Game section with retro frame */}
      <div className="border-4 border-black bg-gradient-to-b from-gray-200 to-gray-300 p-4">
        <div className="bg-blue-600 text-white px-3 py-2 mb-4 border-2 border-white" style={{ boxShadow: 'inset -2px -2px 0px rgba(0,0,0,0.5)' }}>
          <h3 className="font-bold text-sm">🎮 QUICK GAMES - Test Your Skills!</h3>
        </div>
        <GameSection />
      </div>

      {/* Table-based layout sections */}
      <div className="border-4 border-black bg-white">
        <div className="bg-red-600 text-white px-4 py-3 border-b-4 border-black">
          <h2 className="font-bold text-xl uppercase text-center">★★★ About Alt-Tab ★★★</h2>
        </div>
        <div className="grid md:grid-cols-3">
          <div className="border-2 border-black p-6 bg-yellow-100">
            <h3 className="font-bold text-black mb-3 underline text-lg">Human-Centric Design</h3>
            <p className="text-sm text-black mb-3">Founded by a library scientist and industrial designer, we blend research with creativity.</p>
            <p className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800">[Read more...]</p>
          </div>
          <div className="border-2 border-black p-6 bg-cyan-100">
            <h3 className="font-bold text-black mb-3 underline text-lg">Multi-Disciplinary</h3>
            <p className="text-sm text-black mb-3">From digital goods to policy, we create experiences that matter.</p>
            <p className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800">[Read more...]</p>
          </div>
          <div className="border-2 border-black p-6 bg-pink-100">
            <h3 className="font-bold text-black mb-3 underline text-lg">Future-Forward</h3>
            <p className="text-sm text-black mb-3">Bridging nostalgia with innovation, one project at a time.</p>
            <p className="text-xs text-blue-600 underline cursor-pointer hover:text-blue-800">[Read more...]</p>
          </div>
        </div>
      </div>

      {/* Under construction style banner */}
      <div className="border-4 border-yellow-400 bg-black p-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
          <span className="text-3xl">⚠️</span>
          <span className="text-yellow-400 font-bold uppercase text-base md:text-lg">Site Under Active Development</span>
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-white text-xs md:text-sm">Last Updated: January 6, 2026 | Best Viewed in 800x600 Resolution</p>
      </div>

      {/* Web ring style links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { text: 'VIEW PROJECTS', color: 'bg-blue-500' },
          { text: 'MOODBOARDS', color: 'bg-green-500' },
          { text: 'PHILOSOPHY', color: 'bg-purple-500' },
          { text: 'SHOP NOW', color: 'bg-red-500' }
        ].map((link, i) => (
          <button
            key={i}
            className={`${link.color} text-white font-bold py-4 px-3 border-4 border-black hover:brightness-110 transition-all text-sm md:text-base`}
            style={{ boxShadow: '5px 5px 0px black' }}
          >
            ► {link.text} ◄
          </button>
        ))}
      </div>

      {/* Blinking text and badges section */}
      <div className="text-center space-y-3 bg-white border-4 border-black p-6">
        <p className="text-black text-sm md:text-base">
          <span className="font-bold bg-yellow-300 px-2 py-1">NEW!</span> Join our mailing list for updates!
          <span className="ml-2 text-red-600 font-bold animate-pulse">→ CLICK HERE ←</span>
        </p>
        <div className="flex justify-center gap-3 items-center flex-wrap">
          <div className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-3 py-1 text-xs font-bold border-2 border-black">
            HTML 4.01
          </div>
          <div className="bg-gradient-to-r from-green-500 to-yellow-500 text-black px-3 py-1 text-xs font-bold border-2 border-black">
            CSS ENABLED
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold border-2 border-black">
            JAVASCRIPT
          </div>
        </div>
      </div>
    </div>
  );

  const ProjectsPage = () => {
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

    const projects = [
      { title: 'Digital Archive Platform', category: 'Digital Goods', size: 'large', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop' },
      { title: 'Modular Office System', category: 'Furniture', size: 'medium', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop' },
      { title: 'Athletic Apparel Line', category: 'Sportswear', size: 'medium', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop' },
      { title: 'E-Commerce Experience', category: 'Web Design', size: 'large', image: 'https://images.unsplash.com/photo-1522542550221-31fd8575f4a7?w=800&h=600&fit=crop' },
      { title: 'Minimalist Shelving', category: 'Furniture', size: 'small', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
      { title: 'Team Kit Design', category: 'Sportswear', size: 'medium', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=400&fit=crop' },
      { title: 'Portfolio Website', category: 'Web Design', size: 'small', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=400&fit=crop' },
      { title: 'Training Gear Collection', category: 'Sportswear', size: 'medium', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=400&fit=crop' },
      { title: 'Workspace Furniture Suite', category: 'Furniture', size: 'large', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop' },
    ];

    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Our Work</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            From digital tools to physical spaces, policy frameworks to immersive experiences
          </p>
        </div>

        <div className="grid grid-cols-6 gap-3 md:gap-4">
          {projects.map((project, i) => {
            const sizeClasses = {
              small: 'col-span-2 row-span-2',
              medium: 'col-span-3 row-span-2',
              large: 'col-span-6 md:col-span-3 row-span-3'
            };

            return (
              <div
                key={i}
                className={`group relative ${sizeClasses[project.size]} rounded-xl bg-white/20 backdrop-blur-md border-2 border-white/30 overflow-hidden hover:border-white/60 transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span className="text-xs text-white/70 uppercase tracking-wider mb-1">{project.category}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">{project.title}</h3>
                </div>
              </div>
            );
          })}
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
    const moodboardImages = [
      { src: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600&h=600&fit=crop', alt: 'Skateboard deck art', category: 'Skate Culture' },
      { src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&h=600&fit=crop', alt: 'Basketball sneakers', category: 'Footwear' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', alt: 'Skateboard wheels closeup', category: 'Skate Culture' },
      { src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', alt: 'Nike running shoes', category: 'Footwear' },
      { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop', alt: 'Abstract geometric art', category: 'Design' },
      { src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop', alt: 'Art supplies and paint', category: 'Art' },
      { src: 'https://images.unsplash.com/photo-1564866657315-5dcfd5ebf529?w=600&h=600&fit=crop', alt: 'Colorful sneaker collection', category: 'Footwear' },
      { src: 'https://images.unsplash.com/photo-1555445091-5a8b655e8a4a?w=600&h=600&fit=crop', alt: 'Skatepark architecture', category: 'Skate Culture' },
      { src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=600&fit=crop', alt: 'Abstract fluid art', category: 'Art' },
      { src: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop', alt: 'Air Jordan sneakers', category: 'Footwear' },
      { src: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop', alt: 'Typography design', category: 'Design' },
      { src: 'https://images.unsplash.com/photo-1569091791842-7cfb64e04797?w=600&h=600&fit=crop', alt: 'Skateboard in motion', category: 'Skate Culture' },
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Moodboards</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Visual inspiration from skate culture, footwear design, and contemporary art
          </p>
        </div>

        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap py-4 -mx-4 px-4">
          <div className="inline-flex gap-4">
            {moodboardImages.map((image, i) => (
              <div
                key={i}
                className="inline-block w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/60 transition-all duration-300 cursor-zoom-in hover:scale-105 overflow-hidden relative group flex-shrink-0"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-xs text-white/70 uppercase tracking-wider">{image.category}</span>
                  <span className="text-sm text-white font-medium">{image.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/60 text-sm text-center">Scroll horizontally to explore • Click to zoom</p>
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
      <h2 className="text-5xl font-black text-white drop-shadow-lg">Shop</h2>

      <GameSection />

      <div className="grid md:grid-cols-3 gap-6">
        {['Limited Edition Tote', 'Digital Zine Vol. 1', 'Exploration Kit', 'Future Archive Print', 'Membership Pass', 'Mystery Box'].map((item, i) => (
          <div key={i} className="group p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/60 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="aspect-square rounded-lg bg-white/10 mb-4 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ShoppingBag size={48} className="text-white/50" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item}</h3>
            <p className="text-white/80 font-mono">$XX.XX</p>
          </div>
        ))}
      </div>
    </div>
  );

  const bgGradient = `radial-gradient(at ${mousePos.x}% ${mousePos.y}%, rgb(34, 211, 238) 0%, rgb(168, 85, 247) 30%, rgb(236, 72, 153) 60%, rgb(251, 191, 36) 100%)`;

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Map Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ background: 'linear-gradient(to bottom, #0a0a1a, #1a1a2e)' }}
      />

      {/* Location Badge */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
        <MapPin size={16} className="text-cyan-400" />
        <span className="text-sm text-white/80">{currentCity.name}</span>
      </div>

      {showHighScore && <HighScorePopup />}

      {cursorTrail.map((pos, i) => (
        <div
          key={pos.id}
          className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50"
          style={{
            left: pos.x,
            top: pos.y,
            opacity: (i / cursorTrail.length) * 0.7,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s'
          }}
        />
      ))}

      <nav className="relative z-50 p-4 md:p-6 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-2xl md:text-3xl font-black text-white hover:scale-110 transition-transform drop-shadow-lg"
          >
            ALT-TAB
          </button>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
            <Trophy size={20} className="text-yellow-300" />
            <span className="text-white font-bold">{totalScore}</span>
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
            className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/20 backdrop-blur-lg p-4 space-y-2 border-b border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/20 border border-white/30">
              <Trophy size={20} className="text-yellow-300" />
              <span className="text-white font-bold">{totalScore} points</span>
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

      <footer className="relative z-10 text-center py-8 text-white/80 text-sm">
        <p>© 2024 Alt-Tab Think Tank · Based on Earth · Multi-Disciplinary</p>
      </footer>
    </div>
  );
};

export default AltTabWebsite;
