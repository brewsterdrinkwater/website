import React, { useState, useEffect, useCallback, useMemo, useRef, Component } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, RefreshCw, Construction, Instagram } from 'lucide-react';

// Per-section error boundary — isolates crashes so the rest of the page renders
class SafeSection extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error(`[SafeSection:${this.props.name || 'unknown'}]`, error, info);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      // For sections without a custom fallback, render nothing but log
      return null;
    }
    return this.props.children;
  }
}

// ===== DATA =====

// Daily Sports Trivia - 50 obscure questions, one per day
const SPORTS_TRIVIA = [
  { q: "Which NBA player holds the record for most turnovers in a single game with 14?", a: "Jason Kidd", choices: ["Jason Kidd", "James Harden", "LeBron James", "Russell Westbrook"] },
  { q: "What is the only country to have played in every FIFA World Cup?", a: "Brazil", choices: ["Germany", "Brazil", "Argentina", "Italy"] },
  { q: "Which MLB pitcher threw a perfect game while on LSD, according to his own account?", a: "Dock Ellis", choices: ["Dock Ellis", "Nolan Ryan", "Randy Johnson", "Sandy Koufax"] },
  { q: "How many dimples are on a regulation golf ball?", a: "336", choices: ["252", "336", "412", "198"] },
  { q: "Which NHL goalie scored the most career goals?", a: "Martin Brodeur", choices: ["Patrick Roy", "Martin Brodeur", "Ron Hextall", "Tom Barrasso"] },
  { q: "What was the shortest boxing match in history?", a: "4 seconds", choices: ["4 seconds", "10 seconds", "17 seconds", "23 seconds"] },
  { q: "Which tennis player has the fastest recorded serve at 163.7 mph?", a: "Sam Groth", choices: ["John Isner", "Sam Groth", "Ivo Karlovic", "Andy Roddick"] },
  { q: "What sport was the first to be played on the moon?", a: "Golf", choices: ["Baseball", "Golf", "Frisbee", "Cricket"] },
  { q: "Which country invented the game of cricket?", a: "England", choices: ["India", "Australia", "England", "South Africa"] },
  { q: "How many stitches are on a regulation MLB baseball?", a: "108", choices: ["88", "108", "116", "98"] },
  { q: "Which NBA player has the most career blocks?", a: "Hakeem Olajuwon", choices: ["Dikembe Mutombo", "Hakeem Olajuwon", "Kareem Abdul-Jabbar", "Shaquille O'Neal"] },
  { q: "What year were women first allowed to run the Boston Marathon officially?", a: "1972", choices: ["1966", "1972", "1980", "1975"] },
  { q: "Which country has won the most Olympic medals in fencing?", a: "Italy", choices: ["France", "Italy", "Hungary", "Russia"] },
  { q: "What is the diameter of a basketball hoop in inches?", a: "18 inches", choices: ["16 inches", "18 inches", "20 inches", "17 inches"] },
  { q: "Which NFL quarterback threw the longest pass in recorded history at 83 yards?", a: "Baker Mayfield", choices: ["Patrick Mahomes", "Baker Mayfield", "Aaron Rodgers", "Josh Allen"] },
  { q: "What sport uses the terms 'stone' and 'hog line'?", a: "Curling", choices: ["Curling", "Shuffleboard", "Bocce", "Bowling"] },
  { q: "Which MLB team has lost the most World Series?", a: "NY Yankees (with 13 losses)", choices: ["Brooklyn/LA Dodgers", "NY Yankees (with 13 losses)", "San Francisco Giants", "St. Louis Cardinals"] },
  { q: "What is the only Grand Slam tennis tournament played on clay?", a: "French Open", choices: ["Australian Open", "French Open", "Wimbledon", "US Open"] },
  { q: "Which sprinter held the 100m world record before Usain Bolt?", a: "Asafa Powell", choices: ["Tyson Gay", "Asafa Powell", "Justin Gatlin", "Maurice Greene"] },
  { q: "How long is an Olympic swimming pool in meters?", a: "50 meters", choices: ["25 meters", "50 meters", "75 meters", "100 meters"] },
  { q: "Which soccer player has scored the most own goals in Premier League history?", a: "Richard Dunne", choices: ["Jamie Carragher", "Richard Dunne", "Martin Skrtel", "Phil Jagielka"] },
  { q: "What is the maximum weight of a regulation bowling ball in pounds?", a: "16 pounds", choices: ["14 pounds", "15 pounds", "16 pounds", "18 pounds"] },
  { q: "Which country has won the most Rugby World Cups?", a: "South Africa (4)", choices: ["New Zealand (3)", "South Africa (4)", "Australia (2)", "England (1)"] },
  { q: "What was the longest professional tennis match ever played?", a: "11 hours 5 minutes", choices: ["6 hours 33 minutes", "8 hours 15 minutes", "11 hours 5 minutes", "9 hours 45 minutes"] },
  { q: "Which Formula 1 driver has the most career wins?", a: "Lewis Hamilton", choices: ["Michael Schumacher", "Lewis Hamilton", "Sebastian Vettel", "Ayrton Senna"] },
  { q: "What sport did Michael Jordan play professionally besides basketball?", a: "Baseball", choices: ["Golf", "Baseball", "Football", "Tennis"] },
  { q: "Which NHL team went 12 years without making the playoffs (2004-2016)?", a: "Edmonton Oilers", choices: ["Buffalo Sabres", "Edmonton Oilers", "Toronto Maple Leafs", "Florida Panthers"] },
  { q: "How tall is an NBA regulation basketball hoop from the floor?", a: "10 feet", choices: ["9 feet", "10 feet", "11 feet", "12 feet"] },
  { q: "Which jockey has won the most Kentucky Derbys?", a: "Eddie Arcaro (5)", choices: ["Bill Hartack (5)", "Eddie Arcaro (5)", "Willie Shoemaker (4)", "Calvin Borel (3)"] },
  { q: "What is the rarest play in baseball?", a: "Unassisted triple play", choices: ["Unassisted triple play", "Inside-the-park grand slam", "Immaculate inning", "Hitting for the cycle"] },
  { q: "Which soccer goalkeeper once scored from his own penalty area?", a: "Asmir Begovic", choices: ["Tim Howard", "Asmir Begovic", "Manuel Neuer", "Ederson"] },
  { q: "What year was the first Super Bowl played?", a: "1967", choices: ["1965", "1967", "1970", "1960"] },
  { q: "Which country won the first Olympic basketball gold medal?", a: "United States (1936)", choices: ["United States (1936)", "Soviet Union (1952)", "Argentina (1948)", "Canada (1936)"] },
  { q: "What is the longest recorded home run in MLB history?", a: "575 feet (Mickey Mantle)", choices: ["502 feet", "535 feet", "575 feet (Mickey Mantle)", "582 feet"] },
  { q: "Which athlete has won the most Olympic gold medals?", a: "Michael Phelps (23)", choices: ["Usain Bolt (8)", "Michael Phelps (23)", "Carl Lewis (9)", "Paavo Nurmi (9)"] },
  { q: "What was Wilt Chamberlain's famous single-game scoring record?", a: "100 points", choices: ["81 points", "92 points", "100 points", "73 points"] },
  { q: "Which sport was removed from the Olympics after 1904, then returned in 2016?", a: "Golf", choices: ["Rugby", "Golf", "Polo", "Cricket"] },
  { q: "What is the only position in soccer that can handle the ball?", a: "Goalkeeper", choices: ["Goalkeeper", "Sweeper", "Libero", "None"] },
  { q: "Which NFL team went 0-16 in the 2008 season?", a: "Detroit Lions", choices: ["Cleveland Browns", "Detroit Lions", "Jacksonville Jaguars", "Tampa Bay Buccaneers"] },
  { q: "How many players are on a water polo team in the pool?", a: "7", choices: ["5", "6", "7", "8"] },
  { q: "Which baseball player was known as 'The Say Hey Kid'?", a: "Willie Mays", choices: ["Mickey Mantle", "Willie Mays", "Hank Aaron", "Jackie Robinson"] },
  { q: "What is the only team sport where the ball must be caught with one hand?", a: "Lacrosse", choices: ["Lacrosse", "Water polo", "Handball", "Jai alai"] },
  { q: "Which horse racing track is known as 'The Run for the Roses'?", a: "Churchill Downs", choices: ["Belmont Park", "Churchill Downs", "Pimlico", "Santa Anita"] },
  { q: "What is the diameter of a regulation hockey puck in inches?", a: "3 inches", choices: ["2.5 inches", "3 inches", "3.5 inches", "4 inches"] },
  { q: "Which NBA player was drafted first overall in 1984 alongside Michael Jordan?", a: "Hakeem Olajuwon", choices: ["Sam Bowie", "Hakeem Olajuwon", "Charles Barkley", "Patrick Ewing"] },
  { q: "In cricket, what is it called when a batsman is out for zero?", a: "A duck", choices: ["A zero", "A duck", "A goose", "A blank"] },
  { q: "Which country has the most registered soccer players?", a: "China", choices: ["Brazil", "Germany", "China", "United States"] },
  { q: "What is the oldest trophy in international sport?", a: "America's Cup (1851)", choices: ["The Ashes (1882)", "America's Cup (1851)", "Stanley Cup (1893)", "Davis Cup (1900)"] },
  { q: "Which boxer retired undefeated with a 49-0 record?", a: "Rocky Marciano", choices: ["Floyd Mayweather", "Rocky Marciano", "Joe Calzaghe", "Lennox Lewis"] },
  { q: "What sport has the highest average attendance per game worldwide?", a: "NFL Football", choices: ["Soccer (EPL)", "NFL Football", "College Football", "Cricket (IPL)"] },
];

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

