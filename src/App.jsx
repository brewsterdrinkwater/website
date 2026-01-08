import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, Zap, Grid3x3, Image, BookOpen, ShoppingBag, Trophy, RefreshCw, Award } from 'lucide-react';
import * as THREE from 'three';

const AltTabWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [cursorTrail, setCursorTrail] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesCompleted, setGamesCompleted] = useState(0);
  const [showHighScore, setShowHighScore] = useState(false);
  const [currentGameType, setCurrentGameType] = useState('chess');
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

  // Three.js Earth
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(2, 32, 32);

    // Create Earth material with colors
    const material = new THREE.MeshPhongMaterial({
      color: 0x2194ce,
      emissive: 0x112244,
      specular: 0x333333,
      shininess: 25,
      wireframe: false
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add clouds layer
    const cloudGeometry = new THREE.SphereGeometry(2.05, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      earth.rotation.y += 0.001;
      earth.rotation.x = mouseY * 0.3;
      earth.rotation.y += mouseX * 0.01;

      clouds.rotation.y += 0.0015;
      clouds.rotation.x = mouseY * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
    };
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
    const games = ['chess', 'tictactoe', 'pattern', 'simon'];
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

  const ChessGame = () => {
    const [board, setBoard] = useState([
      ['♜', '', '', '', '♚', '', '', '♜'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '♟', ''],
      ['', '', '', '', '♔', '', '', '♕']
    ]);
    const [selected, setSelected] = useState(null);
    const [won, setWon] = useState(false);
    const [message, setMessage] = useState('Move the Queen to checkmate!');

    const handleSquareClick = (row, col) => {
      if (won) return;

      if (selected) {
        if (row === 0 && col === 4 && selected.piece === '♕') {
          const newBoard = board.map(r => [...r]);
          newBoard[selected.row][selected.col] = '';
          newBoard[row][col] = '♕';
          setBoard(newBoard);
          setWon(true);
          setMessage('Checkmate! +2 points');
          completeGame(2);
          setSelected(null);
        } else {
          setMessage('Not quite! Try moving the Queen to e8');
          setSelected(null);
        }
      } else if (board[row][col] === '♕') {
        setSelected({ row, col, piece: '♕' });
        setMessage('Now click where to move!');
      }
    };

    return (
      <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Checkmate in 1</h3>
            <p className="text-sm text-white/70">Medium • 2 points</p>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-0.5 mb-4 max-w-md mx-auto">
          {board.map((row, rowIdx) => row.map((piece, colIdx) => (
            <button
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleSquareClick(rowIdx, colIdx)}
              className={`aspect-square flex items-center justify-center text-2xl transition-all ${
                (rowIdx + colIdx) % 2 === 0 ? 'bg-cyan-200/90' : 'bg-purple-800/90'
              } ${selected?.row === rowIdx && selected?.col === colIdx ? 'ring-4 ring-yellow-400' : ''} ${
                won ? 'cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'
              }`}
            >
              {piece}
            </button>
          )))}
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
      {currentGameType === 'chess' && <ChessGame />}
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
      { title: 'Digital Archive Platform', category: 'Digital Goods', size: 'large' },
      { title: 'Community Library Space', category: 'Physical Goods', size: 'medium' },
      { title: 'Youth Literacy Initiative', category: 'Policy', size: 'medium' },
      { title: 'Interactive Reading Experience', category: 'Experiences', size: 'large' },
      { title: 'Sustainable Product Line', category: 'Physical Goods', size: 'small' },
      { title: 'Data Visualization Tool', category: 'Digital Goods', size: 'medium' },
      { title: 'Public Art Installation', category: 'Experiences', size: 'small' },
      { title: 'Education Policy Framework', category: 'Policy', size: 'medium' },
      { title: 'Adaptive Furniture Collection', category: 'Physical Goods', size: 'large' },
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
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  i % 4 === 0 ? 'from-cyan-400 to-blue-600' :
                  i % 4 === 1 ? 'from-purple-400 to-pink-600' :
                  i % 4 === 2 ? 'from-yellow-400 to-orange-600' :
                  'from-green-400 to-teal-600'
                } opacity-60`} />

                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Grid3x3 size={project.size === 'large' ? 80 : project.size === 'medium' ? 60 : 40} className="text-white" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-xs text-white/70 uppercase tracking-wider mb-1">{project.category}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">{project.title}</h3>
                </div>

                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/70">
                  Image {i + 1}
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
    return (
      <div className="space-y-8">
        <h2 className="text-5xl font-black text-white drop-shadow-lg">Moodboards</h2>

        <p className="text-white/80">Scroll horizontally, click to zoom. Images coming soon.</p>
        <div className="overflow-x-auto overflow-y-hidden whitespace-nowrap py-4">
          <div className="inline-flex gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="inline-block w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 hover:border-white/60 transition-all duration-300 cursor-zoom-in hover:scale-105">
                <div className="w-full h-full flex items-center justify-center">
                  <Image size={48} className="text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AboutPage = () => {
    const [ripples, setRipples] = useState([]);
    const handleClick = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples([...ripples, { x, y, id: Date.now() }]);
      setTimeout(() => setRipples(r => r.slice(1)), 1000);
    };

    return (
      <div className="space-y-8">
        <h2 className="text-5xl font-black text-white drop-shadow-lg">Philosophy</h2>

        <GameSection />

        <div
          onClick={handleClick}
          className="relative p-8 md:p-12 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 overflow-hidden cursor-pointer"
        >
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="absolute rounded-full border-2 border-white pointer-events-none animate-ping"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: '20px',
                height: '20px',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          <p className="text-xl text-white/90 leading-relaxed mb-4">
            [Your philosophy text will go here]
          </p>
          <p className="text-white/70">
            Click anywhere to create ripples while you read. Image placeholder coming soon.
          </p>
        </div>
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
      {/* 3D Earth Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ background: 'linear-gradient(to bottom, #000000, #1a1a2e)' }}
      />

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
