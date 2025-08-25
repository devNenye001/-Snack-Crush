import { useEffect, useState } from "react";
import useSound from "use-sound";
import "./Game.css";

// Snacks
import Hotdog from "/hotdog.svg";
import Snickers from "/snickers.svg";
import Pizza from "/pizza.svg";
// import Cherry from "/cherry.svg";
import Burger from "/burger.svg";
import Sandwich from "/sandwich.svg";
// import Cookie from "/cookie.svg";
import Snack from "/snack.svg";
import Donut from "/donut.svg";

// Powerups
import Bomb from "/bomb.svg";
import ShuffleShip from "/shuffleship.svg";
import Lollipop from "/lollipop.svg";
import PowerUp from "../../components/PowerUps/PowerUp/PowerUp";

// Sounds
import swapSound from "/swap-sound.mp3";
import matchSound from "/match2.mp3";
import doubleSound from "/bonus.mp3";
import tripleSound from "/bonus.mp3";
import bombSound from "/activate.wav";
import lollipopSound from "/activate.wav";
import gameMusic from "/game-music2.mp3";
import winSound from "/win.mp3";
import loseSound from "/fail2.mp3";
import reshuffleSoundFile from "/shuffle.mp3";

import GameOver from "../GameOver/GameOver";

const snacks = [Hotdog, Snickers, Pizza, Burger, Sandwich, Snack, Donut];

const GRID_SIZE = 4; // ✅ 4x4 grid

