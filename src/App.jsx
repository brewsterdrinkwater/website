import React, { useState, useEffect, useCallback } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [golfBall, setGolfBall] = useState({ x: 0, y: 0, visible: false });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentGameType, setCurrentGameType] = useState(() => {
    const games = ['tictactoe', 'connect4', 'blackjack', 'chesspuzzle'];
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

  const getRandomGame = () => {
    const games = ['tictactoe', 'connect4', 'blackjack', 'chesspuzzle'];
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


  // Tic Tac Toe Game
  const TicTacToeGame = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const checkWinner = (squares) => {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (let [a,b,c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
      }
      return squares.every(s => s) ? 'Draw' : null;
    };

    const handleClick = (idx) => {
      if (board[idx] || winner) return;
      const newBoard = [...board];
      newBoard[idx] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      setIsXNext(!isXNext);
      setWinner(checkWinner(newBoard));
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Tic Tac Toe</h3>
        <p className="text-sm text-white/70 mb-4">{winner ? (winner === 'Draw' ? "It's a draw!" : `${winner} wins!`) : `${isXNext ? 'X' : 'O'}'s turn`}</p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
          {board.map((cell, idx) => (
            <button key={idx} onClick={() => handleClick(idx)} className={`aspect-square flex items-center justify-center text-3xl font-bold rounded-lg transition-all ${winner ? 'cursor-not-allowed' : 'hover:bg-white/30 cursor-pointer'} bg-white/20 ${cell === 'X' ? 'text-cyan-400' : 'text-pink-400'}`}>
              {cell}
            </button>
          ))}
        </div>
        {winner && (
          <div className="flex gap-2">
            <button onClick={() => setCurrentGameType(getRandomGame())} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">Next Game</button>
            <button onClick={() => { setBoard(Array(9).fill(null)); setIsXNext(true); setWinner(null); }} className="px-4 py-2 bg-white/20 text-white rounded-lg"><RefreshCw size={20} /></button>
          </div>
        )}
      </div>
    );
  };

  // Connect 4 Game
  const Connect4Game = () => {
    const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
    const [isRedNext, setIsRedNext] = useState(true);
    const [winner, setWinner] = useState(null);

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
      if (winner) return;
      for (let row = 5; row >= 0; row--) {
        if (!board[row][col]) {
          const newBoard = board.map(r => [...r]);
          newBoard[row][col] = isRedNext ? 'R' : 'Y';
          setBoard(newBoard);
          setIsRedNext(!isRedNext);
          setWinner(checkWinner(newBoard));
          return;
        }
      }
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Connect 4</h3>
        <p className="text-sm text-white/70 mb-4">{winner ? (winner === 'Draw' ? "Draw!" : `${winner === 'R' ? 'Red' : 'Yellow'} wins!`) : `${isRedNext ? 'Red' : 'Yellow'}'s turn`}</p>
        <div className="bg-blue-800 p-2 rounded-lg max-w-xs mx-auto mb-4">
          {board.map((row, r) => (
            <div key={r} className="flex gap-1 justify-center">
              {row.map((cell, c) => (
                <button key={c} onClick={() => dropPiece(c)} className={`w-8 h-8 rounded-full transition-all ${cell === 'R' ? 'bg-red-500' : cell === 'Y' ? 'bg-yellow-400' : 'bg-white/30 hover:bg-white/50'}`} />
              ))}
            </div>
          ))}
        </div>
        {winner && (
          <div className="flex gap-2">
            <button onClick={() => setCurrentGameType(getRandomGame())} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">Next Game</button>
            <button onClick={() => { setBoard(Array(6).fill(null).map(() => Array(7).fill(null))); setIsRedNext(true); setWinner(null); }} className="px-4 py-2 bg-white/20 text-white rounded-lg"><RefreshCw size={20} /></button>
          </div>
        )}
      </div>
    );
  };

  // Blackjack Game
  const BlackjackGame = () => {
    const getCard = () => Math.floor(Math.random() * 10) + 2;
    const [playerCards, setPlayerCards] = useState(() => [getCard(), getCard()]);
    const [dealerCards, setDealerCards] = useState(() => [getCard()]);
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState('');

    const sum = (cards) => cards.reduce((a, b) => a + b, 0);
    const playerSum = sum(playerCards);
    const dealerSum = sum(dealerCards);

    const hit = () => {
      if (gameOver) return;
      const newCards = [...playerCards, getCard()];
      setPlayerCards(newCards);
      if (sum(newCards) > 21) { setGameOver(true); setResult('Bust! You lose.'); }
    };

    const stand = () => {
      if (gameOver) return;
      let dc = [...dealerCards];
      while (sum(dc) < 17) dc.push(getCard());
      setDealerCards(dc);
      const ds = sum(dc);
      setGameOver(true);
      if (ds > 21) setResult('Dealer busts! You win!');
      else if (ds > playerSum) setResult('Dealer wins.');
      else if (ds < playerSum) setResult('You win!');
      else setResult("It's a push.");
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Blackjack</h3>
        <div className="space-y-3 mb-4">
          <div><span className="text-white/70 text-sm">Dealer: </span><span className="text-white font-bold">{dealerCards.join(' + ')} = {dealerSum}</span></div>
          <div><span className="text-white/70 text-sm">You: </span><span className="text-white font-bold">{playerCards.join(' + ')} = {playerSum}</span></div>
        </div>
        {gameOver ? (
          <>
            <p className="text-yellow-300 font-bold text-center mb-4">{result}</p>
            <div className="flex gap-2">
              <button onClick={() => setCurrentGameType(getRandomGame())} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">Next Game</button>
              <button onClick={() => { setPlayerCards([getCard(), getCard()]); setDealerCards([getCard()]); setGameOver(false); setResult(''); }} className="px-4 py-2 bg-white/20 text-white rounded-lg"><RefreshCw size={20} /></button>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <button onClick={hit} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-400">Hit</button>
            <button onClick={stand} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-400">Stand</button>
          </div>
        )}
      </div>
    );
  };

  // Chess Puzzle Game
  const ChessPuzzleGame = () => {
    const puzzles = [
      { board: ['', '', '', '', '', '', '', '', '', '', '♔', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '♜', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], solution: 36, hint: 'Rook takes checkmate!' },
      { board: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '♔', '', '', '', '', '', '', '', '', '', '', '♛', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''], solution: 27, hint: 'Queen delivers mate!' },
    ];
    const [puzzle] = useState(() => puzzles[Math.floor(Math.random() * puzzles.length)]);
    const [selected, setSelected] = useState(null);
    const [won, setWon] = useState(false);

    const handleClick = (idx) => {
      if (won) return;
      if (idx === puzzle.solution) { setWon(true); }
      else { setSelected(idx); setTimeout(() => setSelected(null), 300); }
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <h3 className="text-xl font-bold text-white mb-2">Chess Puzzle</h3>
        <p className="text-sm text-white/70 mb-4">{won ? 'Checkmate!' : puzzle.hint}</p>
        <div className="grid grid-cols-8 gap-0 max-w-xs mx-auto mb-4 border-2 border-white/30">
          {puzzle.board.map((piece, idx) => {
            const isLight = (Math.floor(idx / 8) + idx % 8) % 2 === 0;
            return (
              <button key={idx} onClick={() => handleClick(idx)} className={`aspect-square flex items-center justify-center text-2xl ${isLight ? 'bg-amber-100' : 'bg-amber-800'} ${selected === idx ? 'bg-red-400' : ''} ${won && idx === puzzle.solution ? 'bg-green-400' : ''} hover:opacity-80`}>
                {piece}
              </button>
            );
          })}
        </div>
        {won && (
          <div className="flex gap-2">
            <button onClick={() => setCurrentGameType(getRandomGame())} className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400">Next Game</button>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/20 text-white rounded-lg"><RefreshCw size={20} /></button>
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
      {currentGameType === 'tictactoe' && <TicTacToeGame />}
      {currentGameType === 'connect4' && <Connect4Game />}
      {currentGameType === 'blackjack' && <BlackjackGame />}
      {currentGameType === 'chesspuzzle' && <ChessPuzzleGame />}
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
          <span className="text-xs uppercase tracking-widest font-bold text-black">Established</span>
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
          { text: 'ABOUT', color: 'bg-purple-500', page: 'about' },
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
      const subject = `Alt-Tab Inquiry from ${formData.name}`;
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`;
      window.location.href = `mailto:ty@alt-tab.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
          <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Alt-Tab Work</h2>
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
      // Frank Lloyd Wright - Fallingwater
      { type: 'image', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', alt: 'Fallingwater', size: 'xl' },
      // BDDW style furniture
      { type: 'image', src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80', alt: 'BDDW Furniture', size: 'large' },
      // Dover Street Market - using text placeholder since logo has access restrictions
      { type: 'text', text: 'DOVER STREET MARKET', alt: 'Dover Street Market', size: 'medium' },
      // Skate shop interior with bowl
      { type: 'image', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80', alt: 'Retail Space', size: 'xl' },
      // Graffiti street art
      { type: 'image', src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1000&q=80', alt: 'Graffiti', size: 'large' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=800&q=80', alt: 'Street Typography', size: 'medium' },
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

            if (item.type === 'text') {
              return (
                <div
                  key={i}
                  className={`${heightClass} rounded-xl bg-black border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-[1.02] overflow-hidden relative group break-inside-avoid mb-4 flex items-center justify-center p-6`}
                >
                  <span className="text-white font-black text-2xl md:text-3xl text-center tracking-tight" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>{item.text}</span>
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
