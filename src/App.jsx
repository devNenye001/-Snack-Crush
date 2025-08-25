import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import HowToPlay from './pages/HowToPlay/HowToPlay';
import Game from './pages/Game/Game';
import GameOver from './pages/GameOver/GameOver';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/howtoplay" element={<HowToPlay />} />
        <Route path="/game" element={<Game />} />
        <Route path="/gameover" element={<GameOver />} />
      </Routes>
    </Router>
  )
}

export default App;
