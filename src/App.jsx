import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Grid3x3, Image, BookOpen, ShoppingBag, RefreshCw, Construction, Instagram, Sun, Moon } from 'lucide-react';

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
  const location = useLocation();
  const navigate = useNavigate();
  // Derive currentPage from the URL path
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [golfBall, setGolfBall] = useState({ x: 0, y: 0, visible: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentGameType, setCurrentGameType] = useState(() => {
    const games = ['tictactoe', 'connect4', 'blackjack', 'numbergame'];
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shake detection for mobile - scatter letters
  useEffect(() => {
    if (!isMobile) return;

    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeThreshold = 15;

    const handleMotion = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity || {};
      if (x === null) return;

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      if ((deltaX > shakeThreshold && deltaY > shakeThreshold) ||
          (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
          (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
        // Scatter letters randomly
        setLetterPositions({
          A: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
          L: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
          T: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
          '-': { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
          T2: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
          A2: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
          B: { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 60 },
        });
      }

      lastX = x; lastY = y; lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isMobile]);

  // Touch to scatter a single letter (mobile)
  const handleLetterTouch = (letter) => {
    if (!isMobile) return;
    setLetterPositions(prev => ({
      ...prev,
      [letter]: {
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 80,
      }
    }));
  };

  // Double tap to reset all letters
  const [lastTap, setLastTap] = useState(0);
  const handleHeaderDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap detected - reset all letters
      setLetterPositions({
        A: { x: 0, y: 0 },
        L: { x: 0, y: 0 },
        T: { x: 0, y: 0 },
        '-': { x: 0, y: 0 },
        T2: { x: 0, y: 0 },
        A2: { x: 0, y: 0 },
        B: { x: 0, y: 0 },
      });
    }
    setLastTap(now);
  };

  // Update time every second for world clocks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRandomGame = () => {
    const games = ['tictactoe', 'connect4', 'blackjack', 'numbergame'];
    const availableGames = games.filter(g => g !== currentGameType);
    return availableGames[Math.floor(Math.random() * availableGames.length)];
  };

  const navigateTo = (page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
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


  // Tic Tac Toe Game - Player vs Simple AI
  const TicTacToeGame = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("Your turn (X)");

    const checkWinner = (squares) => {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (let [a,b,c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
      }
      return squares.every(s => s) ? 'Draw' : null;
    };

    const getAIMove = (squares) => {
      const empty = squares.map((s, i) => s === null ? i : -1).filter(i => i !== -1);
      return empty[Math.floor(Math.random() * empty.length)];
    };

    const handleClick = (idx) => {
      if (board[idx] || gameOver) return;

      // Player move
      const newBoard = [...board];
      newBoard[idx] = 'X';

      const result = checkWinner(newBoard);
      if (result) {
        setBoard(newBoard);
        setGameOver(true);
        setMessage(result === 'Draw' ? "It's a draw!" : "You win! 🎉");
        return;
      }

      // AI move
      const aiMove = getAIMove(newBoard);
      if (aiMove !== undefined) {
        newBoard[aiMove] = 'O';
        const aiResult = checkWinner(newBoard);
        if (aiResult) {
          setBoard(newBoard);
          setGameOver(true);
          setMessage(aiResult === 'Draw' ? "It's a draw!" : "Computer wins!");
          return;
        }
      }

      setBoard(newBoard);
      setMessage("Your turn (X)");
    };

    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setGameOver(false);
      setMessage("Your turn (X)");
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Tic Tac Toe</h3>
        <p className="text-sm text-white/70 mb-4">{message}</p>
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto mb-4">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg transition-all bg-white/20 ${cell === 'X' ? 'text-cyan-400' : 'text-pink-400'} ${!cell && !gameOver ? 'hover:bg-white/40 cursor-pointer' : ''}`}
            >
              {cell}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={resetGame} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">
            {gameOver ? 'Play Again' : 'Reset'}
          </button>
          <button onClick={() => setCurrentGameType(getRandomGame())} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    );
  };

  // Connect 4 Game - 2 Player
  const Connect4Game = () => {
    const createEmptyBoard = () => Array(6).fill(null).map(() => Array(7).fill(null));
    const [board, setBoard] = useState(createEmptyBoard);
    const [isRedNext, setIsRedNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("Red's turn");

    const checkWinner = (b) => {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (!b[r][c]) continue;
          const p = b[r][c];
          if (c + 3 < 7 && p === b[r][c+1] && p === b[r][c+2] && p === b[r][c+3]) return p;
          if (r + 3 < 6 && p === b[r+1][c] && p === b[r+2][c] && p === b[r+3][c]) return p;
          if (r + 3 < 6 && c + 3 < 7 && p === b[r+1][c+1] && p === b[r+2][c+2] && p === b[r+3][c+3]) return p;
          if (r + 3 < 6 && c - 3 >= 0 && p === b[r+1][c-1] && p === b[r+2][c-2] && p === b[r+3][c-3]) return p;
        }
      }
      return b.every(row => row.every(cell => cell)) ? 'Draw' : null;
    };

    const dropPiece = (col) => {
      if (gameOver) return;
      for (let row = 5; row >= 0; row--) {
        if (!board[row][col]) {
          const newBoard = board.map(r => [...r]);
          newBoard[row][col] = isRedNext ? 'R' : 'Y';
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result) {
            setGameOver(true);
            setMessage(result === 'Draw' ? "It's a draw!" : `${result === 'R' ? 'Red' : 'Yellow'} wins! 🎉`);
          } else {
            setIsRedNext(!isRedNext);
            setMessage(`${!isRedNext ? 'Red' : 'Yellow'}'s turn`);
          }
          return;
        }
      }
    };

    const resetGame = () => {
      setBoard(createEmptyBoard());
      setIsRedNext(true);
      setGameOver(false);
      setMessage("Red's turn");
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Connect 4</h3>
        <p className="text-sm text-white/70 mb-4">{message}</p>
        <div className="bg-blue-800 p-2 rounded-lg max-w-[280px] mx-auto mb-4">
          {board.map((row, r) => (
            <div key={r} className="flex gap-1 justify-center">
              {row.map((cell, c) => (
                <button
                  key={c}
                  onClick={() => dropPiece(c)}
                  className={`w-8 h-8 rounded-full transition-all ${cell === 'R' ? 'bg-red-500' : cell === 'Y' ? 'bg-yellow-400' : 'bg-white/30'} ${!cell && !gameOver ? 'hover:bg-white/50 cursor-pointer' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={resetGame} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">
            {gameOver ? 'Play Again' : 'Reset'}
          </button>
          <button onClick={() => setCurrentGameType(getRandomGame())} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    );
  };

  // Blackjack Game
  const BlackjackGame = () => {
    const getCard = () => Math.floor(Math.random() * 10) + 2;
    const [playerCards, setPlayerCards] = useState([getCard(), getCard()]);
    const [dealerCards, setDealerCards] = useState([getCard()]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('Hit or Stand?');

    const sum = (cards) => cards.reduce((a, b) => a + b, 0);

    const hit = () => {
      if (gameOver) return;
      const newCards = [...playerCards, getCard()];
      setPlayerCards(newCards);
      if (sum(newCards) > 21) {
        setGameOver(true);
        setMessage('Bust! You lose 😢');
      }
    };

    const stand = () => {
      if (gameOver) return;
      let dc = [...dealerCards];
      while (sum(dc) < 17) dc.push(getCard());
      setDealerCards(dc);
      const ds = sum(dc);
      const ps = sum(playerCards);
      setGameOver(true);
      if (ds > 21) setMessage('Dealer busts! You win! 🎉');
      else if (ds > ps) setMessage('Dealer wins 😢');
      else if (ds < ps) setMessage('You win! 🎉');
      else setMessage("Push - it's a tie!");
    };

    const resetGame = () => {
      setPlayerCards([getCard(), getCard()]);
      setDealerCards([getCard()]);
      setGameOver(false);
      setMessage('Hit or Stand?');
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Blackjack</h3>
        <div className="space-y-3 mb-4">
          <div><span className="text-white/70 text-sm">Dealer: </span><span className="text-white font-bold">{dealerCards.join(' + ')} = {sum(dealerCards)}</span></div>
          <div><span className="text-white/70 text-sm">You: </span><span className="text-white font-bold">{playerCards.join(' + ')} = {sum(playerCards)}</span></div>
        </div>
        <p className="text-yellow-300 font-bold text-center mb-4">{message}</p>
        {gameOver ? (
          <div className="flex gap-2">
            <button onClick={resetGame} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">Play Again</button>
            <button onClick={() => setCurrentGameType(getRandomGame())} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
              <RefreshCw size={20} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={hit} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-400">Hit</button>
            <button onClick={stand} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-400">Stand</button>
          </div>
        )}
      </div>
    );
  };

  // Number Guessing Game (simpler and more reliable)
  const NumberGame = () => {
    const [target] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [message, setMessage] = useState('Guess a number between 1-100');
    const [won, setWon] = useState(false);

    const handleGuess = () => {
      const num = parseInt(guess);
      if (isNaN(num) || num < 1 || num > 100) {
        setMessage('Enter a number between 1-100');
        return;
      }
      setAttempts(a => a + 1);
      if (num === target) {
        setWon(true);
        setMessage(`🎉 Correct! You got it in ${attempts + 1} tries!`);
      } else if (num < target) {
        setMessage('📈 Higher!');
      } else {
        setMessage('📉 Lower!');
      }
      setGuess('');
    };

    const resetGame = () => {
      window.location.reload();
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Number Guessing</h3>
        <p className="text-sm text-white/70 mb-2">Attempts: {attempts}</p>
        <p className="text-yellow-300 font-bold text-center mb-4">{message}</p>
        {!won ? (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              min="1"
              max="100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 border-2 border-white/30 text-white text-center text-xl"
              placeholder="?"
            />
            <button onClick={handleGuess} className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">
              Guess
            </button>
          </div>
        ) : null}
        <div className="flex gap-2">
          <button onClick={resetGame} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">
            {won ? 'Play Again' : 'Reset'}
          </button>
          <button onClick={() => setCurrentGameType(getRandomGame())} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    );
  };

  const NavItem = ({ icon: Icon, label, page }) => {
    const path = page === 'home' ? '/' : `/${page}`;
    return (
      <Link
        to={path}
        onClick={() => {
          setMenuOpen(false);
          window.scrollTo(0, 0);
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
          currentPage === page
            ? 'bg-white/30 text-white shadow-lg scale-105'
            : 'hover:bg-white/20 text-white/80 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  const GameSection = () => (
    <div className="w-full">
      {currentGameType === 'tictactoe' && <TicTacToeGame />}
      {currentGameType === 'connect4' && <Connect4Game />}
      {currentGameType === 'blackjack' && <BlackjackGame />}
      {currentGameType === 'numbergame' && <NumberGame />}
    </div>
  );

  // Drudge-style links component - 2 row layout
  const NewsLinks = () => (
    <div className="p-4 rounded-2xl bg-black/90 border-2 border-white/20">
      <h3 className="text-center font-bold text-red-500 text-lg mb-3 border-b border-white/20 pb-2">
        ★ HEADLINES ★
      </h3>
      <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {NEWS_LINKS.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-white hover:text-yellow-400 hover:bg-white/10 px-2 py-1 rounded transition-colors truncate"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="space-y-8">
      {/* Retro header with blue/orange gradient */}
      <div className="text-center space-y-3 py-8 border-4 border-black bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl text-white">★</span>
          <span className="text-xs uppercase tracking-widest font-bold text-white">Established</span>
          <span className="text-xl text-white">★</span>
        </div>
        <h1
          className="text-6xl md:text-8xl font-black text-white leading-none select-none"
          style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          onTouchEnd={handleHeaderDoubleTap}
        >
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
              onTouchStart={() => handleLetterTouch(letter.key)}
              style={{
                display: 'inline-block',
                color: '#ffffff',
                textShadow: '2px 2px 0px #f97316, 4px 4px 0px #1e40af',
                cursor: isMobile ? 'pointer' : 'grab',
                transform: `translate(${letterPositions[letter.key].x}px, ${letterPositions[letter.key].y}px)`,
                transition: draggingLetter === letter.key ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                userSelect: 'none',
              }}
              className="hover:scale-110 active:cursor-grabbing active:scale-95"
            >
              {letter.char}
            </span>
          ))}
        </h1>
        <p className="text-base md:text-lg text-white font-bold uppercase px-4">
          ★★ Multi-Disciplinary Think Tank ★★
        </p>
        {isMobile && (
          <p className="text-xs text-white/70 mt-2 animate-pulse">
            Tap letters to scatter • Double-tap to reset • Shake to shuffle
          </p>
        )}
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
          <div key={clock.city} className="bg-blue-900 text-orange-400 px-3 py-2 border-2 border-orange-400 font-mono rounded">
            <span className="text-blue-300">{clock.city}:</span>{' '}
            {currentTime.toLocaleTimeString('en-US', {
              timeZone: clock.tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        ))}
      </div>

      {/* News Links + Game section */}
      <div className="border-4 border-black bg-gradient-to-br from-blue-100 via-blue-50 to-orange-100 p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <NewsLinks />
          <GameSection />
        </div>
      </div>

      {/* About sections */}
      <div className="border-4 border-black bg-white">
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-3 border-b-4 border-black">
          <h2 className="font-bold text-2xl md:text-3xl uppercase text-center">About Alt-Tab</h2>
        </div>
        <div className="grid md:grid-cols-3">
          <button onClick={() => navigateTo('about')} className="border-2 border-black p-6 bg-blue-50 hover:bg-blue-100 transition-colors text-left">
            <h3 className="font-bold text-black mb-3 underline text-lg">Human-Centric Design</h3>
            <p className="text-sm text-black">Founded by a library scientist and industrial designer, we blend research with creativity.</p>
          </button>
          <button onClick={() => navigateTo('about')} className="border-2 border-black p-6 bg-orange-50 hover:bg-orange-100 transition-colors text-left">
            <h3 className="font-bold text-black mb-3 underline text-lg">Multi-Disciplinary</h3>
            <p className="text-sm text-black">From digital goods to policy, we create experiences that matter.</p>
          </button>
          <button onClick={() => navigateTo('about')} className="border-2 border-black p-6 bg-blue-50 hover:bg-blue-100 transition-colors text-left">
            <h3 className="font-bold text-black mb-3 underline text-lg">Future-Forward</h3>
            <p className="text-sm text-black">Bridging nostalgia with innovation, one project at a time.</p>
          </button>
        </div>
      </div>


      {/* Focus Areas */}
      <div className="border-4 border-black bg-white">
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-3 border-b-4 border-black">
          <h2 className="font-bold text-2xl md:text-3xl uppercase text-center">Areas of Focus</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5">
          {[
            { name: 'Product Development', icon: (
              <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn lightbulb */}
                <path d="M24 4c-1 0-2 .5-2 .5s-6 2-6 12c0 4 2 6 3 8s2 4 2 6v2h6v-2c0-2 1-4 2-6s3-4 3-8c0-10-6-11.5-6-12s-1-.5-2-.5z" strokeDasharray="1 0.5" />
                <path d="M19 34h10" strokeDasharray="2 1" />
                <path d="M20 38h8" strokeDasharray="2 1" />
                <path d="M22 42h4" />
                {/* Rays */}
                <path d="M24 0v2" strokeDasharray="1 1" />
                <path d="M36 6l-2 2" strokeDasharray="1 1" />
                <path d="M40 18h-3" strokeDasharray="1 1" />
                <path d="M12 6l2 2" strokeDasharray="1 1" />
                <path d="M8 18h3" strokeDasharray="1 1" />
              </svg>
            )},
            { name: 'Research', icon: (
              <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn magnifying glass */}
                <circle cx="20" cy="20" r="12" strokeDasharray="3 1" />
                <path d="M29 29l12 12" strokeDasharray="2 1" />
                <path d="M40 42l2 2" />
                {/* Lens shine */}
                <path d="M14 14c2-2 5-3 8-3" strokeDasharray="2 2" />
              </svg>
            )},
            { name: 'Civic', icon: (
              <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn building with columns */}
                <path d="M6 42h36" strokeDasharray="2 1" />
                <path d="M8 42v-22" strokeDasharray="3 1" />
                <path d="M16 42v-22" strokeDasharray="3 1" />
                <path d="M24 42v-22" strokeDasharray="3 1" />
                <path d="M32 42v-22" strokeDasharray="3 1" />
                <path d="M40 42v-22" strokeDasharray="3 1" />
                {/* Roof/pediment */}
                <path d="M4 20h40" strokeDasharray="2 1" />
                <path d="M8 20l16-14 16 14" strokeDasharray="2 1" />
              </svg>
            )},
            { name: 'Education', icon: (
              <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn stacked books */}
                <path d="M8 38h28" strokeDasharray="2 1" />
                <path d="M6 38v-6h32v6" strokeDasharray="3 1" />
                <path d="M8 32v-6h28v6" strokeDasharray="3 1" />
                <path d="M10 26v-6h24v6" strokeDasharray="3 1" />
                {/* Book spines */}
                <path d="M14 32v6" strokeDasharray="1 1" />
                <path d="M22 26v6" strokeDasharray="1 1" />
                <path d="M30 32v6" strokeDasharray="1 1" />
                {/* Bookmark */}
                <path d="M28 20v-8l3 3 3-3v8" strokeDasharray="1 1" />
              </svg>
            )},
            { name: 'Sport', icon: (
              <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand-drawn soccer ball */}
                <circle cx="24" cy="24" r="18" strokeDasharray="3 1" />
                {/* Pentagon pattern */}
                <path d="M24 10l-6 8h12l-6-8z" strokeDasharray="2 1" />
                <path d="M18 18l-8 4 2 10h6" strokeDasharray="2 1" />
                <path d="M30 18l8 4-2 10h-6" strokeDasharray="2 1" />
                <path d="M18 32l6 6 6-6" strokeDasharray="2 1" />
                <path d="M12 22l-4 8" strokeDasharray="1 1" />
                <path d="M36 22l4 8" strokeDasharray="1 1" />
              </svg>
            )},
          ].map((area, i) => (
            <div key={i} className={`border-2 border-black p-6 ${i % 2 === 0 ? 'bg-blue-50' : 'bg-orange-50'} text-center`}>
              <div className="text-blue-700">{area.icon}</div>
              <h3 className="font-bold text-black text-sm md:text-base">{area.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Walt-tab Link */}
      <div className="text-center">
        <a
          href="https://www.walt-tab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-black font-bold text-lg border-2 border-black hover:scale-105 hover:brightness-110 transition-all animate-pulse hover:animate-none"
          style={{ boxShadow: '3px 3px 0px black' }}
        >
          Walt-tab
        </a>
      </div>

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { text: 'ABOUT', color: 'bg-gradient-to-r from-blue-600 to-blue-500', page: 'about' },
          { text: 'MOODBOARDS', color: 'bg-gradient-to-r from-blue-500 to-orange-500', page: 'moodboards' },
          { text: 'VIEW PROJECTS', color: 'bg-gradient-to-r from-orange-500 to-blue-500', page: 'projects' },
          { text: 'SHOP', color: 'bg-gradient-to-r from-orange-500 to-orange-400', page: 'shop' }
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
      const subject = `Alt-Tab Inquiry from ${formData.name}`;
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`;
      window.location.href = `mailto:ty@alt-tab.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', company: '', message: '' });
      }, 3000);
    };

    const projects = [
      { name: 'Virginia Tech', logo: '/images/virginia-tech-logo.svg', description: 'University partnership and research', link: 'https://www.vt.edu/' },
      { name: 'Live Breathe Futbol', logo: '/images/lbf-logo.svg', description: 'Football apparel brand', link: 'https://www.livebreathefutbol.com/' },
      { name: 'USM Furniture', logoText: 'USM', description: 'Modular furniture system design', link: 'https://us.usm.com/' },
      { name: 'Wonder Universe', logoText: 'WU', description: "Children's museum experience", link: 'https://wonderuniverse.org/' },
      { name: 'BKYSC', logoText: 'BKYSC', description: 'Brooklyn Youth Sports Club', link: 'https://www.brooklynyouthsportsclub.org/' },
      { name: 'Nike NYC', logoText: 'NIKE', description: 'Retail experience design' },
      { name: 'MLB Streaming', logoText: 'MLB', description: 'Digital streaming platform' },
      { name: 'Akash Network', logoText: 'AKASH', description: 'Decentralized cloud computing', link: 'https://akash.network/' },
    ];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-black">
          <h2 className="text-5xl md:text-6xl font-black text-black drop-shadow-lg">Supportive Partners</h2>
          <p className="text-lg text-black/80 italic max-w-2xl mx-auto">
            "Sometimes we do work for us; sometimes we do work with you."
          </p>
          <p className="text-base text-black/70 max-w-3xl mx-auto leading-relaxed">
            The organizations featured here represent collaborations where we were able to share our work publicly. Much of what the Alt-Tab team builds is protected under NDA, as we often embed directly within our clients' internal teams. As a result, this page showcases only a portion of our portfolio.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {projects.map((project, i) => {
            const CardWrapper = project.link ? 'a' : 'div';
            const linkProps = project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <CardWrapper
                key={i}
                {...linkProps}
                className="group bg-white rounded-lg p-4 hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-black hover:shadow-lg hover:border-orange-500 block"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  {project.logoText ? (
                    <span className="text-2xl md:text-3xl font-black text-black tracking-tight" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                      {project.logoText}
                    </span>
                  ) : (
                    <img
                      src={project.logo}
                      alt={project.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
                <h3 className="font-bold text-black text-center text-sm">{project.name}</h3>
                <p className="text-xs text-gray-600 text-center mt-1">{project.description}</p>
              </CardWrapper>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto pt-12">
          <div className="bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-black text-black mb-3">Work With Us</h3>
              <p className="text-black/70 text-lg">
                Have a project in mind? Let's create something amazing together.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles size={40} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold text-black mb-2">Thank You!</h4>
                <p className="text-black/70">We will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-300 text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-300 text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-300 text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Tell us about your project *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border-2 border-gray-300 text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="What are you looking to create? What challenges are you facing?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-full font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
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
    const [activeVideo, setActiveVideo] = useState(null);
    const [shuffleKey, setShuffleKey] = useState(0);

    // Video collection - easy to add new videos: just add 'VIDEO_ID'
    const videos = [
      '7IdoDJCssNk',
      'M_0do0LP2tk',
      'XTomk3L1R5I',
      'cFwytlpCJ9U',
      'l126-q8Ne5I',
      '0JpVNPH6cl8',
      'P_QJKaKD-i8',
      'mBjo4Dmsmok',
      'sKE1nLc5P_c',
      '0zIVTDbve7k',
      'ZYAzo5OdqHM',
      'tnFPQ57l0Dg',
      'RqQGUJK7Na4',
      'pYdkiWIPp-s',
      'vtBoQuAtX3I',
    ];

    // Shuffle videos and assign random sizes with weighted distribution
    const getShuffledVideos = useCallback(() => {
      // Weighted sizes: more small/medium, fewer large to create visual variety
      const getRandomSize = () => {
        const rand = Math.random();
        if (rand < 0.35) return 'small';
        if (rand < 0.7) return 'medium';
        return 'large';
      };
      const shuffled = [...videos].sort(() => Math.random() - 0.5);
      return shuffled.map((id) => ({
        id,
        size: getRandomSize()
      }));
    }, [shuffleKey]);

    const [displayVideos, setDisplayVideos] = useState(() => getShuffledVideos());

    const handleShuffle = () => {
      setShuffleKey(k => k + 1);
      setDisplayVideos(getShuffledVideos());
    };

    // Get YouTube thumbnail URL
    const getThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Size classes for varied tile sizes
    const getSizeClasses = (size) => {
      switch (size) {
        case 'large':
          return 'col-span-2 row-span-2';
        case 'medium':
          return 'col-span-2 md:col-span-1 row-span-1';
        default:
          return 'col-span-1 row-span-1';
      }
    };

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-black text-black drop-shadow-lg">Moodboards</h2>
          <p className="text-lg text-black/70 max-w-2xl mx-auto">
            Video inspiration from skate culture and contemporary design
          </p>
          {/* Shuffle button */}
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-all"
          >
            <RefreshCw size={18} />
            Shuffle
          </button>
        </div>

        {/* Video Thumbnail Grid - Masonry-like with varied sizes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[120px] md:auto-rows-[150px] -mx-4 md:mx-0">
          {displayVideos.map(({ id, size }) => (
            <button
              key={id + shuffleKey}
              onClick={() => setActiveVideo(id)}
              className={`group relative bg-black/40 overflow-hidden border border-black/20 hover:border-orange-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl md:rounded-lg ${getSizeClasses(size)}`}
            >
              {/* Thumbnail */}
              <img
                src={getThumbnail(id)}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-black/70 group-hover:bg-orange-500 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quartersnacks Channel Link */}
        <div className="text-center pt-4">
          <a
            href="https://www.youtube.com/@quartersnacksdotcom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-black/80 text-white font-bold text-sm md:text-base rounded-lg border-2 border-black/20 hover:border-orange-500 hover:bg-black transition-all"
          >
            QUARTERSNACKS →
          </a>
        </div>

        {/* Video Modal */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
              >
                <span>Close</span>
                <X size={20} />
              </button>
              {/* Video player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AboutPage = () => {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-black">
          <h2 className="text-5xl md:text-6xl font-black text-black drop-shadow-lg">Philosophy</h2>
          <p className="text-xl text-black/70 max-w-2xl mx-auto">
            Where research meets creativity, and ideas become reality
          </p>
        </div>

        {/* Mission - First and foremost */}
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 border-2 border-black">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-xl text-white leading-relaxed mb-6">
              Alt-Tab exists to bridge the gap between human needs and technological possibility. We are a think tank dedicated to designing experiences and products that enhance the quality of human life.
            </p>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              Whether developing digital platforms, physical products, policy frameworks, or immersive experiences, we maintain an unwavering commitment to thoughtful, intentional design that serves people first.
            </p>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              Our team is led by real humans who prefer working in the shadows. We're not chasing clout or followers—we'd rather meet you for coffee, shake your hand, and have a real conversation. We believe the best ideas emerge from genuine connection, not comment sections.
            </p>
            <p className="text-base text-white/80 italic">
              Yes, we're actually human. We have coffee addictions, strong opinions about fonts, and we occasionally forget to unmute ourselves on video calls. No AI wrote this. (We checked.)
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-black">
            <h3 className="text-2xl font-bold text-black mb-4">Human-Centric Design</h3>
            <p className="text-black/80 leading-relaxed mb-4">
              At Alt-Tab, we believe that exceptional design begins with deep understanding. Our human-centric approach places people at the center of every project, ensuring that the products and experiences we create genuinely improve lives.
            </p>
            <p className="text-black/70 leading-relaxed">
              Through rigorous user research and empathy-driven methodologies, we uncover insights that inform meaningful solutions. We don't design for users—we design with them.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-black">
            <h3 className="text-2xl font-bold text-black mb-4">Research-Driven Process</h3>
            <p className="text-black/80 leading-relaxed mb-4">
              Our process is grounded in systematic research and evidence-based decision making. We combine qualitative and quantitative methods to build a comprehensive understanding of complex challenges.
            </p>
            <p className="text-black/70 leading-relaxed">
              From ethnographic studies to data analysis, our research practice ensures that every design decision is informed by real-world insights rather than assumptions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-black">
            <h3 className="text-2xl font-bold text-black mb-4">Rapid Prototyping</h3>
            <p className="text-black/80 leading-relaxed mb-4">
              We believe in learning by making. Our rapid prototyping approach allows us to quickly test ideas, gather feedback, and iterate toward optimal solutions.
            </p>
            <p className="text-black/70 leading-relaxed">
              By creating tangible artifacts early in the process, we reduce risk and accelerate innovation. Fail fast, learn faster—that's the Alt-Tab way.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-black">
            <h3 className="text-2xl font-bold text-black mb-4">Multi-Disciplinary Collaboration</h3>
            <p className="text-black/80 leading-relaxed mb-4">
              Complex problems require diverse perspectives. Our team brings together expertise from industrial design, library science, technology, and strategic consulting.
            </p>
            <p className="text-black/70 leading-relaxed">
              This cross-pollination of disciplines enables us to approach challenges from multiple angles and deliver holistic solutions that address both immediate needs and long-term impact.
            </p>
          </div>
        </div>

        <GameSection />
      </div>
    );
  };

  const ShopPage = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-black">
        <h2 className="text-5xl md:text-6xl font-black text-black drop-shadow-lg">Shop</h2>
        <p className="text-xl text-black/70 max-w-2xl mx-auto">
          Curated goods from Alt-Tab
        </p>
      </div>

      {/* Under Construction Notice */}
      <div className="max-w-2xl mx-auto">
        <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-400 border-4 border-black text-center">
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
        <>
          <div
            className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${BACKGROUND_IMAGE})`,
            }}
          />
          <div className="fixed inset-0 bg-yellow-300/40" />
        </>
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

      <nav className="relative z-50 p-4 md:p-6 border-b-4 border-black bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-black hover:scale-110 transition-transform text-white drop-shadow-sm"
          >
            ALT-TAB
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavItem icon={Sparkles} label="Home" page="home" />
            <NavItem icon={BookOpen} label="About" page="about" />
            <NavItem icon={Image} label="Moodboards" page="moodboards" />
            <NavItem icon={Grid3x3} label="Projects" page="projects" />
            <NavItem icon={ShoppingBag} label="Shop" page="shop" />
            {/* Walt-tab Button */}
            <a
              href="https://www.walt-tab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-bold rounded-full hover:scale-105 hover:brightness-110 transition-all border-2 border-black animate-pulse hover:animate-none"
            >
              Walt-tab
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition-all bg-white/20 hover:bg-white/30 text-white"
              title={darkMode ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/20 text-white"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 p-4 space-y-2 border-b-4 border-black">
            <NavItem icon={Sparkles} label="Home" page="home" />
            <NavItem icon={BookOpen} label="About" page="about" />
            <NavItem icon={Image} label="Moodboards" page="moodboards" />
            <NavItem icon={Grid3x3} label="Projects" page="projects" />
            <NavItem icon={ShoppingBag} label="Shop" page="shop" />
            <a
              href="https://www.walt-tab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-bold rounded-lg hover:brightness-110 transition-all border-2 border-black"
            >
              Walt-tab
            </a>
          </div>
        )}
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/moodboards" element={<MoodboardsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </main>

      <footer className="relative z-10 py-8 text-sm bg-gradient-to-r from-blue-900 to-blue-800 border-t-4 border-black">
        {/* World Clocks - shown on all pages except homepage */}
        {currentPage !== 'home' && (
          <div className="flex flex-wrap justify-center gap-3 text-xs mb-6 px-4">
            {[
              { city: 'LOS ANGELES', tz: 'America/Los_Angeles' },
              { city: 'NASHVILLE', tz: 'America/Chicago' },
              { city: 'NEW YORK', tz: 'America/New_York' },
              { city: 'LISBON', tz: 'Europe/Lisbon' },
              { city: 'JOHANNESBURG', tz: 'Africa/Johannesburg' },
              { city: 'TOKYO', tz: 'Asia/Tokyo' },
            ].map((clock) => (
              <div key={clock.city} className="bg-black/50 text-orange-400 px-3 py-2 border border-orange-400/50 font-mono rounded">
                <span className="text-blue-300">{clock.city}:</span>{' '}
                {currentTime.toLocaleTimeString('en-US', {
                  timeZone: clock.tz,
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
            ))}
          </div>
        )}

        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 px-4">
          <Link
            to="/about"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105 bg-white/10 hover:bg-white/20 text-white"
          >
            <BookOpen size={18} />
            <span className="font-medium">About</span>
          </Link>
          <a
            href="https://www.instagram.com/alttab.xyz/#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105 bg-white/10 hover:bg-white/20 text-white"
          >
            <Instagram size={18} />
            <span className="font-medium">@alttab</span>
          </a>
          <a
            href="https://www.walt-tab.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-bold rounded-full hover:scale-105 transition-all"
          >
            Walt-tab
          </a>
        </div>
        <p className="text-white/60 text-center">© {new Date().getFullYear()} Alt-Tab Think Tank · Multi-Disciplinary</p>
      </footer>
    </div>
  );
};

export default AltTabWebsite;