// Marquee messages
const MARQUEE_ITEMS = [
  "Multi-Disciplinary Think Tank",
  "Design × Strategy × Technology",
  "Alt-Tab on conventional thinking",
  "Cross-pollinating ideas since day one",
  "Systems thinking for complex problems",
  "Press alt-tab. See what opens.",
  "Connecting dots across disciplines",
  "Part studio. Part lab. Part consultancy.",
];

// ===== STANDALONE COMPONENTS (outside main component to prevent remounting) =====

// Snake Game
const SnakeGame = ({ isMobile }) => {
  const GRID = 15;
  const CELL = 18;
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('snakeHigh') || '0'));
  const dirRef = useRef({ x: 1, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const spawnFood = useCallback((snakeBody) => {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snakeBody.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 7, y: 7 }];
    setSnake(initial);
    setFood(spawnFood(initial));
    dirRef.current = { x: 1, y: 0 };
    setDead(false);
    setScore(0);
    setRunning(true);
  }, [spawnFood]);

  useEffect(() => {
    if (!running || dead) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const d = dirRef.current;
        const head = { x: (prev[0].x + d.x + GRID) % GRID, y: (prev[0].y + d.y + GRID) % GRID };
        if (prev.some(s => s.x === head.x && s.y === head.y)) {
          setDead(true);
          setRunning(false);
          setScore(sc => {
            if (sc > parseInt(localStorage.getItem('snakeHigh') || '0')) {
              setHighScore(sc);
              localStorage.setItem('snakeHigh', sc.toString());
            }
            return sc;
          });
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 130);
    return () => clearInterval(interval);
  }, [running, dead, food, spawnFood]);

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key;
      const d = dirRef.current;
      if ((key === 'ArrowUp' || key === 'w') && d.y !== 1) dirRef.current = { x: 0, y: -1 };
      if ((key === 'ArrowDown' || key === 's') && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      if ((key === 'ArrowLeft' || key === 'a') && d.x !== 1) dirRef.current = { x: -1, y: 0 };
      if ((key === 'ArrowRight' || key === 'd') && d.x !== -1) dirRef.current = { x: 1, y: 0 };
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) e.preventDefault();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const d = dirRef.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && d.x !== -1) dirRef.current = { x: 1, y: 0 };
      if (dx < -20 && d.x !== 1) dirRef.current = { x: -1, y: 0 };
    } else {
      if (dy > 20 && d.y !== -1) dirRef.current = { x: 0, y: 1 };
      if (dy < -20 && d.y !== 1) dirRef.current = { x: 0, y: -1 };
    }
  };

  const changeDir = (x, y) => {
    const d = dirRef.current;
    if (x === 0 && y === -1 && d.y !== 1) dirRef.current = { x: 0, y: -1 };
    if (x === 0 && y === 1 && d.y !== -1) dirRef.current = { x: 0, y: 1 };
    if (x === -1 && y === 0 && d.x !== 1) dirRef.current = { x: -1, y: 0 };
    if (x === 1 && y === 0 && d.x !== -1) dirRef.current = { x: 1, y: 0 };
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const size = GRID * CELL;
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(size, i * CELL); ctx.stroke();
    }
    ctx.fillStyle = '#4af0c8';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#a78bfa' : '#7c3aed';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [snake, food]);

  return (
    <div className="w-full">
      <div className="y2k-game-container">
        <div className="flex justify-between items-center mb-3">
          <h3 className="y2k-game-title">SNAKE.EXE</h3>
          <div className="y2k-game-score">
            <span>Score: <strong style={{ color: 'var(--accent)' }}>{score}</strong></span>
            <span className="ml-3">Best: <strong style={{ color: 'var(--accent)' }}>{highScore}</strong></span>
          </div>
        </div>
        <div className="mx-auto touch-none" style={{ width: GRID * CELL, height: GRID * CELL }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} style={{ border: '1px solid var(--border)', borderRadius: '4px' }} />
        </div>
        <div className="mt-3 flex justify-center md:hidden">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div />
            <button onClick={() => changeDir(0, -1)} className="p-2 text-center text-lg" style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '4px' }}>^</button>
            <div />
            <button onClick={() => changeDir(-1, 0)} className="p-2 text-center text-lg" style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '4px' }}>&lt;</button>
            <div style={{ background: 'var(--surface)', borderRadius: '4px' }} />
            <button onClick={() => changeDir(1, 0)} className="p-2 text-center text-lg" style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '4px' }}>&gt;</button>
            <div />
            <button onClick={() => changeDir(0, 1)} className="p-2 text-center text-lg" style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '4px' }}>v</button>
            <div />
          </div>
        </div>
        {!running && (
          <div className="text-center mt-3">
            <button onClick={resetGame} className="px-4 py-2 font-mono-vt text-sm" style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }}>
              {dead ? '[ PLAY AGAIN ]' : '[ START GAME ]'}
            </button>
            <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{isMobile ? 'Swipe or use D-pad' : 'Arrow keys or WASD'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reaction Time Game
const ReactionGame = () => {
  const [gameState, setGameState] = useState('waiting');
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(() => localStorage.getItem('bestReactionTime') || null);
  const [startTime, setStartTime] = useState(null);
  const timeoutRef = useRef(null);

  const start = () => {
    setGameState('ready');
    setReactionTime(null);
    timeoutRef.current = setTimeout(() => {
      setGameState('go');
      setStartTime(Date.now());
    }, Math.random() * 3000 + 1000);
  };

  const handleClick = () => {
    if (gameState === 'waiting') { start(); }
    else if (gameState === 'ready') {
      clearTimeout(timeoutRef.current);
      setGameState('waiting');
      setReactionTime('Too early!');
    } else if (gameState === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');
      if (!bestTime || time < parseInt(bestTime)) {
        setBestTime(time.toString());
        localStorage.setItem('bestReactionTime', time.toString());
      }
    } else if (gameState === 'result') { start(); }
  };

  const bgColor = gameState === 'waiting' ? 'var(--accent2)'
    : gameState === 'ready' ? '#ff5f57'
    : gameState === 'go' ? '#28c840'
    : 'var(--accent)';

  const msg = gameState === 'waiting' ? 'TAP TO START'
    : gameState === 'ready' ? 'WAIT FOR GREEN...'
    : gameState === 'go' ? 'TAP NOW!'
    : reactionTime === 'Too early!' ? 'TOO EARLY! TAP TO RETRY'
    : `${reactionTime}ms - TAP TO PLAY AGAIN`;

  return (
    <button onClick={handleClick} className="w-full p-6 transition-colors cursor-pointer select-none" style={{ background: bgColor, border: '1px solid var(--border)', borderRadius: '4px' }}>
      <h3 className="font-mono-vt text-sm mb-1 uppercase tracking-wide" style={{ color: 'var(--bg)', opacity: 0.8 }}>REACTION.EXE</h3>
      <div className="text-3xl font-mono-vt mb-2" style={{ color: 'var(--bg)' }}>
        {gameState === 'result' && reactionTime !== 'Too early!' ? `${reactionTime}ms` : ''}
      </div>
      <p className="text-base font-mono-vt" style={{ color: 'var(--bg)' }}>{msg}</p>
      {bestTime && <p className="text-sm font-mono-share mt-2" style={{ color: 'var(--bg)', opacity: 0.7 }}>Best: {bestTime}ms</p>}
    </button>
  );
};

// Golf Ball Cursor - keeps the existing easter egg
const GolfBallCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY, visible: true });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!position.visible) return null;

  return (
    <div
      className="fixed w-6 h-6 rounded-full pointer-events-none z-[100] shadow-lg hidden lg:block"
      style={{
        left: position.x - 12,
        top: position.y - 12,
        background: 'radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0, #a0a0a0)',
        boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 2px 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <div className="absolute inset-1 rounded-full opacity-30" style={{
        background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)'
      }} />
    </div>
  );
};