const Game = () => {
  // Game state
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(12);
  const [points, setPoints] = useState(0);
  const [challengeSnack, setChallengeSnack] = useState(null);
  const [challengeTarget, setChallengeTarget] = useState(8);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [praise, setPraise] = useState("");
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [praiseType, setPraiseType] = useState("");

  // Nickname
  const name = localStorage.getItem("nickname") || "Player";

  // PowerUps
  const [activePower, setActivePower] = useState(null);

  // Sounds
  const [playSwap] = useSound(swapSound);
  const [playMatch] = useSound(matchSound);
  const [playDouble] = useSound(doubleSound);
  const [playTriple] = useSound(tripleSound);
  const [playBomb] = useSound(bombSound);
  const [playLollipop] = useSound(lollipopSound);
  const [playWin] = useSound(winSound, { volume: 0.7 });
  const [playLose] = useSound(loseSound, { volume: 0.7 });
  const [playReshuffle] = useSound(reshuffleSoundFile);
  const [playGameMusic, { stop: stopGameMusic }] = useSound(gameMusic, {
    loop: true,
    volume: 0.7,
  });

  // Init board
  useEffect(() => {
    startNewGame();

  }, []);

  // Play music only after first click
useEffect(() => {
  const startMusic = () => {
    console.log("Attempting to play music...");
    playGameMusic();
    window.removeEventListener("click", startMusic);
    window.removeEventListener("keydown", startMusic);
  };

  window.addEventListener("click", startMusic);
  window.addEventListener("keydown", startMusic);

  return () => {
    stopGameMusic(); // optional: stops music when component unmounts
    window.removeEventListener("click", startMusic);
    window.removeEventListener("keydown", startMusic);
  };
}, []);


  const startNewGame = () => {
    let newGrid = Array(GRID_SIZE * GRID_SIZE)
      .fill(null)
      .map(() => snacks[Math.floor(Math.random() * snacks.length)]);

    newGrid = ensurePlayableGrid(newGrid); // ✅ Make sure grid is playable

    setGrid(newGrid);
    setMoves(12);
    setPoints(0);
    setChallengeSnack(snacks[Math.floor(Math.random() * snacks.length)]);
    setChallengeTarget(6 + Math.floor(Math.random() * 5));
    setChallengeProgress(0);
    setActivePower(null);
    setPraise("");
    setGameOver(false);
    setPerformance(null);
  };

  // ✅ match check
  useEffect(() => {
    if (grid.length) checkMatches();
  }, [grid]);

  // ✅ Check if the grid has at least one possible move
  const hasPossibleMoves = (g) => {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;

      // Try swapping with right neighbor
      if (col < GRID_SIZE - 1) {
        let testGrid = [...g];
        [testGrid[i], testGrid[i + 1]] = [testGrid[i + 1], testGrid[i]];
        if (checkForMatch(testGrid)) return true;
      }

      // Try swapping with bottom neighbor
      if (row < GRID_SIZE - 1) {
        let testGrid = [...g];
        [testGrid[i], testGrid[i + GRID_SIZE]] = [
          testGrid[i + GRID_SIZE],
          testGrid[i],
        ];
        if (checkForMatch(testGrid)) return true;
      }
    }
    return false;
  };

  // ✅ Reshuffle grid if no possible moves
  const ensurePlayableGrid = (g) => {
    let newGrid = [...g];
    while (!hasPossibleMoves(newGrid)) {
      newGrid = Array(GRID_SIZE * GRID_SIZE)
        .fill(null)
        .map(() => snacks[Math.floor(Math.random() * snacks.length)]);
    }
    // ✅ Tell player that grid was reshuffled
    setPraise("RESHUFFLED!");
    setPraiseType("reshuffle");
    playReshuffle();
    setTimeout(() => {
      setPraise("");
      setPraiseType("");
    }, 1500);
    return newGrid;
  };

  // ✅ End game check
  useEffect(() => {
    if (moves <= 0 || challengeProgress >= challengeTarget) {
      determinePerformance();
      setGameOver(true);
    }
  }, [moves, challengeProgress, challengeTarget]);

  const determinePerformance = () => {
    let result = "bad";

    if (challengeProgress >= challengeTarget) {
      result = "passed";
      playWin();
    } else if (challengeProgress >= challengeTarget * 0.8) {
      result = "almost";
      playLose();
    } else if (points > 300) {
      result = "almost";
      playLose();
    } else if (points > 150) {
      result = "good";
      playLose();
    } else {
      result = "bad";
      playLose();
    }

    setPerformance(result);
    stopGameMusic();

    // ⭐ Save earned stars to localStorage
    const currentStars = parseInt(localStorage.getItem("stars") || "0");
    const newStars = currentStars + points;
    localStorage.setItem("stars", newStars);
  };

  // Swap snacks with revert if no match
  const swapSnacks = (i1, i2) => {
    if (moves <= 0) return;

    // ✅ clone original before swap
    let oldGrid = [...grid];

    // perform swap
    let newGrid = [...grid];
    [newGrid[i1], newGrid[i2]] = [newGrid[i2], newGrid[i1]];
    playSwap();

    setGrid(newGrid);

    // Wait a bit to check if swap created a match
    setTimeout(() => {
      const matched = checkForMatch(newGrid);

      if (matched) {
        setMoves((m) => m - 1); // only consume a move if valid
      } else {
        // ✅ revert back using oldGrid (true original state)
        setGrid(oldGrid);
      }
    }, 150);
  };

  // Helper: quickly check if grid has match
  const checkForMatch = (g) => {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;

      if (col < GRID_SIZE - 2 && g[i] && g[i] === g[i + 1] && g[i] === g[i + 2])
        return true;

      if (
        row < GRID_SIZE - 2 &&
        g[i] &&
        g[i] === g[i + GRID_SIZE] &&
        g[i] === g[i + GRID_SIZE * 2]
      )
        return true;
    }
    return false;
  };

  const checkMatches = () => {
    let newGrid = [...grid];
    let matched = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;

      // Horizontal 3
      if (
        col < GRID_SIZE - 2 &&
        newGrid[i] &&
        newGrid[i] === newGrid[i + 1] &&
        newGrid[i] === newGrid[i + 2]
      ) {
        matched.push(i, i + 1, i + 2);
      }

      // Vertical 3
      if (
        row < GRID_SIZE - 2 &&
        newGrid[i] &&
        newGrid[i] === newGrid[i + GRID_SIZE] &&
        newGrid[i] === newGrid[i + GRID_SIZE * 2]
      ) {
        matched.push(i, i + GRID_SIZE, i + GRID_SIZE * 2);
      }
    }

    if (matched.length > 0) {
      let unique = [...new Set(matched)];
      let snackType = grid[unique[0]];

      unique.forEach((idx) => (newGrid[idx] = null));

      // Praise + sound
      if (unique.length >= 5) {
        playTriple();
        setPraise("TRIPLE CRUSH!!!");
        setPoints((p) => p + 30);
      } else if (unique.length === 4) {
        playDouble();
        setPraise("DOUBLE CRUSH!!!");
        setPoints((p) => p + 20);
      } else {
        playMatch();
        setPraise("Nice!");
        setPoints((p) => p + 10);
      }
      setTimeout(() => setPraise(""), 1500);

      // Challenge progress
      if (snackType === challengeSnack) {
        setChallengeProgress((c) => c + unique.length);
      }

      dropSnacks(newGrid);
    }
  };

  const dropSnacks = (newGrid) => {
    for (let col = 0; col < GRID_SIZE; col++) {
      let empty = [];
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        let idx = row * GRID_SIZE + col;
        if (newGrid[idx] === null) {
          empty.push(idx);
        } else if (empty.length > 0) {
          let target = empty.shift();
          newGrid[target] = newGrid[idx];
          newGrid[idx] = null;
          empty.push(idx);
        }
      }
      empty.forEach(
        (idx) =>
          (newGrid[idx] = snacks[Math.floor(Math.random() * snacks.length)])
      );
    }
    setTimeout(() => setGrid(newGrid), 200);
    setTimeout(() => {
      setGrid((g) => ensurePlayableGrid(g)); // ✅ reshuffle if stuck
    }, 200);
  };

  // ✅ Click-to-swap
  const handleSnackClick = (idx) => {
    if (activePower) {
      handlePowerSnack(idx);
      return;
    }
    if (selected === null) {
      setSelected(idx);
      return;
    }

    const isAdjacent = [
      idx - 1,
      idx + 1,
      idx - GRID_SIZE,
      idx + GRID_SIZE,
    ].includes(selected);

    if (isAdjacent) {
      swapSnacks(selected, idx);
    }
    setSelected(null);
  };

  // ✅ PowerUps
  const handlePowerUp = (type) => {
    setActivePower(type);
  };

  const handlePowerSnack = (idx) => {
    let newGrid = [...grid];
    if (activePower === "Lollipop") {
      newGrid[idx] = null;
      playLollipop();
    } else if (activePower === "Bomb") {
      [idx, idx + 1, idx - 1, idx + GRID_SIZE, idx - GRID_SIZE].forEach((n) => {
        if (newGrid[n] !== undefined) newGrid[n] = null;
      });
      playBomb();
    } else if (activePower === "Shuffle") {
      newGrid = Array(GRID_SIZE * GRID_SIZE)
        .fill(null)
        .map(() => snacks[Math.floor(Math.random() * snacks.length)]);
    }
    setActivePower(null);
    dropSnacks(newGrid);
  };

  if (gameOver) {
    return (
      <GameOver
        points={points}
        challengeSnack={challengeSnack}
        snacksCollected={challengeProgress}
        name={name}
        performance={performance}
        restart={startNewGame}
      />
    );
  }

  return (
    <div className="GamePage">
      <div className="gameCenter">
        <div className="container">
          <p>CHALLENGE:</p>
          <div className="challange-snack">
            <img src={challengeSnack} alt="Challange Snack" />
            <span className="big">{challengeTarget - challengeProgress}</span>
          </div>
        </div>

        <div className="scoreboard">
          <div className="container1">
            <p>MOVES:</p>
            <span>{moves}</span>
          </div>

          <div className="snack-score">
            <img src={challengeSnack} alt="Snack score" />
            <span className="big">{challengeProgress}</span>
          </div>

          <div className="container1">
            <p>POINTS:</p>
            <span>{points}</span>
          </div>
        </div>

        {/* ✅ 4x4 snack grid */}
        <div className="snack-grid">
          {grid.map((snack, i) => (
            <div
              key={i}
              className={`snack ${selected === i ? "selected" : ""}`}
              onClick={() => handleSnackClick(i)}
            >
              {snack && <img src={snack} alt="snack" />}
            </div>
          ))}
        </div>
      </div>

      <div className="right">
        <div className="right-bottom">
          <PowerUp image={Bomb} type="Bomb" onUse={handlePowerUp} />
          <PowerUp image={ShuffleShip} type="Shuffle" onUse={handlePowerUp} />
          <PowerUp image={Lollipop} type="Lollipop" onUse={handlePowerUp} />
        </div>
      </div>

      <div
        className={`praises ${praiseType}`}
        style={{ display: praise ? "block" : "none" }}
      >
        <h1>{praise}</h1>
      </div>
    </div>
  );
};

export default Game;
