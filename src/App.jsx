import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, RefreshCw, Construction } from 'lucide-react';
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

// Marquee ticker items
const MARQUEE_ITEMS = [
  "Multi-Disciplinary Think Tank",
  "Design × Strategy × Technology",
  "Alt-Tab on conventional thinking",
  "Cross-pollinating ideas since day one",
  "Systems thinking for complex problems",
  "Connecting dots across disciplines",
  "Part studio. Part lab. Part consultancy.",
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
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#1a2540';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(size, i * CELL); ctx.stroke();
    }
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#4af0c8' : '#2dd4a8';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [snake, food]);

  return (
    <div className="w-full">
      <div className="p-4" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-vt tracking-wider" style={{ color: 'var(--accent)' }}>SNAKE</h3>
          <div className="text-xs font-tech space-x-3" style={{ color: 'var(--text-dim)' }}>
            <span>Score: <strong style={{ color: 'var(--accent)' }}>{score}</strong></span>
            <span>Best: <strong style={{ color: 'var(--accent3)' }}>{highScore}</strong></span>
          </div>
        </div>
        <div className="mx-auto touch-none" style={{ width: GRID * CELL, height: GRID * CELL }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} style={{ border: '1px solid var(--border)' }} />
        </div>
        <div className="mt-3 flex justify-center md:hidden">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div />
            <button onClick={() => changeDir(0, -1)} className="p-2 text-center text-lg font-vt" style={{ background: 'var(--title-bar)', color: 'var(--accent)', border: '1px solid var(--border)' }}>^</button>
            <div />
            <button onClick={() => changeDir(-1, 0)} className="p-2 text-center text-lg font-vt" style={{ background: 'var(--title-bar)', color: 'var(--accent)', border: '1px solid var(--border)' }}>&lt;</button>
            <div style={{ background: 'var(--bg)' }} className="p-2" />
            <button onClick={() => changeDir(1, 0)} className="p-2 text-center text-lg font-vt" style={{ background: 'var(--title-bar)', color: 'var(--accent)', border: '1px solid var(--border)' }}>&gt;</button>
            <div />
            <button onClick={() => changeDir(0, 1)} className="p-2 text-center text-lg font-vt" style={{ background: 'var(--title-bar)', color: 'var(--accent)', border: '1px solid var(--border)' }}>v</button>
            <div />
          </div>
        </div>
        {!running && (
          <div className="text-center mt-3">
            <button onClick={resetGame} className="px-4 py-2 font-vt tracking-wider text-sm transition-all hover:shadow-lg" style={{ background: 'var(--accent)', color: 'var(--bg)', border: '1px solid var(--accent)' }}>
              {dead ? 'PLAY AGAIN' : 'START GAME'}
            </button>
            <p className="text-xs font-tech mt-1" style={{ color: 'var(--text-dim)' }}>{isMobile ? 'Swipe or use D-pad' : 'Arrow keys or WASD'}</p>
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

  const bgStyle = gameState === 'waiting' ? { background: 'var(--title-bar)' }
    : gameState === 'ready' ? { background: '#7f1d1d' }
    : gameState === 'go' ? { background: '#065f46' }
    : { background: 'var(--title-bar)' };

  const msg = gameState === 'waiting' ? '> tap to start_'
    : gameState === 'ready' ? '> wait for green...'
    : gameState === 'go' ? '> TAP NOW!'
    : reactionTime === 'Too early!' ? '> too early! tap to retry'
    : `> ${reactionTime}ms — tap to play again`;

  return (
    <button onClick={handleClick} className="w-full p-6 transition-colors active:scale-95 select-none" style={{ ...bgStyle, border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-vt tracking-wider mb-1" style={{ color: 'var(--accent2)' }}>REACTION TIME</h3>
      <div className="text-3xl font-vt mb-2" style={{ color: 'var(--accent)', textShadow: '0 0 10px var(--accent)' }}>
        {gameState === 'result' && reactionTime !== 'Too early!' ? `${reactionTime}ms` : ''}
      </div>
      <p className="text-base font-tech" style={{ color: 'var(--text)' }}>{msg}<span className="blink">█</span></p>
      {bestTime && <p className="text-sm font-tech mt-2" style={{ color: 'var(--text-dim)' }}>best: {bestTime}ms</p>}
    </button>
  );
};

// Hacker Cursor - neon dot with color-cycling trail
const HackerCursor = () => {
  const cursorRef = useRef(null);
  const trailsRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const trailColors = ['#4af0c8', '#a78bfa', '#f472b6', '#60a5fa'];
    const trails = [];
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      const size = Math.max(3, 10 - i * 0.7);
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.opacity = ((12 - i) / 12 * 0.6).toString();
      document.body.appendChild(dot);
      trails.push({ el: dot, x: 0, y: 0 });
    }
    trailsRef.current = trails;

    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    const animate = () => {
      const t = trailsRef.current;
      const color = trailColors[Math.floor(frameRef.current / 20) % trailColors.length];
      if (t.length) {
        t[0].x += (mousePos.current.x - t[0].x) * 0.4;
        t[0].y += (mousePos.current.y - t[0].y) * 0.4;
        t[0].el.style.left = t[0].x + 'px';
        t[0].el.style.top = t[0].y + 'px';
        t[0].el.style.background = color;
        for (let i = 1; i < t.length; i++) {
          t[i].x += (t[i - 1].x - t[i].x) * 0.35;
          t[i].y += (t[i - 1].y - t[i].y) * 0.35;
          t[i].el.style.left = t[i].x + 'px';
          t[i].el.style.top = t[i].y + 'px';
          t[i].el.style.background = color;
        }
      }
      frameRef.current++;
      animRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    animRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animRef.current);
      trailsRef.current.forEach(t => t.el.remove());
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;
  return <div ref={cursorRef} className="cursor-dot" />;
};

// Scene Background - mountains, aurora, stars
const SceneBackground = ({ theme }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = theme === 'dark';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.6;
        const r = Math.random() * 1.5;
        const a = Math.random() * 0.8 + 0.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(255,255,255,${a})` : `rgba(50,70,120,${a * 0.4})`;
        ctx.fill();
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [theme]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 60%, var(--mountain1) 100%)' }} />
      <div className="aurora" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: '55vh' }}>
        <polygon points="0,400 0,260 80,200 160,230 260,160 360,210 460,140 540,170 640,110 720,150 820,90 900,130 1000,80 1080,120 1180,70 1260,110 1360,60 1440,100 1440,400" fill="var(--mountain2)" opacity="0.9"/>
        <polygon points="820,90 800,130 840,130" fill="var(--snow)" opacity="0.5"/>
        <polygon points="1180,70 1160,110 1200,110" fill="var(--snow)" opacity="0.4"/>
        <polygon points="460,140 440,175 480,175" fill="var(--snow)" opacity="0.4"/>
        <polygon points="0,400 0,310 60,280 140,300 220,250 320,270 420,220 500,240 600,190 700,215 780,170 860,200 960,155 1040,180 1140,145 1220,165 1320,130 1440,155 1440,400" fill="var(--mountain1)" opacity="0.95"/>
        <polygon points="600,190 582,220 618,220" fill="var(--snow)" opacity="0.6"/>
        <polygon points="960,155 942,185 978,185" fill="var(--snow)" opacity="0.55"/>
        <polygon points="1320,130 1302,162 1338,162" fill="var(--snow)" opacity="0.5"/>
        <polygon points="0,400 0,350 100,330 200,345 300,310 400,330 520,295 640,320 760,285 880,310 1000,275 1120,300 1240,270 1360,295 1440,275 1440,400" fill="var(--mountain3)" opacity="0.8"/>
        <rect x="0" y="370" width="1440" height="30" fill="var(--bg2)" opacity="0.9"/>
      </svg>
    </div>
  );
};

// Reusable Window Panel
const WinPanel = ({ title, children, className = '', style = {} }) => (
  <div className={`win ${className}`} style={style}>
    <div className="win-titlebar">
      <div className="win-btns"><span className="win-btn close" /><span className="win-btn min" /><span className="win-btn max" /></div>
      <div className="win-title">// {title}</div>
    </div>
    <div className="win-body">{children}</div>
  </div>
);

// Draggable Hero Letters - manages its own state to prevent parent re-renders
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
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
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
    // Secret shop link behind the dash on mobile
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
    // Secret shop link behind the dash - only trigger if not dragged
    if (letter === '-' && !hasDragged) {
      navigate('/shop');
    }
  };

  useEffect(() => {
    if (!draggingLetter) return;
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      // Only count as drag if moved more than 5px
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
    <div className="text-center space-y-4 max-w-5xl mx-auto">
      <span className="text-sm md:text-base uppercase tracking-[0.3em] font-tech" style={{ color: 'var(--text-dim)' }}>Multi-Disciplinary Think Tank</span>
      <h1
        className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.85] select-none tracking-tight"
        style={{ fontFamily: "'VT323', monospace" }}
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
              color: 'var(--accent)',
              textShadow: '0 0 30px var(--accent), 0 0 60px rgba(74,240,200,0.3)',
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
      <p className="text-base md:text-xl font-tech max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
        We design experiences and products that enhance the quality of human life.
      </p>
      {isMobile && (
        <p className="text-xs mt-4 animate-pulse font-tech" style={{ color: 'var(--text-dim)' }}>
          Tap letters to scatter · Double-tap to reset · Shake to shuffle
        </p>
      )}
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
        <div key={clock.city} className="px-3 py-2 font-tech" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--accent)' }}>
          <span style={{ color: 'var(--text-dim)' }}>{clock.city}:</span>{' '}
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

// Sports Tracker - Arsenal & Mets via ESPN API
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

    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/359/schedule')
      .then(r => r.json())
      .then(data => {
        const { last5, next5 } = parseGames(data.events, 359);
        setArsenal(prev => ({ ...prev, loading: false, last5, next5 }));
      }).catch(() => setArsenal(prev => ({ ...prev, loading: false })));

    fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings')
      .then(r => r.json())
      .then(data => {
        const entries = data.children?.[0]?.standings?.entries || [];
        const a = entries.find(e => String(e.team?.id) === '359');
        if (a) {
          const getStat = (name) => a.stats?.find(s => s.name === name)?.value;
          setArsenal(prev => ({ ...prev, standing: { rank: getStat('rank'), points: getStat('points'), wins: getStat('wins'), losses: getStat('losses'), draws: getStat('ties') } }));
        }
      }).catch(() => {});

    fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/21/schedule')
      .then(r => r.json())
      .then(data => {
        const { last5, next5 } = parseGames(data.events, 21);
        setMets(prev => ({ ...prev, loading: false, last5, next5 }));
      }).catch(() => setMets(prev => ({ ...prev, loading: false })));

    fetch('https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings')
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
    <div className="flex justify-between text-xs font-tech py-0.5" style={{ color: 'var(--text-dim)' }}>
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
        <h3 className="font-vt text-lg tracking-wider mb-2" style={{ color: 'var(--accent)' }}>ARSENAL FC <span style={{ color: 'var(--text-dim)' }}>⚽ Premier League</span></h3>
        {arsenal.loading ? <p className="text-xs font-tech" style={{ color: 'var(--text-dim)' }}>loading...</p> : (
          <>
            {arsenal.last5.length > 0 && (<><p className="text-xs font-vt mb-1" style={{ color: 'var(--accent2)' }}>RECENT</p>{arsenal.last5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {arsenal.next5.length > 0 && (<><p className="text-xs font-vt mt-2 mb-1" style={{ color: 'var(--accent2)' }}>UPCOMING</p>{arsenal.next5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {arsenal.standing && <p className="text-xs font-tech mt-2" style={{ color: 'var(--text-dim)' }}>Standing: {arsenal.standing.rank ? `#${arsenal.standing.rank}` : '—'} | {arsenal.standing.wins ?? '—'}W {arsenal.standing.draws ?? '—'}D {arsenal.standing.losses ?? '—'}L | {arsenal.standing.points ?? '—'}pts</p>}
          </>
        )}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <h3 className="font-vt text-lg tracking-wider mb-2" style={{ color: 'var(--accent)' }}>NEW YORK METS <span style={{ color: 'var(--text-dim)' }}>⚾ MLB</span></h3>
        {mets.loading ? <p className="text-xs font-tech" style={{ color: 'var(--text-dim)' }}>loading...</p> : (
          <>
            {mets.last5.length > 0 && (<><p className="text-xs font-vt mb-1" style={{ color: 'var(--accent2)' }}>RECENT</p>{mets.last5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {mets.next5.length > 0 && (<><p className="text-xs font-vt mt-2 mb-1" style={{ color: 'var(--accent2)' }}>UPCOMING</p>{mets.next5.map((g, i) => <GameRow key={i} g={g} />)}</>)}
            {mets.standing && <p className="text-xs font-tech mt-2" style={{ color: 'var(--text-dim)' }}>Standing: {mets.standing.rank ? `#${mets.standing.rank}` : '—'} | {mets.standing.wins ?? '—'}W {mets.standing.losses ?? '—'}L | {mets.standing.pct ? (mets.standing.pct).toFixed(3) : '—'}</p>}
            {mets.last5.length === 0 && mets.next5.length === 0 && <p className="text-xs font-tech" style={{ color: 'var(--text-dim)' }}>Season data loading soon...</p>}
          </>
        )}
      </div>
    </div>
  );
};

const AltTabWebsite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(false);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaChoice, setTriviaChoice] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);
  const todayTrivia = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return SPORTS_TRIVIA[dayOfYear % SPORTS_TRIVIA.length];
  }, []);

  // Window dragging system - drag from ANY spot on window
  const zCounter = useRef(300);
  const dragRef = useRef(null);
  const calcInitialPositions = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    if (vw < 1024) return {}; // mobile: no absolute positioning
    return {
      'win-about': { x: 15, y: 60 },
      'win-focus': { x: 15, y: 370 },
      'win-clocks': { x: vw - 370, y: 60 },
      'win-news': { x: vw - 350, y: 250 },
      'win-contact': { x: Math.floor(vw * 0.35), y: 520 },
      'win-now': { x: Math.floor(vw * 0.35), y: 340 },
      'win-sports': { x: vw - 420, y: 400 },
      'win-trivia': { x: vw - 280, y: 620 },
    };
  }, []);
  const [winPos, setWinPos] = useState(calcInitialPositions);
  const [winZ, setWinZ] = useState({});
  const [winVisible, setWinVisible] = useState({
    'win-about': true, 'win-focus': true, 'win-clocks': true, 'win-news': true,
    'win-contact': true, 'win-now': true, 'win-sports': true, 'win-trivia': true,
  });

  const bringToFront = useCallback((id) => {
    zCounter.current += 1;
    setWinZ(prev => ({ ...prev, [id]: zCounter.current }));
  }, []);

  const handleWinMouseDown = useCallback((id, e) => {
    // Don't drag if clicking interactive elements inside the window
    const tag = e.target.tagName;
    if (['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target.closest('button') || e.target.closest('a')) return;
    bringToFront(id);
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    dragRef.current = { id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    e.preventDefault();
  }, [bringToFront]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current) return;
      const { id, offsetX, offsetY } = dragRef.current;
      setWinPos(prev => ({ ...prev, [id]: { x: e.clientX - offsetX, y: e.clientY - offsetY } }));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const closeWin = useCallback((id) => {
    setWinVisible(prev => ({ ...prev, [id]: false }));
  }, []);

  const showWin = useCallback((id) => {
    setWinVisible(prev => ({ ...prev, [id]: true }));
    bringToFront(id);
    showToast(id.replace('win-', '') + ' opened');
  }, [bringToFront]);

  // Theme toggle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Toast
  const showToast = useCallback((msg) => {
    setToastMsg('✦ ' + msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Daily Trivia render function
  const renderTrivia = () => {
    const isCorrect = triviaChoice === todayTrivia.a;
    return (
      <div>
        <p className="font-mono text-xs mb-3" style={{ color: 'var(--text)' }}>{todayTrivia.q}</p>
        <div className="grid grid-cols-1 gap-1">
          {todayTrivia.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => { setTriviaChoice(choice); setTriviaAnswered(true); }}
              disabled={triviaAnswered}
              className="text-left px-2 py-1 text-xs font-tech transition-all"
              style={{
                border: '1px solid ' + (triviaAnswered
                  ? choice === todayTrivia.a ? '#4af0c8' : choice === triviaChoice ? '#f472b6' : 'var(--border)'
                  : 'var(--border)'),
                color: triviaAnswered
                  ? choice === todayTrivia.a ? '#4af0c8' : choice === triviaChoice ? '#f472b6' : 'var(--text-dim)'
                  : 'var(--text)',
                background: triviaAnswered && choice === todayTrivia.a ? 'rgba(74,240,200,0.1)' : 'transparent',
              }}
            >
              {choice}
            </button>
          ))}
        </div>
        {triviaAnswered && (
          <p className="text-xs font-vt mt-2" style={{ color: isCorrect ? '#4af0c8' : '#f472b6' }}>
            {isCorrect ? '> correct!' : `> answer: ${todayTrivia.a}`}
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

  // News links component - hacker styled
  const NewsLinks = () => (
    <div className="max-h-72 overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {NEWS_LINKS.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
            className="block text-xs font-tech px-1 py-0.5 truncate transition-colors"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={e => { e.target.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-dim)'; }}
          >{link.title}</a>
        ))}
      </div>
    </div>
  );

  // Desktop icon component
  const DesktopIcon = ({ emoji, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity py-1">
      <div className="w-10 h-10 flex items-center justify-center text-xl" style={{ background: 'var(--title-bar)', border: '1px solid var(--border)' }}>{emoji}</div>
      <span className="font-vt text-xs" style={{ color: 'var(--text)', textShadow: '1px 1px 3px var(--bg)' }}>{label}</span>
    </button>
  );

  // Desktop draggable window wrapper
  const DeskWin = ({ id, title, width, children }) => {
    if (!winVisible[id]) return null;
    const pos = winPos[id] || { x: 0, y: 0 };
    const z = winZ[id] || 100;
    if (isMobile) {
      return (
        <WinPanel title={title} className="mb-4">
          {children}
        </WinPanel>
      );
    }
    return (
      <div
        className="win"
        style={{ position: 'absolute', left: pos.x, top: pos.y, width: width || 340, zIndex: z, userSelect: 'none' }}
        onMouseDown={(e) => handleWinMouseDown(id, e)}
      >
        <div className="win-titlebar">
          <div className="win-btns">
            <button className="win-btn close" onClick={() => closeWin(id)} />
            <span className="win-btn min" />
            <span className="win-btn max" />
          </div>
          <div className="win-title">// {title}</div>
        </div>
        <div className="win-body">{children}</div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="relative" style={{ minHeight: isMobile ? 'auto' : 'calc(100vh - 70px)' }}>
      {/* Hero Letters - centered in open space */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none">
          <div className="pointer-events-auto">
            <DraggableHeroLetters />
          </div>
        </div>
      )}

      {isMobile && (
        <div className="py-12 px-4">
          <DraggableHeroLetters />
        </div>
      )}

      {/* Desktop Icons - left side */}
      {!isMobile && (
        <div className="fixed left-4 top-16 z-[60] flex flex-col gap-3 pt-4">
          <DesktopIcon emoji="📂" label="ABOUT" onClick={() => showWin('win-about')} />
          <DesktopIcon emoji="⚙️" label="FOCUS" onClick={() => showWin('win-focus')} />
          <DesktopIcon emoji="🕐" label="CLOCKS" onClick={() => showWin('win-clocks')} />
          <DesktopIcon emoji="📰" label="NEWS" onClick={() => showWin('win-news')} />
          <DesktopIcon emoji="✉️" label="CONTACT" onClick={() => showWin('win-contact')} />
          <DesktopIcon emoji="📡" label="NOW" onClick={() => showWin('win-now')} />
          <DesktopIcon emoji="⚽" label="SPORTS" onClick={() => showWin('win-sports')} />
          <DesktopIcon emoji="🎲" label="TRIVIA" onClick={() => showWin('win-trivia')} />
        </div>
      )}

      {/* Draggable Windows (desktop) / Stacked panels (mobile) */}
      {isMobile ? (
        <div className="px-4 space-y-4 pb-12">
          <WinPanel title="about.txt"><h2>WHO WE ARE</h2><p>Alt-Tab is a multi-disciplinary think tank at the intersection of design, strategy, and emerging technology.</p><p>We believe the best solutions come from looking sideways — pressing alt-tab on conventional thinking.</p><h3>APPROACH</h3><p>Sometimes we make for us; "Style Matters"</p></WinPanel>
          <WinPanel title="focus_areas.txt">
            <h2>AREAS OF FOCUS</h2>
            {['Product Development', 'Research', 'Civic', 'Education', 'Sport'].map(a => (
              <span key={a} className="tag mr-1 mb-1">{a.toUpperCase()}</span>
            ))}
            <p className="mt-3">Where research meets creativity across disciplines</p>
          </WinPanel>
          <WinPanel title="world_clocks"><WorldClocks /></WinPanel>
          <WinPanel title="front_page_news"><h2>FRONT PAGE NEWS</h2><NewsLinks /></WinPanel>
          <WinPanel title="contact.txt"><h2>SAY HI</h2><p>Got a project, a question, or a weird idea?</p><p style={{ marginTop: 10 }}><a href="mailto:hello@alt-tab.xyz" style={{ color: 'var(--accent)', borderBottom: '1px dotted var(--accent)' }}>hello@alt-tab.xyz</a></p></WinPanel>
          <WinPanel title="now.log"><h2>CURRENTLY</h2><ul><li>Building tools for collective thinking</li><li>Researching emergence &amp; complexity</li><li>Collaborating with a handful of bold clients</li><li>Always reading too many things at once</li></ul></WinPanel>
          <WinPanel title="scores.exe"><h2>MY TEAMS</h2><SportsTracker /></WinPanel>
          <WinPanel title="trivia.log"><h2>DAILY TRIVIA</h2>{renderTrivia()}</WinPanel>
        </div>
      ) : (
        <>
          {/* ABOUT - large, top-left */}
          <DeskWin id="win-about" title="about.txt" width={430}>
            <h2>WHO WE ARE</h2>
            <p>Alt-Tab is a multi-disciplinary think tank at the intersection of design, strategy, and emerging technology.</p>
            <p>We believe the best solutions come from looking sideways — pressing alt-tab on conventional thinking.</p>
            <h3>APPROACH</h3>
            <p>Sometimes we make for us; "Style Matters"</p>
          </DeskWin>

          {/* AREAS OF FOCUS - large, bottom-left */}
          <DeskWin id="win-focus" title="focus_areas.txt" width={450}>
            <h2>AREAS OF FOCUS</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: 8, fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>Where research meets creativity across disciplines</p>
            <div className="grid grid-cols-5 gap-0">
              {['Product Development', 'Research', 'Civic', 'Education', 'Sport'].map((area, i) => (
                <div key={i} className="py-4 px-2 text-center transition-colors" style={{ border: '1px solid var(--border)', background: i % 2 === 0 ? 'rgba(74,240,200,0.05)' : 'rgba(167,139,250,0.05)' }}>
                  <h3 className="font-vt text-sm tracking-wider" style={{ color: 'var(--accent)' }}>{area}</h3>
                </div>
              ))}
            </div>
          </DeskWin>

          {/* WORLD CLOCKS - top-right */}
          <DeskWin id="win-clocks" title="world_clocks" width={340}>
            <WorldClocks />
          </DeskWin>

          {/* FRONT PAGE NEWS - right */}
          <DeskWin id="win-news" title="front_page_news" width={310}>
            <h2>FRONT PAGE NEWS</h2>
            <NewsLinks />
          </DeskWin>

          {/* CONTACT - bottom center */}
          <DeskWin id="win-contact" title="contact.txt" width={280}>
            <h2>SAY HI</h2>
            <p>Got a project, a question, or a weird idea?</p>
            <p style={{ marginTop: 10 }}><a href="mailto:hello@alt-tab.xyz">hello@alt-tab.xyz</a></p>
            <p className="font-tech text-xs mt-3" style={{ color: 'var(--text-dim)' }}>&gt; response time: 24–48hrs_<span className="blink">█</span></p>
          </DeskWin>

          {/* NOW - center-right */}
          <DeskWin id="win-now" title="now.log" width={300}>
            <h2>CURRENTLY</h2>
            <ul>
              <li>Building tools for collective thinking</li>
              <li>Researching emergence &amp; complexity</li>
              <li>Collaborating with a handful of bold clients</li>
              <li>Always reading too many things at once</li>
            </ul>
            <p className="font-tech text-xs mt-3" style={{ color: 'var(--text-dim)' }}>last updated: 2025.02_</p>
          </DeskWin>

          {/* SPORTS - right */}
          <DeskWin id="win-sports" title="scores.exe" width={390}>
            <h2>MY TEAMS</h2>
            <SportsTracker />
          </DeskWin>

          {/* DAILY TRIVIA - smallest, bottom-right */}
          <DeskWin id="win-trivia" title="trivia.log" width={250}>
            <h3 style={{ fontSize: 16 }}>DAILY TRIVIA</h3>
            {renderTrivia()}
          </DeskWin>
        </>
      )}
    </div>
  );

  const ProjectsPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      const subject = `Alt-Tab Inquiry from ${formData.name}`;
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`;
      window.location.href = `mailto:ty@alt-tab.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setFormSubmitted(true);
      setTimeout(() => { setFormSubmitted(false); setFormData({ name: '', email: '', company: '', message: '' }); }, 3000);
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
        <WinPanel title="partners.txt">
          <h2>SUPPORTIVE PARTNERS</h2>
          <p className="font-tech text-xs" style={{ color: 'var(--accent3)', fontStyle: 'italic' }}>"Sometimes we do work for us; sometimes we do work with you."</p>
          <p className="mt-2" style={{ color: 'var(--text-dim)' }}>The organizations featured here represent collaborations where we were able to share our work publicly. Much of what the Alt-Tab team builds is protected under NDA, as we often embed directly within our clients' internal teams.</p>
        </WinPanel>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projects.map((project, i) => {
            const CardWrapper = project.link ? 'a' : 'div';
            const linkProps = project.link ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <CardWrapper key={i} {...linkProps} className="group block p-4 transition-all hover:scale-105"
                style={{ background: 'var(--window-bg)', border: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  {project.logoText ? (
                    <span className="text-2xl md:text-3xl font-vt tracking-wider" style={{ color: 'var(--accent)' }}>{project.logoText}</span>
                  ) : (
                    <img src={project.logo} alt={project.name} loading="lazy" className="max-h-full max-w-full object-contain" />
                  )}
                </div>
                <h3 className="font-vt text-center text-sm tracking-wider" style={{ color: 'var(--text)' }}>{project.name}</h3>
                <p className="text-xs text-center mt-1 font-tech" style={{ color: 'var(--text-dim)' }}>{project.description}</p>
              </CardWrapper>
            );
          })}
        </div>

        <WinPanel title="inquiry.exe">
          <h2>WORK WITH US</h2>
          <p style={{ color: 'var(--text-dim)' }}>Have a project in mind? Let's create something together.</p>
          {formSubmitted ? (
            <div className="text-center py-8">
              <h3 className="font-vt text-2xl" style={{ color: 'var(--accent)' }}>TRANSMISSION SENT</h3>
              <p className="font-tech text-sm mt-2" style={{ color: 'var(--text-dim)' }}>We will be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-tech text-xs mb-1" style={{ color: 'var(--accent2)' }}>NAME *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="hacker-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="block font-tech text-xs mb-1" style={{ color: 'var(--accent2)' }}>EMAIL *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="hacker-input" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block font-tech text-xs mb-1" style={{ color: 'var(--accent2)' }}>COMPANY</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="hacker-input" placeholder="Optional" />
              </div>
              <div>
                <label className="block font-tech text-xs mb-1" style={{ color: 'var(--accent2)' }}>PROJECT DETAILS *</label>
                <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={5} className="hacker-input" style={{ resize: 'none' }} placeholder="What are you looking to create?" />
              </div>
              <Button type="submit" size="lg">SEND INQUIRY</Button>
            </form>
          )}
        </WinPanel>
      </div>
    );
  };

  const MoodboardsPage = () => {
    const [activeVideo, setActiveVideo] = useState(null);
    const videos = useMemo(() => ['7IdoDJCssNk','M_0do0LP2tk','XTomk3L1R5I','cFwytlpCJ9U','l126-q8Ne5I','0JpVNPH6cl8','P_QJKaKD-i8','mBjo4Dmsmok','sKE1nLc5P_c','0zIVTDbve7k','ZYAzo5OdqHM','tnFPQ57l0Dg','RqQGUJK7Na4','pYdkiWIPp-s','vtBoQuAtX3I'], []);
    const generateShuffledVideos = useCallback(() => {
      const sizes = ['small','medium','large'];
      return [...videos].sort(() => Math.random() - 0.5).map(id => ({ id, size: sizes[Math.floor(Math.random() * 3)] }));
    }, [videos]);
    const [displayVideos, setDisplayVideos] = useState(() => generateShuffledVideos());
    const getSizeClasses = (s) => s === 'large' ? 'col-span-2 row-span-2' : s === 'medium' ? 'col-span-2 md:col-span-1' : 'col-span-1';

    return (
      <div className="space-y-8">
        <WinPanel title="moodboards.exe">
          <h2>MOODBOARDS</h2>
          <p style={{ color: 'var(--text-dim)' }}>Video inspiration from skate culture and contemporary design</p>
          <Button onClick={() => setDisplayVideos(generateShuffledVideos())} variant="outline" size="sm" className="mt-3">
            <RefreshCw size={14} /> SHUFFLE
          </Button>
        </WinPanel>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[120px] md:auto-rows-[150px]">
          {displayVideos.map(({ id, size }, idx) => (
            <button key={`${id}-${idx}`} onClick={() => setActiveVideo(id)}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${getSizeClasses(size)}`}
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 flex items-center justify-center" style={{ background: 'var(--accent)', borderRadius: '50%' }}>
                  <svg className="w-6 h-6 ml-1" fill="var(--bg)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center pt-4">
          <a href="https://www.youtube.com/@quartersnacksdotcom" target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 font-vt tracking-wider text-sm transition-all"
            style={{ background: 'var(--title-bar)', color: 'var(--accent)', border: '1px solid var(--border)' }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
          >QUARTERSNACKS →</a>
        </div>

        {activeVideo && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
            <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setActiveVideo(null)} className="absolute -top-10 right-0 flex items-center gap-2 font-vt tracking-wider" style={{ color: 'var(--text-dim)' }}>
                CLOSE <X size={18} />
              </button>
              <div className="aspect-video" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <iframe src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AboutPage = () => (
    <div className="space-y-8">
      <WinPanel title="philosophy.txt">
        <h2>PHILOSOPHY</h2>
        <p style={{ color: 'var(--text-dim)' }}>Where research meets creativity, and ideas become reality</p>
      </WinPanel>

      <WinPanel title="mission.txt">
        <h2>OUR MISSION</h2>
        <p>Alt-Tab exists to bridge the gap between human needs and technological possibility. We are a think tank dedicated to designing experiences and products that enhance the quality of human life.</p>
        <p>Whether developing digital platforms, physical products, policy frameworks, or immersive experiences, we maintain an unwavering commitment to thoughtful, intentional design that serves people first.</p>
        <p>Our team is led by real humans who prefer working in the shadows. We're not chasing clout or followers—we'd rather meet you for coffee, shake your hand, and have a real conversation. We believe the best ideas emerge from genuine connection, not comment sections.</p>
        <p className="font-tech text-xs mt-4" style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Yes, we're actually human. We have coffee addictions, strong opinions about fonts, and we occasionally forget to unmute ourselves on video calls. No AI wrote this. (We checked.)</p>
      </WinPanel>

      <div className="grid md:grid-cols-[3fr_2fr] gap-6">
        <WinPanel title="human_centric.txt">
          <h3>HUMAN-CENTRIC DESIGN</h3>
          <p>Alt-Tab is all about building a better world for humans, so people are the priority. User experience and empathy for the human are foundational to how we think about work.</p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="tag">UX DESIGN</span><span className="tag">EMPATHY</span><span className="tag">HUMAN-CENTERED</span>
          </div>
        </WinPanel>

        <WinPanel title="research.txt">
          <h3>RESEARCH-DRIVEN PROCESS</h3>
          <p>Research is vital to our process. All projects begin with a research phase — combining qualitative and quantitative methods to build a comprehensive understanding of complex challenges.</p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="tag">RESEARCH</span><span className="tag">DATA</span><span className="tag">INSIGHTS</span>
          </div>
        </WinPanel>

        <WinPanel title="prototyping.txt">
          <h3>RAPID PROTOTYPING</h3>
          <p>Making is fun, and a great source of information during any development process. By creating tangible artifacts early, we reduce risk and accelerate innovation.</p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="tag">PROTOTYPING</span><span className="tag">ITERATION</span><span className="tag">MAKING</span>
          </div>
        </WinPanel>

        <WinPanel title="disciplines.txt">
          <h3>MULTI-DISCIPLINARY</h3>
          <p>The team is passionate about library science, industrial design, engineering, fashion, philosophy, and art. This cross-pollination of disciplines enables us to approach challenges from multiple angles.</p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="tag">LIBRARY SCIENCE</span><span className="tag">INDUSTRIAL DESIGN</span><span className="tag">ENGINEERING</span><span className="tag">FASHION</span><span className="tag">PHILOSOPHY</span><span className="tag">ART</span>
          </div>
        </WinPanel>
      </div>

      <WinPanel title="snake.exe">
        <SnakeGame isMobile={isMobile} />
      </WinPanel>
    </div>
  );

  const ShopPage = () => (
    <div className="space-y-8">
      <WinPanel title="shop.exe">
        <h2>SHOP</h2>
        <p style={{ color: 'var(--text-dim)' }}>Curated goods from Alt-Tab</p>
      </WinPanel>
      <div className="max-w-2xl mx-auto">
        <WinPanel title="construction.log">
          <div className="text-center py-6">
            <Construction size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px' }} />
            <h3 className="font-vt text-2xl tracking-wider mb-3" style={{ color: 'var(--accent)', textShadow: '0 0 10px var(--accent)' }}>UNDER CONSTRUCTION</h3>
            <p style={{ color: 'var(--text-dim)' }}>We're working on something special. Limited edition goods, digital zines, and exclusive Alt-Tab merchandise.</p>
            <p className="font-tech text-xs mt-4" style={{ color: 'var(--text-dim)' }}>&gt; check back soon_<span className="blink">█</span></p>
          </div>
        </WinPanel>
      </div>
      <WinPanel title="snake.exe">
        <SnakeGame isMobile={isMobile} />
      </WinPanel>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-hidden" data-theme={theme}>
      <HackerCursor />
      <SceneBackground theme={theme} />
      <div className="scanlines" />

      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toastMsg}</div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen" style={{ paddingBottom: 40 }}>
        {/* Topbar */}
        <nav className="topbar relative z-50 mx-4 mt-4 mb-6">
          <div className="flex items-center gap-5">
            <Link to="/" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className="logo" style={{ fontSize: 22 }}>ALT-TAB.XYZ</Link>
            <div className="nav-links hidden md:flex">
              <Link to="/about" onClick={() => window.scrollTo(0, 0)} className={currentPage === 'about' ? 'active' : ''}>about</Link>
              <Link to="/moodboards" onClick={() => window.scrollTo(0, 0)} className={currentPage === 'moodboards' ? 'active' : ''}>moodboards</Link>
              <Link to="/projects" onClick={() => window.scrollTo(0, 0)} className={currentPage === 'projects' ? 'active' : ''}>projects</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="theme-toggle" onClick={toggleTheme}>[ ☀ / ☾ ]</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ color: 'var(--text)', fontFamily: "'VT323', monospace", fontSize: 22 }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 p-4 space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>
              {['home','about','moodboards','projects'].map(p => (
                <Link key={p} to={p === 'home' ? '/' : `/${p}`} onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }}
                  className="block py-2 px-3 font-vt tracking-wider transition-colors"
                  style={{ color: currentPage === p ? 'var(--accent)' : 'var(--text-dim)' }}
                >{p.toUpperCase()}</Link>
              ))}
            </div>
          )}
        </nav>

        {/* Routes */}
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8"><ProjectsPage /></div>} />
            <Route path="/moodboards" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8"><MoodboardsPage /></div>} />
            <Route path="/about" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8"><AboutPage /></div>} />
            <Route path="/shop" element={<div className="max-w-7xl mx-auto px-4 md:px-6 py-8"><ShopPage /></div>} />
          </Routes>
        </main>

        {/* Footer - non-home pages */}
        {currentPage !== 'home' && (
          <footer className="relative z-10 py-6 mt-8 mx-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="mb-4 px-4"><WorldClocks /></div>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-3 px-4">
              <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="font-vt tracking-wider px-3 py-1 transition-all" style={{ color: 'var(--text-dim)', border: '1px solid var(--border)' }}>ABOUT</Link>
              <a href="https://www.instagram.com/alttab.xyz/#" target="_blank" rel="noopener noreferrer" className="font-vt tracking-wider px-3 py-1 transition-all" style={{ color: 'var(--text-dim)', border: '1px solid var(--border)' }}>@ALTTAB</a>
              <a href="https://www.walt-tab.com/" target="_blank" rel="noopener noreferrer" className="font-vt tracking-wider px-3 py-1 transition-all" style={{ background: 'linear-gradient(to right, #fb923c, #facc15)', color: '#000', fontWeight: 'bold' }}>WALT-TAB</a>
              <a href="https://www.salt-tab.com/" target="_blank" rel="noopener noreferrer" className="font-vt tracking-wider px-3 py-1 transition-all" style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}>SALT-TAB</a>
            </div>
            <p className="text-center font-tech text-xs" style={{ color: 'var(--text-dim)' }}>© {new Date().getFullYear()} Alt-Tab Think Tank · Multi-Disciplinary</p>
          </footer>
        )}
      </div>

      {/* Marquee Bar */}
      <div className="marquee-bar">
        <div className="marquee-label">ALT-TAB.XYZ</div>
        <div style={{ overflow: 'hidden', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltTabWebsite;