// Draggable Hero Letters - keeps the existing easter egg
const DraggableHeroLetters = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [letterPositions, setLetterPositions] = useState({
    A: { x: 0, y: 0 }, L: { x: 0, y: 0 }, T: { x: 0, y: 0 },
    '-': { x: 0, y: 0 }, T2: { x: 0, y: 0 }, A2: { x: 0, y: 0 }, B: { x: 0, y: 0 },
  });
  const [draggingLetter, setDraggingLetter] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 1023px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shake detection for mobile
  useEffect(() => {
    if (!isMobile) return;
    let lastX = 0, lastY = 0, lastZ = 0;
    const handleMotion = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity || {};
      if (x === null) return;
      if ((Math.abs(x - lastX) > 15 && Math.abs(y - lastY) > 15) ||
          (Math.abs(x - lastX) > 15 && Math.abs(z - lastZ) > 15) ||
          (Math.abs(y - lastY) > 15 && Math.abs(z - lastZ) > 15)) {
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

  const handleLetterTouch = (letter) => {
    if (!isMobile) return;
    if (letter === '-') {
      navigate('/shop');
      return;
    }
    setLetterPositions(prev => ({
      ...prev,
      [letter]: { x: (Math.random() - 0.5) * 120, y: (Math.random() - 0.5) * 80 }
    }));
  };

  const handleHeaderDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setLetterPositions({
        A: { x: 0, y: 0 }, L: { x: 0, y: 0 }, T: { x: 0, y: 0 },
        '-': { x: 0, y: 0 }, T2: { x: 0, y: 0 }, A2: { x: 0, y: 0 }, B: { x: 0, y: 0 },
      });
    }
    lastTapRef.current = now;
  };

  const handleLetterMouseDown = (letter, e) => {
    e.preventDefault();
    setDraggingLetter(letter);
    setDragStart({ x: e.clientX, y: e.clientY });
    setHasDragged(false);
  };

  const handleLetterClick = (letter) => {
    if (letter === '-' && !hasDragged) {
      navigate('/shop');
    }
  };

  useEffect(() => {
    if (!draggingLetter) return;
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasDragged(true);
      }
      setLetterPositions(prev => ({
        ...prev,
        [draggingLetter]: {
          x: prev[draggingLetter].x + deltaX,
          y: prev[draggingLetter].y + deltaY,
        }
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = () => {
      setDraggingLetter(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLetter, dragStart]);

  const letters = [
    { key: 'A', char: 'A' }, { key: 'L', char: 'L' }, { key: 'T', char: 'T' },
    { key: '-', char: '-' }, { key: 'T2', char: 'T' }, { key: 'A2', char: 'A' }, { key: 'B', char: 'B' },
  ];

  return (
    <div className="text-center space-y-4">
      <span className="font-mono-vt text-sm md:text-base uppercase tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>Multi-Disciplinary Think Tank</span>
      <h1
        className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] select-none tracking-tight font-mono-vt"
        style={{ color: 'var(--accent)', textShadow: '0 0 30px var(--accent)' }}
        onTouchEnd={handleHeaderDoubleTap}
      >
        {letters.map((letter) => (
          <span
            key={letter.key}
            onMouseDown={(e) => handleLetterMouseDown(letter.key, e)}
            onMouseUp={() => handleLetterClick(letter.key)}
            onTouchStart={() => handleLetterTouch(letter.key)}
            style={{
              display: 'inline-block',
              cursor: isMobile ? 'pointer' : (letter.key === '-' ? 'pointer' : 'grab'),
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
      <p className="font-mono-courier text-sm md:text-base max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text)' }}>
        &gt; designing experiences that enhance human life_<span className="y2k-blink">█</span>
      </p>
      {isMobile && (
        <p className="text-xs mt-4 animate-pulse" style={{ color: 'var(--text-dim)' }}>
          Tap letters to scatter · Double-tap to reset · Shake to shuffle
        </p>
      )}
    </div>
  );
};

// World Clocks
const WorldClocks = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clocks = [
    { city: 'LOS ANGELES', tz: 'America/Los_Angeles' },
    { city: 'NASHVILLE', tz: 'America/Chicago' },
    { city: 'NEW YORK', tz: 'America/New_York' },
    { city: 'LISBON', tz: 'Europe/Lisbon' },
    { city: 'JOHANNESBURG', tz: 'Africa/Johannesburg' },
    { city: 'TOKYO', tz: 'Asia/Tokyo' },
  ];

  return (
    <div className="space-y-2">
      {clocks.map((clock) => (
        <div key={clock.city} className="flex justify-between font-mono-share text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>{clock.city}</span>
          <span style={{ color: 'var(--accent)' }}>
            {time.toLocaleTimeString('en-US', {
              timeZone: clock.tz,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </span>
        </div>
      ))}
    </div>
  );
};

// ===== Y2K COMPONENTS =====

// Mountain Background Scene - realistic mountain photo with Y2K overlays
// Mountain Background Scene - CSS gradient mountains with optional photo enhancement
const MountainBackground = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Sky gradient - renders instantly as base */}
      <div className="y2k-sky" />
      {/* Unsplash mountain photo - always rendered, browser handles loading */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80)',
          filter: isDark ? 'brightness(0.4) saturate(0.8)' : 'brightness(1.1) saturate(0.9)',
          opacity: 0.6,
        }}
      />
      {/* Aurora/glow effect */}
      <div className="y2k-aurora" />
      {/* Bottom fade to content */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

// Scanlines overlay
const Scanlines = () => <div className="y2k-scanlines" />;

// Sports Ticker Hook - fetches live scores for Arsenal and Mets
const useSportsScores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const sportsData = [];

      // Fetch NY Mets data from MLB Stats API (free, no auth)
      try {
        const metsId = 121; // NY Mets team ID
        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const metsCtrl = new AbortController();
        setTimeout(() => metsCtrl.abort(), 5000);
        const metsRes = await fetch(
          `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${metsId}&startDate=${today}&endDate=${endDate}`,
          { signal: metsCtrl.signal }
        );
        if (metsRes.ok) {
          const metsData = await metsRes.json();
          const games = metsData.dates?.flatMap(d => d.games) || [];
          if (games.length > 0) {
            const game = games[0];
            const isHome = game.teams.home.team.id === metsId;
            const opponent = isHome ? game.teams.away.team.name : game.teams.home.team.name;
            const status = game.status.detailedState;
            if (status === 'Final') {
              const metsScore = isHome ? game.teams.home.score : game.teams.away.score;
              const oppScore = isHome ? game.teams.away.score : game.teams.home.score;
              const result = metsScore > oppScore ? 'W' : metsScore < oppScore ? 'L' : 'T';
              sportsData.push(`NY METS ${result} ${metsScore}-${oppScore} vs ${opponent.replace('New York ', 'NY ').toUpperCase()}`);
            } else if (status === 'In Progress') {
              const metsScore = isHome ? game.teams.home.score : game.teams.away.score;
              const oppScore = isHome ? game.teams.away.score : game.teams.home.score;
              sportsData.push(`NY METS LIVE: ${metsScore}-${oppScore} vs ${opponent.replace('New York ', 'NY ').toUpperCase()}`);
            } else {
              const gameDate = new Date(game.gameDate);
              const dateStr = gameDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              sportsData.push(`NY METS: ${isHome ? 'vs' : '@'} ${opponent.replace('New York ', 'NY ').toUpperCase()} ${dateStr}`);
            }
          }
        }
      } catch (e) {
        sportsData.push('NY METS: Check schedule at mlb.com/mets');
      }

      // Fetch Arsenal data from free API
      try {
        const arsenalCtrl = new AbortController();
        setTimeout(() => arsenalCtrl.abort(), 5000);
        const arsenalRes = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133604', { signal: arsenalCtrl.signal });
        if (arsenalRes.ok) {
          const arsenalData = await arsenalRes.json();
          const lastGame = arsenalData.results?.[0];
          if (lastGame) {
            const isHome = lastGame.idHomeTeam === '133604';
            const arsenalScore = isHome ? lastGame.intHomeScore : lastGame.intAwayScore;
            const oppScore = isHome ? lastGame.intAwayScore : lastGame.intHomeScore;
            const opponent = isHome ? lastGame.strAwayTeam : lastGame.strHomeTeam;
            const result = parseInt(arsenalScore) > parseInt(oppScore) ? 'W' : parseInt(arsenalScore) < parseInt(oppScore) ? 'L' : 'D';
            sportsData.push(`ARSENAL ${result} ${arsenalScore}-${oppScore} vs ${opponent.toUpperCase()}`);
          }
        }
      } catch (e) {
        // Fallback
      }

      // Try to get next Arsenal fixture
      try {
        const nextCtrl = new AbortController();
        setTimeout(() => nextCtrl.abort(), 5000);
        const nextRes = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=133604', { signal: nextCtrl.signal });
        if (nextRes.ok) {
          const nextData = await nextRes.json();
          const nextGame = nextData.events?.[0];
          if (nextGame) {
            const isHome = nextGame.idHomeTeam === '133604';
            const opponent = isHome ? nextGame.strAwayTeam : nextGame.strHomeTeam;
            const gameDate = new Date(nextGame.dateEvent);
            const dateStr = gameDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            sportsData.push(`ARSENAL NEXT: ${isHome ? 'vs' : '@'} ${opponent.toUpperCase()} ${dateStr}`);
          }
        }
      } catch (e) {
        // Fallback
      }

      if (sportsData.length === 0) {
        sportsData.push('ARSENAL: Live scores at arsenal.com');
        sportsData.push('NY METS: Live scores at mlb.com/mets');
      }

      setScores(sportsData);
    };

    fetchScores();
    // Refresh every 5 minutes
    const interval = setInterval(fetchScores, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return scores;
};

// Marquee Bar with sports scores
const MarqueeBar = () => {
  const sportsScores = useSportsScores();
  const allItems = [...MARQUEE_ITEMS, ...sportsScores];

  return (
    <div className="y2k-marquee-bar">
      <div className="y2k-marquee-label">ALT-TAB</div>
      <div style={{ overflow: 'hidden', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className="y2k-marquee-track">
          {[...allItems, ...allItems].map((item, i) => (
            <span key={i} style={sportsScores.includes(item) ? { color: 'var(--accent3)' } : {}}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sports Tracker - Arsenal & Mets with last 5, next 5, standings
const SportsTracker = () => {
  const [arsenal, setArsenal] = useState({ loading: true, last5: [], next5: [], standing: null });
  const [mets, setMets] = useState({ loading: true, last5: [], next5: [], standing: null });

  useEffect(() => {
    const parseGames = (events, teamId) => {
      if (!events) return { last5: [], next5: [] };
      const completed = [];
      const upcoming = [];
      events.forEach(ev => {
        const comp = ev.competitions?.[0];
        if (!comp) return;
        const done = comp.status?.type?.completed;
        const team = comp.competitors?.find(c => String(c.team?.id) === String(teamId));
        const opp = comp.competitors?.find(c => String(c.team?.id) !== String(teamId));
        if (!team || !opp) return;
        const entry = {
          date: new Date(ev.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
          teamScore: team.score || '—',
          oppScore: opp.score || '—',
          oppName: opp.team?.abbreviation || opp.team?.shortDisplayName || '?',
          homeAway: team.homeAway === 'home' ? 'H' : 'A',
          winner: team.winner,
        };
        if (done) completed.push(entry); else upcoming.push(entry);
      });
      return { last5: completed.slice(-5), next5: upcoming.slice(0, 5) };
    };

    const timedFetch = (url) => {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 5000);
      return fetch(url, { signal: ctrl.signal });
    };

    // Arsenal schedule
    timedFetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/359/schedule')
      .then(r => r.json())
      .then(data => {
        const { last5, next5 } = parseGames(data.events, 359);
        setArsenal(prev => ({ ...prev, loading: false, last5, next5 }));
      }).catch(() => setArsenal(prev => ({ ...prev, loading: false })));

    // Arsenal standings
    timedFetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings')
      .then(r => r.json())
      .then(data => {
        const entries = data.children?.[0]?.standings?.entries || [];
        const a = entries.find(e => String(e.team?.id) === '359');
        if (a) {
          const getStat = (name) => a.stats?.find(s => s.name === name)?.value;
          setArsenal(prev => ({ ...prev, standing: { rank: getStat('rank'), points: getStat('points'), wins: getStat('wins'), losses: getStat('losses'), draws: getStat('ties') } }));
        }
      }).catch(() => {});

    // Mets schedule
    timedFetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/21/schedule')
      .then(r => r.json())
      .then(data => {
        const { last5, next5 } = parseGames(data.events, 21);
        setMets(prev => ({ ...prev, loading: false, last5, next5 }));
      }).catch(() => setMets(prev => ({ ...prev, loading: false })));

    // Mets standings
    timedFetch('https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings')
      .then(r => r.json())
      .then(data => {
        const groups = data.children || [];
        for (const group of groups) {
          const entries = group.standings?.entries || [];
          const m = entries.find(e => String(e.team?.id) === '21');
          if (m) {
            const getStat = (name) => m.stats?.find(s => s.name === name)?.value;
            setMets(prev => ({ ...prev, standing: { rank: getStat('playoffSeed') || getStat('rank'), wins: getStat('wins'), losses: getStat('losses'), pct: getStat('winPercent') } }));
            break;
          }
        }
      }).catch(() => {});
  }, []);

  const GameRow = ({ g }) => (
    <div className="flex justify-between text-xs font-mono-courier py-0.5" style={{ color: 'var(--text-dim)' }}>
      <span>{g.date}</span>
      <span>vs <span style={{ color: 'var(--accent2)' }}>{g.oppName}</span> ({g.homeAway})</span>
      <span style={{ color: g.winner === true ? '#4af0c8' : g.winner === false ? '#f472b6' : 'var(--text-dim)' }}>
        {g.teamScore}–{g.oppScore}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-mono-vt text-base tracking-wider mb-2" style={{ color: 'var(--accent)' }}>ARSENAL FC <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Premier League</span></h3>
        {arsenal.loading ? <p className="text-xs font-mono-courier" style={{ color: 'var(--text-dim)' }}>loading...</p> : (
          <>
            {arsenal.last5.length > 0 && (<><p className="text-xs font-mono-vt mb-1" style={{ color: 'var(--accent2)' }}>RECENT</p>{arsenal.last5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {arsenal.next5.length > 0 && (<><p className="text-xs font-mono-vt mt-2 mb-1" style={{ color: 'var(--accent2)' }}>UPCOMING</p>{arsenal.next5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {arsenal.standing && <p className="text-xs font-mono-courier mt-2" style={{ color: 'var(--text-dim)' }}>Standing: {arsenal.standing.rank ? `#${arsenal.standing.rank}` : '—'} | {arsenal.standing.wins ?? '—'}W {arsenal.standing.draws ?? '—'}D {arsenal.standing.losses ?? '—'}L | {arsenal.standing.points ?? '—'}pts</p>}
          </>
        )}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <h3 className="font-mono-vt text-base tracking-wider mb-2" style={{ color: 'var(--accent)' }}>NEW YORK METS <span className="text-xs" style={{ color: 'var(--text-dim)' }}>MLB</span></h3>
        {mets.loading ? <p className="text-xs font-mono-courier" style={{ color: 'var(--text-dim)' }}>loading...</p> : (
          <>
            {mets.last5.length > 0 && (<><p className="text-xs font-mono-vt mb-1" style={{ color: 'var(--accent2)' }}>RECENT</p>{mets.last5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {mets.next5.length > 0 && (<><p className="text-xs font-mono-vt mt-2 mb-1" style={{ color: 'var(--accent2)' }}>UPCOMING</p>{mets.next5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {mets.standing && <p className="text-xs font-mono-courier mt-2" style={{ color: 'var(--text-dim)' }}>Standing: {mets.standing.rank ? `#${mets.standing.rank}` : '—'} | {mets.standing.wins ?? '—'}W {mets.standing.losses ?? '—'}L | {mets.standing.pct ? (mets.standing.pct).toFixed(3) : '—'}</p>}
            {mets.last5.length === 0 && mets.next5.length === 0 && <p className="text-xs font-mono-courier" style={{ color: 'var(--text-dim)' }}>Season data loading soon...</p>}
          </>
        )}
      </div>
    </div>
  );
};

// Toast notification
const Toast = ({ message, show }) => (
  <div className={`y2k-toast ${show ? 'show' : ''}`}>{message}</div>
);

// Y2K Window Component
const Y2KWindow = ({
  id,
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 320, height: 'auto' },
  isMinimized,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  zIndex = 100,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleWindowMouseDown = (e) => {
    // Don't drag from interactive elements
    const tag = e.target.tagName;
    if (['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'CANVAS'].includes(tag) || e.target.closest('button') || e.target.closest('a')) return;
    onFocus?.();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (isMinimized) return null;

  return (
    <div
      className={`y2k-window ${isActive ? 'active' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: defaultSize.width,
        zIndex: isActive ? 200 : zIndex,
      }}
      onMouseDown={handleWindowMouseDown}
    >
      <div className="y2k-titlebar">
        <div className="y2k-win-btns">
          <button className="y2k-win-btn close" onClick={onClose} />
          <button className="y2k-win-btn min" onClick={onMinimize} />
          <button className="y2k-win-btn max" />
        </div>
        <div className="y2k-title">// {title}</div>
      </div>
      <div className="y2k-body y2k-scrollbar" style={{ maxHeight: typeof defaultSize.height === 'number' ? defaultSize.height : '70vh' }}>
        {children}
      </div>
    </div>
  );
};

// Desktop Icon
const DesktopIcon = ({ icon, label, onClick }) => (
  <div className="y2k-desktop-icon" onClick={onClick}>
    <div className="y2k-icon-img">{icon}</div>
    <span className="y2k-icon-label">{label}</span>
  </div>
);

// Mobile Modal — with prominent back button for easy return to home grid
const MobileModal = ({ title, children, onClose }) => (
  <div className="y2k-mobile-modal">
    <div className="y2k-modal-header">
      <button className="y2k-modal-back" onClick={onClose} aria-label="Back to home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
      </button>
      <span className="y2k-modal-title">{title}</span>
      <button className="y2k-modal-close" onClick={onClose}>[ X ]</button>
    </div>
    <div className="y2k-modal-body y2k-scrollbar">
      {children}
    </div>
  </div>
);

// ===== STANDALONE PAGE COMPONENTS (must be outside main component to avoid remounting) =====

// Projects Page
const ProjectsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
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
    <div className="space-y-8 pb-16">
      <div className="text-center space-y-4 p-6 md:p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="text-4xl md:text-5xl font-mono-vt" style={{ color: 'var(--accent)', textShadow: '0 0 20px var(--accent)' }}>PROJECTS</h2>
        <p className="font-mono-courier" style={{ color: 'var(--text-dim)' }}>
          "Sometimes we do work for us; sometimes we do work with you."
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {projects.map((project, i) => {
          const CardWrapper = project.link ? 'a' : 'div';
          const linkProps = project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {};
          return (
            <CardWrapper
              key={i}
              {...linkProps}
              className="group p-4 hover:scale-105 transition-all duration-300 cursor-pointer block"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="h-12 flex items-center justify-center mb-2">
                {project.logoText ? (
                  <span className="text-xl font-mono-vt" style={{ color: 'var(--accent)' }}>{project.logoText}</span>
                ) : (
                  <img src={project.logo} alt={project.name} loading="lazy" className="max-h-full max-w-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                )}
              </div>
              <h3 className="font-mono-vt text-sm text-center" style={{ color: 'var(--text)' }}>{project.name}</h3>
              <p className="font-mono-share text-xs text-center mt-1" style={{ color: 'var(--text-dim)' }}>{project.description}</p>
            </CardWrapper>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto p-6 md:p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="text-2xl font-mono-vt text-center mb-6" style={{ color: 'var(--accent)' }}>WORK WITH US</h3>
        {formSubmitted ? (
          <div className="text-center py-8">
            <Sparkles size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <p className="font-mono-vt" style={{ color: 'var(--accent)' }}>MESSAGE SENT!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 font-mono-courier text-sm" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input type="email" required placeholder="Email *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 font-mono-courier text-sm" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
            <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 font-mono-courier text-sm" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <textarea required placeholder="Tell us about your project *" rows={4} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-3 py-2 font-mono-courier text-sm resize-none" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <button type="submit" className="w-full py-2 font-mono-vt" style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }}>[ SEND ]</button>
          </form>
        )}
      </div>
    </div>
  );
};

// Moodboards Page
const MoodboardsPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const videos = useMemo(() => [
    '7IdoDJCssNk', 'M_0do0LP2tk', 'XTomk3L1R5I', 'cFwytlpCJ9U', 'l126-q8Ne5I',
    '0JpVNPH6cl8', 'P_QJKaKD-i8', 'mBjo4Dmsmok', 'sKE1nLc5P_c', '0zIVTDbve7k',
    'ZYAzo5OdqHM', 'tnFPQ57l0Dg', 'RqQGUJK7Na4', 'pYdkiWIPp-s', 'vtBoQuAtX3I',
  ], []);

  const [displayVideos, setDisplayVideos] = useState(() => {
    const getRandomSize = () => {
      const rand = Math.random();
      if (rand < 0.35) return 'small';
      if (rand < 0.7) return 'medium';
      return 'large';
    };
    return [...videos].sort(() => Math.random() - 0.5).map(id => ({ id, size: getRandomSize() }));
  });

  const handleShuffle = useCallback(() => {
    const getRandomSize = () => {
      const rand = Math.random();
      if (rand < 0.35) return 'small';
      if (rand < 0.7) return 'medium';
      return 'large';
    };
    setDisplayVideos([...videos].sort(() => Math.random() - 0.5).map(id => ({ id, size: getRandomSize() })));
  }, [videos]);

  const getThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const getSizeClasses = (size) => {
    switch (size) {
      case 'large': return 'col-span-2 row-span-2';
      case 'medium': return 'col-span-2 md:col-span-1 row-span-1';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-mono-vt" style={{ color: 'var(--accent)', textShadow: '0 0 20px var(--accent)' }}>MOODBOARDS</h2>
        <p className="font-mono-courier" style={{ color: 'var(--text-dim)' }}>Video inspiration from skate culture</p>
        <button onClick={handleShuffle} className="px-4 py-2 font-mono-vt" style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }}>
          <RefreshCw size={14} className="inline mr-2" />[ SHUFFLE ]
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[100px] md:auto-rows-[120px]">
        {displayVideos.map(({ id, size }, idx) => (
          <button
            key={`${id}-${idx}`}
            onClick={() => setActiveVideo(id)}
            className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${getSizeClasses(size)}`}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <img src={getThumbnail(id)} alt="" loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'var(--accent)', borderRadius: '50%' }}>
                <svg className="w-5 h-5 ml-1" fill="var(--bg)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <a href="https://www.youtube.com/@quartersnacksdotcom" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 font-mono-vt" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
          QUARTERSNACKS →
        </a>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.95)' }} onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute -top-10 right-0 font-mono-vt" style={{ color: 'var(--text-dim)' }}>[ CLOSE ]</button>
            <div className="aspect-video" style={{ background: 'var(--bg)' }}>
              <iframe src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MAIN APP COMPONENT =====

const AltTabWebsite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState({ message: '', show: false });

  // Window states
  const [windows, setWindows] = useState({
    clocks: { minimized: false, visible: true },
    services: { minimized: false, visible: true },
    news: { minimized: false, visible: true },
    trivia: { minimized: false, visible: true },
    snake: { minimized: false, visible: true },
    reaction: { minimized: true, visible: true },
    about: { minimized: false, visible: true },
    sports: { minimized: false, visible: true },
  });
  const [activeWindow, setActiveWindow] = useState('clocks');

  // Mobile modal state
  const [mobileModal, setMobileModal] = useState(null);

  // Trivia state
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaChoice, setTriviaChoice] = useState(null);
  const todayTrivia = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return SPORTS_TRIVIA[dayOfYear % SPORTS_TRIVIA.length];
  }, []);

  // Detect mobile/tablet — use app-grid layout for anything under 1024px
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 1023px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Clean up cursor class on unmount (cursor hiding removed — confusing for users)
  useEffect(() => {
    document.body.classList.remove('y2k-cursor-hidden');
  }, []);

  // Konami code easter egg
  useEffect(() => {
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiPos = 0;
    const handleKeyDown = (e) => {
      if (e.keyCode === konami[konamiPos]) {
        konamiPos++;
        if (konamiPos === konami.length) {
          showToast('⬆⬆⬇⬇⬅➡⬅➡BA — all windows restored!');
          setWindows({
            clocks: { minimized: false, visible: true },
            services: { minimized: false, visible: true },
            news: { minimized: false, visible: true },
            trivia: { minimized: false, visible: true },
            snake: { minimized: false, visible: true },
            reaction: { minimized: false, visible: true },
            about: { minimized: false, visible: true },
            sports: { minimized: false, visible: true },
          });
          konamiPos = 0;
        }
      } else {
        konamiPos = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 2000);
  };

  const toggleWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], minimized: !prev[id].minimized }
    }));
    if (windows[id].minimized) {
      showToast(`✦ ${id}.exe restored`);
    }
  };

  const closeWindow = (id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], visible: false }
    }));
  };

  const focusWindow = (id) => {
    setActiveWindow(id);
  };

  const navigateTo = (page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    setMenuOpen(false);
    setMobileModal(null);
    window.scrollTo(0, 0);
  };

  // Window positions for desktop - spread to edges like a real desktop
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const windowPositions = {
    clocks: { x: 20, y: 100 },
    services: { x: 20, y: 340 },
    about: { x: 20, y: 560 },
    news: { x: vw - 340, y: 80 },
    sports: { x: vw - 420, y: 360 },
    trivia: { x: vw - 300, y: 640 },
    snake: { x: Math.floor(vw / 2) - 160, y: 450 },
    reaction: { x: Math.floor(vw / 2) - 140, y: 650 },
  };

  // Trivia component
  const TriviaContent = () => {
    const isCorrect = triviaChoice === todayTrivia.a;
    return (
      <div>
        <h2>DAILY TRIVIA</h2>
        <p className="mb-4" style={{ color: 'var(--text)' }}>{todayTrivia.q}</p>
        <div className="space-y-2">
          {todayTrivia.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => { setTriviaChoice(choice); setTriviaAnswered(true); }}
              disabled={triviaAnswered}
              className={`y2k-trivia-btn w-full ${
                triviaAnswered
                  ? choice === todayTrivia.a
                    ? 'correct'
                    : choice === triviaChoice
                      ? 'wrong'
                      : 'faded'
                  : ''
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        {triviaAnswered && (
          <p className="text-sm font-mono-vt mt-3" style={{ color: isCorrect ? '#28c840' : '#ff5f57' }}>
            {isCorrect ? '> CORRECT!' : `> ANSWER: ${todayTrivia.a}`}
          </p>
        )}
      </div>
    );
  };

  // News component
  const NewsContent = () => (
    <div>
      <h2>HEADLINES</h2>
      <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto">
        {NEWS_LINKS.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="y2k-news-link block truncate"
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );

  // Services component
  const ServicesContent = () => (
    <div>
      <h2>AREAS OF FOCUS</h2>
      <div className="space-y-3">
        {['Product Development', 'Research', 'Civic', 'Education', 'Sport'].map((area) => (
          <div key={area} className="flex items-center gap-2">
            <span style={{ color: 'var(--accent)' }}>▸</span>
            <span style={{ color: 'var(--text)' }}>{area}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm" style={{ color: 'var(--text-dim)' }}>
        &gt; Sometimes we make for us; "Style Matters"_<span className="y2k-blink">█</span>
      </p>
    </div>
  );

  // About component
  const AboutContent = () => (
    <div>
      <h2>ABOUT</h2>
      <p style={{ color: 'var(--text)' }}>
        Alt-Tab is a multi-disciplinary think tank at the intersection of design, strategy, and emerging technology.
      </p>
      <h3>APPROACH</h3>
      <p style={{ color: 'var(--text-dim)' }}>
        Cross-pollinating ideas across fields to find what others miss. Part studio, part lab, part consultancy.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="y2k-tag">DESIGN</span>
        <span className="y2k-tag">STRATEGY</span>
        <span className="y2k-tag">TECH</span>
        <span className="y2k-tag">RESEARCH</span>
      </div>
    </div>
  );

  // Desktop Homepage — each window wrapped in SafeSection so one crash can't take down the page
  const desktopHomeContent = (
    <div className="relative min-h-screen pb-8">
      {/* Hero section on the desktop background */}
      <div className="flex items-center justify-center pt-20 pb-16">
        <SafeSection name="hero">
          <DraggableHeroLetters />
        </SafeSection>
      </div>

      {/* Desktop Icons */}
      <div className="fixed top-20 right-6 flex flex-col gap-4 z-50">
        <DesktopIcon
          icon="🌊"
          label="WALT-TAB"
          onClick={() => window.open('https://www.walt-tab.com', '_blank')}
        />
        <DesktopIcon
          icon="🧂"
          label="SALT-TAB"
          onClick={() => window.open('https://www.salt-tab.com', '_blank')}
        />
      </div>

      {/* Minimized windows dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {Object.entries(windows).map(([id, state]) => (
          state.minimized && state.visible && (
            <button
              key={id}
              onClick={() => toggleWindow(id)}
              className="px-3 py-1 font-mono-vt text-xs"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--accent)' }}
            >
              {id.toUpperCase()}.EXE
            </button>
          )
        ))}
      </div>

      {/* Windows — each isolated so a single failure doesn't break the page */}
      <SafeSection name="window-clocks">
        {windows.clocks.visible && (
          <Y2KWindow
            id="clocks"
            title="world_clocks.exe"
            defaultPosition={windowPositions.clocks}
            defaultSize={{ width: 280, height: 'auto' }}
            isMinimized={windows.clocks.minimized}
            isActive={activeWindow === 'clocks'}
            onClose={() => closeWindow('clocks')}
            onMinimize={() => toggleWindow('clocks')}
            onFocus={() => focusWindow('clocks')}
          >
            <WorldClocks />
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-services">
        {windows.services.visible && (
          <Y2KWindow
            id="services"
            title="services.exe"
            defaultPosition={windowPositions.services}
            defaultSize={{ width: 300, height: 'auto' }}
            isMinimized={windows.services.minimized}
            isActive={activeWindow === 'services'}
            onClose={() => closeWindow('services')}
            onMinimize={() => toggleWindow('services')}
            onFocus={() => focusWindow('services')}
          >
            {ServicesContent()}
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-news">
        {windows.news.visible && (
          <Y2KWindow
            id="news"
            title="headlines.exe"
            defaultPosition={windowPositions.news}
            defaultSize={{ width: 300, height: 300 }}
            isMinimized={windows.news.minimized}
            isActive={activeWindow === 'news'}
            onClose={() => closeWindow('news')}
            onMinimize={() => toggleWindow('news')}
            onFocus={() => focusWindow('news')}
          >
            {NewsContent()}
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-trivia">
        {windows.trivia.visible && (
          <Y2KWindow
            id="trivia"
            title="trivia.exe"
            defaultPosition={windowPositions.trivia}
            defaultSize={{ width: 320, height: 'auto' }}
            isMinimized={windows.trivia.minimized}
            isActive={activeWindow === 'trivia'}
            onClose={() => closeWindow('trivia')}
            onMinimize={() => toggleWindow('trivia')}
            onFocus={() => focusWindow('trivia')}
          >
            {TriviaContent()}
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-snake">
        {windows.snake.visible && (
          <Y2KWindow
            id="snake"
            title="snake.exe"
            defaultPosition={windowPositions.snake}
            defaultSize={{ width: 320, height: 'auto' }}
            isMinimized={windows.snake.minimized}
            isActive={activeWindow === 'snake'}
            onClose={() => closeWindow('snake')}
            onMinimize={() => toggleWindow('snake')}
            onFocus={() => focusWindow('snake')}
          >
            <SnakeGame isMobile={false} />
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-reaction">
        {windows.reaction.visible && (
          <Y2KWindow
            id="reaction"
            title="reaction.exe"
            defaultPosition={windowPositions.reaction}
            defaultSize={{ width: 280, height: 'auto' }}
            isMinimized={windows.reaction.minimized}
            isActive={activeWindow === 'reaction'}
            onClose={() => closeWindow('reaction')}
            onMinimize={() => toggleWindow('reaction')}
            onFocus={() => focusWindow('reaction')}
          >
            <ReactionGame />
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-about">
        {windows.about.visible && (
          <Y2KWindow
            id="about"
            title="about.txt"
            defaultPosition={windowPositions.about}
            defaultSize={{ width: 300, height: 'auto' }}
            isMinimized={windows.about.minimized}
            isActive={activeWindow === 'about'}
            onClose={() => closeWindow('about')}
            onMinimize={() => toggleWindow('about')}
            onFocus={() => focusWindow('about')}
          >
            {AboutContent()}
          </Y2KWindow>
        )}
      </SafeSection>

      <SafeSection name="window-sports">
        {windows.sports.visible && (
          <Y2KWindow
            id="sports"
            title="scores.exe"
            defaultPosition={windowPositions.sports}
            defaultSize={{ width: 380, height: 'auto' }}
            isMinimized={windows.sports.minimized}
            isActive={activeWindow === 'sports'}
            onClose={() => closeWindow('sports')}
            onMinimize={() => toggleWindow('sports')}
            onFocus={() => focusWindow('sports')}
          >
            <SportsTracker />
          </Y2KWindow>
        )}
      </SafeSection>
    </div>
  );

  // Mobile Homepage — modals wrapped in SafeSection for crash isolation
  const mobileHomeContent = (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="pt-8 pb-12 px-4">
        <SafeSection name="hero-mobile">
          <DraggableHeroLetters />
        </SafeSection>
      </div>

      {/* App Grid */}
      <div className="y2k-app-grid">
        <div className="y2k-app-icon" onClick={() => setMobileModal('clocks')}>
          <div className="y2k-app-img">🕐</div>
          <span className="y2k-app-label">Clocks</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('services')}>
          <div className="y2k-app-img">⚙️</div>
          <span className="y2k-app-label">Services</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('news')}>
          <div className="y2k-app-img">📰</div>
          <span className="y2k-app-label">News</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('trivia')}>
          <div className="y2k-app-img">❓</div>
          <span className="y2k-app-label">Trivia</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('snake')}>
          <div className="y2k-app-img">🐍</div>
          <span className="y2k-app-label">Snake</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('reaction')}>
          <div className="y2k-app-img">⚡</div>
          <span className="y2k-app-label">Reaction</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('about')}>
          <div className="y2k-app-img">📂</div>
          <span className="y2k-app-label">About</span>
        </div>
        <div className="y2k-app-icon" onClick={() => setMobileModal('sports')}>
          <div className="y2k-app-img">⚽</div>
          <span className="y2k-app-label">Sports</span>
        </div>
        <a className="y2k-app-icon" href="https://www.walt-tab.com" target="_blank" rel="noopener noreferrer">
          <div className="y2k-app-img">🌊</div>
          <span className="y2k-app-label">Walt-tab</span>
        </a>
        <a className="y2k-app-icon" href="https://www.salt-tab.com" target="_blank" rel="noopener noreferrer">
          <div className="y2k-app-img">🧂</div>
          <span className="y2k-app-label">Salt-tab</span>
        </a>
      </div>

      {/* Mobile Modals — each wrapped in SafeSection */}
      {mobileModal === 'clocks' && (
        <MobileModal title="WORLD CLOCKS" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-clocks">
            <WorldClocks />
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'services' && (
        <MobileModal title="SERVICES" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-services">
            {ServicesContent()}
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'news' && (
        <MobileModal title="HEADLINES" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-news">
            {NewsContent()}
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'trivia' && (
        <MobileModal title="TRIVIA" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-trivia">
            {TriviaContent()}
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'snake' && (
        <MobileModal title="SNAKE" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-snake">
            <SnakeGame isMobile={true} />
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'reaction' && (
        <MobileModal title="REACTION" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-reaction">
            <ReactionGame />
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'about' && (
        <MobileModal title="ABOUT" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-about">
            {AboutContent()}
          </SafeSection>
        </MobileModal>
      )}
      {mobileModal === 'sports' && (
        <MobileModal title="MY TEAMS" onClose={() => setMobileModal(null)}>
          <SafeSection name="modal-sports">
            <SportsTracker />
          </SafeSection>
        </MobileModal>
      )}
    </div>
  );

  // About Page (Y2K styled with windowed layout)
  const AboutPage = () => (
    <div className="pb-16">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Window: Mission & Values */}
        <div className="flex-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-2 font-mono-vt text-xs" style={{ color: 'var(--text-dim)' }}>// about.txt</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-mono-vt mb-4" style={{ color: 'var(--accent)' }}>MISSION</h2>
              <p className="font-mono-courier leading-relaxed" style={{ color: 'var(--text)' }}>
                Alt-Tab exists to bridge the gap between human needs and technological possibility. We are a think tank dedicated to designing experiences and products that enhance the quality of human life.
              </p>
            </div>
            <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-mono-vt mb-4" style={{ color: 'var(--accent)' }}>VALUES</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Human-Centric', text: 'Alt-Tab is all about building a better world for humans, so people are the priority. User experience and empathy for the human are foundational to how we think about work.' },
                  { title: 'Research-Driven', text: 'Research is vital to our process. All projects begin with a research phase.' },
                  { title: 'Rapid Prototyping', text: 'Making is fun, and a great source of information during any development process.' },
                  { title: 'Multi-Disciplinary', text: 'The team is passionate about library science, industrial design, engineering, fashion, philosophy and art.' },
                ].map((item, i) => (
                  <div key={i} className="p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <h4 className="font-mono-vt text-sm mb-1" style={{ color: 'var(--accent2)' }}>{item.title}</h4>
                    <p className="font-mono-courier text-xs" style={{ color: 'var(--text-dim)' }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm font-mono-share" style={{ color: 'var(--text-dim)' }}>
              &gt; Sometimes we make for us; "Style Matters"_<span className="y2k-blink">█</span>
            </p>
          </div>
        </div>

        {/* Right Window: Snake Game */}
        <div className="lg:w-[340px]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-2 font-mono-vt text-xs" style={{ color: 'var(--text-dim)' }}>// game.exe</span>
          </div>
          <div className="p-4">
            <SnakeGame isMobile={isMobile} />
          </div>
        </div>
      </div>
    </div>
  );

  // Shop Page
  const ShopPage = () => (
    <div className="space-y-8 pb-16">
      <div className="text-center space-y-4 p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="text-4xl md:text-5xl font-mono-vt" style={{ color: 'var(--accent)', textShadow: '0 0 20px var(--accent)' }}>SHOP</h2>
        <p className="font-mono-courier" style={{ color: 'var(--text-dim)' }}>Curated goods from Alt-Tab</p>
      </div>

      <div className="max-w-md mx-auto p-8 text-center" style={{ background: 'linear-gradient(135deg, var(--accent3) 0%, var(--accent2) 100%)', border: '1px solid var(--border)' }}>
        <Construction size={48} className="mx-auto mb-4" style={{ color: 'var(--bg)' }} />
        <h3 className="text-2xl font-mono-vt mb-4" style={{ color: 'var(--bg)' }}>UNDER CONSTRUCTION</h3>
        <p className="font-mono-courier text-sm" style={{ color: 'var(--bg)' }}>
          Limited edition goods, digital zines, and exclusive merchandise coming soon.
        </p>
      </div>

      <SnakeGame isMobile={isMobile} />
    </div>
  );

  // About and Shop page content (inline JSX, not function calls)
  const aboutElement = <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">{AboutPage()}</div>;
  const shopElement = <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">{ShopPage()}</div>;

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background */}
      <SafeSection name="background">
        <MountainBackground theme={theme} />
      </SafeSection>

      {/* Golf Ball Cursor */}
      <SafeSection name="cursor">
        <GolfBallCursor />
      </SafeSection>

      {/* Scanlines */}
      <Scanlines />

      {/* Toast */}
      <Toast message={toast.message} show={toast.show} />

      {/* Topbar */}
      <div className="y2k-topbar fixed top-0 left-0 right-0 z-[300]">
        <Link to="/" className="y2k-logo" onClick={() => window.scrollTo(0, 0)}>ALT-TAB</Link>
        <div className="y2k-nav-links hidden lg:flex">
          <Link to="/about" onClick={() => window.scrollTo(0, 0)}>about</Link>
          <Link to="/moodboards" onClick={() => window.scrollTo(0, 0)}>moodboards</Link>
          <Link to="/projects" onClick={() => window.scrollTo(0, 0)}>projects</Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="y2k-theme-toggle hidden lg:block" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <button className="lg:hidden p-2" style={{ color: 'var(--text)' }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-12 left-0 right-0 z-[299] p-4 space-y-2 lg:hidden" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <Link to="/about" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className="block py-2 font-mono-vt" style={{ color: 'var(--text)' }}>ABOUT</Link>
          <Link to="/moodboards" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className="block py-2 font-mono-vt" style={{ color: 'var(--text)' }}>MOODBOARDS</Link>
          <Link to="/projects" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className="block py-2 font-mono-vt" style={{ color: 'var(--text)' }}>PROJECTS</Link>
          <button onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setMenuOpen(false); }} className="block w-full text-left py-2 font-mono-vt" style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-14">
        <SafeSection name="routes" fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)', maxWidth: '400px' }}>
              <h2 className="text-2xl font-mono-vt mb-4" style={{ color: 'var(--accent)' }}>ALT-TAB</h2>
              <p className="font-mono-courier mb-4" style={{ color: 'var(--text)' }}>Something went wrong loading this page.</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => window.location.reload()} className="px-4 py-2 font-mono-vt" style={{ background: 'var(--accent)', color: 'var(--bg)', border: 'none', cursor: 'pointer' }}>[ RELOAD ]</button>
                <a href="/about" className="px-4 py-2 font-mono-vt" style={{ border: '1px solid var(--border)', color: 'var(--text-dim)', textDecoration: 'none', display: 'block' }}>ABOUT</a>
                <a href="/projects" className="px-4 py-2 font-mono-vt" style={{ border: '1px solid var(--border)', color: 'var(--text-dim)', textDecoration: 'none', display: 'block' }}>PROJECTS</a>
                <a href="/moodboards" className="px-4 py-2 font-mono-vt" style={{ border: '1px solid var(--border)', color: 'var(--text-dim)', textDecoration: 'none', display: 'block' }}>MOODBOARDS</a>
              </div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={isMobile ? mobileHomeContent : desktopHomeContent} />
            <Route path="/projects" element={<div className="max-w-5xl mx-auto px-4 md:px-6 py-8"><ProjectsPage /></div>} />
            <Route path="/moodboards" element={<div className="max-w-5xl mx-auto px-4 md:px-6 py-8"><MoodboardsPage /></div>} />
            <Route path="/about" element={aboutElement} />
            <Route path="/shop" element={shopElement} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SafeSection>
      </main>

      {/* Marquee Bar */}
      <SafeSection name="marquee">
        <MarqueeBar />
      </SafeSection>

      {/* Footer for inner pages */}
      {currentPage !== 'home' && (
        <footer className="relative z-10 py-6 text-center" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <Link to="/about" className="font-mono-vt text-sm" style={{ color: 'var(--text-dim)' }}>About</Link>
            <a href="https://www.instagram.com/alttab.xyz/#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono-vt text-sm" style={{ color: 'var(--text-dim)' }}>
              <Instagram size={14} /> @alttab
            </a>
            <a href="https://www.walt-tab.com/" target="_blank" rel="noopener noreferrer" className="font-mono-vt text-sm" style={{ color: 'var(--accent)' }}>Walt-tab</a>
            <a href="https://www.salt-tab.com/" target="_blank" rel="noopener noreferrer" className="font-mono-vt text-sm" style={{ color: 'var(--accent2)' }}>Salt-tab</a>
          </div>
          <p className="font-mono-share text-xs" style={{ color: 'var(--text-dim)' }}>© {new Date().getFullYear()} Alt-Tab Think Tank</p>
        </footer>
      )}
    </div>
  );
};

export default AltTabWebsite;
