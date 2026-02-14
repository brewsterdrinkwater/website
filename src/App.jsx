import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, Grid3x3, Image, BookOpen, ShoppingBag, RefreshCw, Construction, Instagram, Sun, Moon } from 'lucide-react';
import { Button } from './components/ui/button';

// Scroll-reveal hook using IntersectionObserver
const useScrollReveal = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return [ref, isVisible];
};

// ScrollReveal wrapper component
const Reveal = ({ children, direction = 'up', delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();

  const transforms = {
    up: 'translateY(40px)',
    down: 'translateY(-40px)',
    left: 'translateX(40px)',
    right: 'translateX(-40px)',
    scale: 'scale(0.9)',
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : transforms[direction],
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

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

// Snake Game - defined outside main component to prevent remounting on clock re-renders
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
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(size, i * CELL); ctx.stroke();
    }
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#3b82f6' : '#60a5fa';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [snake, food]);

  return (
    <div className="w-full">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-black/20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Snake</h3>
          <div className="text-xs text-black/60 space-x-3">
            <span>Score: <strong className="text-black">{score}</strong></span>
            <span>Best: <strong className="text-black">{highScore}</strong></span>
          </div>
        </div>
        <div className="mx-auto touch-none" style={{ width: GRID * CELL, height: GRID * CELL }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} className="rounded-lg border-2 border-black/20" />
        </div>
        <div className="mt-3 flex justify-center md:hidden">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div />
            <button onClick={() => changeDir(0, -1)} className="bg-blue-600 text-white rounded p-2 text-center text-lg active:bg-blue-500">^</button>
            <div />
            <button onClick={() => changeDir(-1, 0)} className="bg-blue-600 text-white rounded p-2 text-center text-lg active:bg-blue-500">&lt;</button>
            <div className="bg-blue-100 rounded p-2" />
            <button onClick={() => changeDir(1, 0)} className="bg-blue-600 text-white rounded p-2 text-center text-lg active:bg-blue-500">&gt;</button>
            <div />
            <button onClick={() => changeDir(0, 1)} className="bg-blue-600 text-white rounded p-2 text-center text-lg active:bg-blue-500">v</button>
            <div />
          </div>
        </div>
        {!running && (
          <div className="text-center mt-3">
            <button onClick={resetGame} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold rounded-lg text-sm hover:scale-105 transition-all">
              {dead ? 'Play Again' : 'Start Game'}
            </button>
            <p className="text-xs text-black/50 mt-1">{isMobile ? 'Swipe or use D-pad' : 'Arrow keys or WASD'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reaction Time Game - defined outside main component to prevent remounting
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

  const bgColor = gameState === 'waiting' ? 'bg-gradient-to-br from-blue-500 to-blue-600'
    : gameState === 'ready' ? 'bg-gradient-to-br from-red-500 to-red-600'
    : gameState === 'go' ? 'bg-gradient-to-br from-green-400 to-green-500'
    : 'bg-gradient-to-br from-blue-500 to-orange-500';

  const msg = gameState === 'waiting' ? 'Tap to Start'
    : gameState === 'ready' ? 'Wait for green...'
    : gameState === 'go' ? 'TAP NOW!'
    : reactionTime === 'Too early!' ? 'Too early! Tap to retry'
    : `${reactionTime}ms - Tap to play again`;

  return (
    <button onClick={handleClick} className={`w-full p-6 rounded-2xl border-2 border-black/20 transition-colors active:scale-95 cursor-pointer select-none ${bgColor}`}>
      <h3 className="text-sm font-bold text-white/80 mb-1 uppercase tracking-wide">Reaction Time</h3>
      <div className="text-3xl font-black text-white mb-2">
        {gameState === 'result' && reactionTime !== 'Too early!' ? `${reactionTime}ms` : ''}
      </div>
      <p className="text-base text-white/90 font-medium">{msg}</p>
      {bestTime && <p className="text-sm text-white/70 mt-2">Best: {bestTime}ms</p>}
    </button>
  );
};

// Golf Ball Cursor - manages its own state to prevent parent re-renders
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
      className="fixed w-6 h-6 rounded-full pointer-events-none z-[100] shadow-lg"
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

// World Clocks - manages its own time state to prevent parent re-renders
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
    <div className="flex flex-wrap justify-center gap-3 text-xs">
      {clocks.map((clock) => (
        <div key={clock.city} className="bg-blue-900 text-orange-400 px-3 py-2 border-2 border-orange-400 font-mono rounded">
          <span className="text-blue-300">{clock.city}:</span>{' '}
          {time.toLocaleTimeString('en-US', {
            timeZone: clock.tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      ))}
    </div>
  );
};

const AltTabWebsite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Derive currentPage from the URL path
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // Daily trivia state
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaChoice, setTriviaChoice] = useState(null);
  const todayTrivia = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return SPORTS_TRIVIA[dayOfYear % SPORTS_TRIVIA.length];
  }, []);
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

  // Daily Trivia render function
  const renderTrivia = () => {
    const isCorrect = triviaChoice === todayTrivia.a;
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-black/20">
        <h3 className="text-sm font-bold text-blue-700 mb-1 uppercase tracking-wide">Daily Sports Trivia</h3>
        <p className="text-black font-medium text-sm mb-4">{todayTrivia.q}</p>
        <div className="grid grid-cols-1 gap-2">
          {todayTrivia.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => { setTriviaChoice(choice); setTriviaAnswered(true); }}
              disabled={triviaAnswered}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                triviaAnswered
                  ? choice === todayTrivia.a
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : choice === triviaChoice
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  : 'bg-white border-gray-200 text-black hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        {triviaAnswered && (
          <p className={`text-sm font-bold mt-3 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : `The answer is: ${todayTrivia.a}`}
          </p>
        )}
      </div>
    );
  };

  const navigateTo = (page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Letter dragging handlers
  const handleLetterMouseDown = (letter, e) => {
    e.preventDefault();
    setDraggingLetter(letter);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!draggingLetter) return;

    const handleMouseMove = (e) => {
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


  // Drudge-style links component - 2 row layout
  const NewsLinks = () => (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-black/20">
      <h3 className="text-center font-bold text-blue-700 text-lg mb-3 border-b border-black/20 pb-2">
        HEADLINES
      </h3>
      <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {NEWS_LINKS.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-black hover:text-blue-600 hover:bg-blue-100 px-2 py-1 rounded transition-colors truncate"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="-mx-4 md:-mx-6">
      {/* Hero Banner */}
      <div className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-orange-500 px-4 md:px-6">
        <Reveal direction="scale">
          <div className="text-center space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl text-white/80">★</span>
              <span className="text-sm md:text-base uppercase tracking-[0.3em] font-medium text-white/80">Multi-Disciplinary Think Tank</span>
              <span className="text-2xl text-white/80">★</span>
            </div>
            <h1
              className="text-7xl md:text-9xl lg:text-[10rem] font-black text-white leading-[0.85] select-none tracking-tight"
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
                    textShadow: '3px 3px 0px rgba(249,115,22,0.5)',
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
            <p className="text-lg md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              We design experiences and products that enhance the quality of human life.
            </p>
            {isMobile && (
              <p className="text-xs text-white/50 mt-4 animate-pulse">
                Tap letters to scatter · Double-tap to reset · Shake to shuffle
              </p>
            )}
          </div>
        </Reveal>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* World Clocks - full-width dark band */}
      <div className="bg-blue-950 py-6 px-4">
        <WorldClocks />
      </div>

      {/* Focus Areas - clean white section */}
      <div className="bg-white py-16 md:py-24 px-4 md:px-6">
        <Reveal direction="up">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-black text-center mb-4 tracking-tight">Areas of Focus</h2>
            <p className="text-lg text-black/50 text-center mb-12 md:mb-16 max-w-2xl mx-auto">Where research meets creativity across disciplines</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
              {[
                { name: 'Product Development', icon: (
                  <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 4c-1 0-2 .5-2 .5s-6 2-6 12c0 4 2 6 3 8s2 4 2 6v2h6v-2c0-2 1-4 2-6s3-4 3-8c0-10-6-11.5-6-12s-1-.5-2-.5z" strokeDasharray="1 0.5" />
                    <path d="M19 34h10" strokeDasharray="2 1" />
                    <path d="M20 38h8" strokeDasharray="2 1" />
                    <path d="M22 42h4" />
                    <path d="M24 0v2" strokeDasharray="1 1" />
                    <path d="M36 6l-2 2" strokeDasharray="1 1" />
                    <path d="M40 18h-3" strokeDasharray="1 1" />
                    <path d="M12 6l2 2" strokeDasharray="1 1" />
                    <path d="M8 18h3" strokeDasharray="1 1" />
                  </svg>
                )},
                { name: 'Research', icon: (
                  <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="20" cy="20" r="12" strokeDasharray="3 1" />
                    <path d="M29 29l12 12" strokeDasharray="2 1" />
                    <path d="M40 42l2 2" />
                    <path d="M14 14c2-2 5-3 8-3" strokeDasharray="2 2" />
                  </svg>
                )},
                { name: 'Civic', icon: (
                  <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 42h36" strokeDasharray="2 1" />
                    <path d="M8 42v-22" strokeDasharray="3 1" />
                    <path d="M16 42v-22" strokeDasharray="3 1" />
                    <path d="M24 42v-22" strokeDasharray="3 1" />
                    <path d="M32 42v-22" strokeDasharray="3 1" />
                    <path d="M40 42v-22" strokeDasharray="3 1" />
                    <path d="M4 20h40" strokeDasharray="2 1" />
                    <path d="M8 20l16-14 16 14" strokeDasharray="2 1" />
                  </svg>
                )},
                { name: 'Education', icon: (
                  <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12c4-2 8-2 12 0v28c-4-2-8-2-12 0V12z" strokeDasharray="2 1" />
                    <path d="M18 12c4-2 8-2 12 0v28c-4-2-8-2-12 0V12z" strokeDasharray="2 1" />
                    <path d="M30 12c4-2 8-2 12 0v28c-4-2-8-2-12 0V12z" strokeDasharray="2 1" />
                    <path d="M9 18h6" strokeDasharray="1 1" />
                    <path d="M9 24h6" strokeDasharray="1 1" />
                    <path d="M9 30h6" strokeDasharray="1 1" />
                    <path d="M33 18h6" strokeDasharray="1 1" />
                    <path d="M33 24h6" strokeDasharray="1 1" />
                    <path d="M33 30h6" strokeDasharray="1 1" />
                    <path d="M24 10v32" strokeDasharray="2 2" />
                  </svg>
                )},
                { name: 'Sport', icon: (
                  <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10" cy="24" r="8" strokeDasharray="2 1" />
                    <path d="M10 18l-2 3h4l-2-3z" strokeDasharray="1 0.5" />
                    <circle cx="24" cy="12" r="7" strokeDasharray="2 1" />
                    <path d="M17 12h14" strokeDasharray="1 1" />
                    <path d="M24 5v14" strokeDasharray="1 1" />
                    <path d="M19 7c2 2 2 8 0 10" strokeDasharray="1 0.5" />
                    <path d="M29 7c-2 2-2 8 0 10" strokeDasharray="1 0.5" />
                    <circle cx="38" cy="26" r="6" strokeDasharray="2 1" />
                    <path d="M38 32v8" strokeDasharray="1 1" />
                    <path d="M35 40h6" strokeDasharray="1 0.5" />
                    <circle cx="36" cy="24" r="1" strokeDasharray="0.5 0.5" />
                    <circle cx="40" cy="25" r="1" strokeDasharray="0.5 0.5" />
                    <circle cx="38" cy="28" r="1" strokeDasharray="0.5 0.5" />
                  </svg>
                )},
              ].map((area, i) => (
                <div key={i} className={`p-8 md:p-10 ${i % 2 === 0 ? 'bg-blue-50' : 'bg-orange-50'} text-center border border-black/10 hover:bg-blue-100 transition-colors`}>
                  <div className="text-blue-700">{area.icon}</div>
                  <h3 className="font-bold text-black text-sm md:text-base tracking-wide">{area.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* News, Trivia, and Game - color-blocked section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16 md:py-24 px-4 md:px-6">
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-black text-center mb-4 tracking-tight">Supporting and Challenging the World</h2>
            <p className="text-lg text-black/50 text-center mb-12 md:mb-16 max-w-2xl mx-auto">Headlines, trivia, and games — all in one place</p>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <NewsLinks />
              {renderTrivia()}
              <SnakeGame isMobile={isMobile} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* About Alt-Tab - dark color block */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 md:py-24 px-4 md:px-6">
        <Reveal direction="left" delay={0.1}>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white text-center mb-4 tracking-tight">About Alt-Tab</h2>
            <p className="text-lg text-white/60 text-center mb-12 md:mb-16 max-w-2xl mx-auto">Ideas into reality, one project at a time</p>
            <div className="grid md:grid-cols-3 gap-0">
              <button onClick={() => navigateTo('about')} className="p-8 md:p-10 bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10">
                <h3 className="font-bold text-white mb-4 text-xl">Human-Centric Design</h3>
                <p className="text-white/70 leading-relaxed">Founded by a library scientist and industrial designer, we blend research with creativity.</p>
              </button>
              <button onClick={() => navigateTo('about')} className="p-8 md:p-10 bg-white/5 hover:bg-white/15 transition-colors text-left border border-white/10">
                <h3 className="font-bold text-white mb-4 text-xl">Multi-Disciplinary</h3>
                <p className="text-white/70 leading-relaxed">From digital goods to policy, we create experiences that matter.</p>
              </button>
              <button onClick={() => navigateTo('about')} className="p-8 md:p-10 bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10">
                <h3 className="font-bold text-white mb-4 text-xl">Future-Forward</h3>
                <p className="text-white/70 leading-relaxed">Bridging nostalgia with innovation, one project at a time.</p>
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Reaction Time Game - light section */}
      <div className="bg-white py-16 md:py-24 px-4 md:px-6">
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-black text-center mb-8 tracking-tight">Test Your Reflexes</h2>
            <ReactionGame />
          </div>
        </Reveal>
      </div>

      {/* Walt-tab Link - orange color block */}
      <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 py-12 md:py-16 px-4 md:px-6">
        <Reveal direction="scale">
          <div className="text-center">
            <p className="text-black/60 text-sm uppercase tracking-widest mb-4">Our Sister Brand</p>
            <a
              href="https://www.walt-tab.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-4xl md:text-6xl font-black text-black hover:scale-105 transition-transform"
            >
              Walt-tab →
            </a>
          </div>
        </Reveal>
      </div>

      {/* Navigation buttons - bottom CTA section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 py-16 md:py-24 px-4 md:px-6">
        <Reveal direction="up" delay={0.15}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-12 tracking-tight">Explore</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { text: 'ABOUT', color: 'from-blue-500 to-blue-400', page: 'about' },
                { text: 'MOODBOARDS', color: 'from-blue-400 to-orange-500', page: 'moodboards' },
                { text: 'PROJECTS', color: 'from-orange-500 to-blue-400', page: 'projects' },
                { text: 'SHOP', color: 'from-orange-500 to-orange-400', page: 'shop' }
              ].map((link, i) => (
                <Button
                  key={i}
                  onClick={() => navigateTo(link.page)}
                  className={`bg-gradient-to-r ${link.color} text-white font-bold py-8 px-4 hover:brightness-110 text-base md:text-lg active:scale-95 rounded-xl h-auto border-0 hover:scale-105`}
                >
                  {link.text}
                </Button>
              ))}
            </div>
          </div>
        </Reveal>
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

                <Button
                  type="submit"
                  size="xl"
                  className="w-full md:w-auto"
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MoodboardsPage = () => {
    const [activeVideo, setActiveVideo] = useState(null);

    // Video collection - easy to add new videos: just add 'VIDEO_ID'
    const videos = useMemo(() => [
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
    ], []);

    // Generate shuffled videos with random sizes
    const generateShuffledVideos = useCallback(() => {
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
    }, [videos]);

    // Initialize displayVideos once on mount - stable reference
    const [displayVideos, setDisplayVideos] = useState(() => {
      const getRandomSize = () => {
        const rand = Math.random();
        if (rand < 0.35) return 'small';
        if (rand < 0.7) return 'medium';
        return 'large';
      };
      const videoIds = [
        '7IdoDJCssNk', 'M_0do0LP2tk', 'XTomk3L1R5I', 'cFwytlpCJ9U',
        'l126-q8Ne5I', '0JpVNPH6cl8', 'P_QJKaKD-i8', 'mBjo4Dmsmok',
        'sKE1nLc5P_c', '0zIVTDbve7k', 'ZYAzo5OdqHM', 'tnFPQ57l0Dg',
        'RqQGUJK7Na4', 'pYdkiWIPp-s', 'vtBoQuAtX3I',
      ];
      const shuffled = [...videoIds].sort(() => Math.random() - 0.5);
      return shuffled.map((id) => ({ id, size: getRandomSize() }));
    });

    const handleShuffle = useCallback(() => {
      setDisplayVideos(generateShuffledVideos());
    }, [generateShuffledVideos]);

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
          <Button onClick={handleShuffle} size="lg" className="rounded-full">
            <RefreshCw size={18} />
            Shuffle
          </Button>
        </div>

        {/* Video Thumbnail Grid - Masonry-like with varied sizes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[120px] md:auto-rows-[150px] -mx-4 md:mx-0">
          {displayVideos.map(({ id, size }, idx) => (
            <button
              key={`${id}-${idx}`}
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

        <SnakeGame isMobile={isMobile} />
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

      <SnakeGame isMobile={isMobile} />
    </div>
  );

  return (
    <div className={`min-h-screen overflow-x-hidden cursor-none ${darkMode ? 'bg-gray-100 text-gray-900' : 'text-white'}`}>
      {/* Golf Ball Cursor */}
      <GolfBallCursor />

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

      <nav className="relative z-50 p-4 md:p-6 border-b-4 border-black bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 md:fixed md:top-0 md:left-0 md:right-0">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-black hover:scale-110 transition-transform text-white drop-shadow-sm"
          >
            ALT-TAB
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavItem icon={BookOpen} label="About" page="about" />
            <NavItem icon={Image} label="Moodboards" page="moodboards" />
            <NavItem icon={Grid3x3} label="Projects" page="projects" />
            <NavItem icon={ShoppingBag} label="Shop" page="shop" />
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
          </div>
        )}
      </nav>

      <main className="relative z-10 md:pt-[76px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12"><ProjectsPage /></div>} />
          <Route path="/moodboards" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12"><MoodboardsPage /></div>} />
          <Route path="/about" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12"><AboutPage /></div>} />
          <Route path="/shop" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12"><ShopPage /></div>} />
        </Routes>
      </main>

      <footer className="relative z-10 py-8 text-sm bg-gradient-to-r from-blue-900 to-blue-800 border-t-4 border-black">
        {/* World Clocks - shown on all pages except homepage */}
        {currentPage !== 'home' && (
          <div className="mb-6 px-4">
            <WorldClocks />
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
