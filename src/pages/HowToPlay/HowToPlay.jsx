import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HowToPlay.css";
import Bomb from "/bomb.svg";
import Lollipop from "/lollipop.svg";
import Shuffleship from "/shuffleship.svg";
import Button from "../../components/Buttons/Button";
import clickSound from "/click-sound.wav";

const HowToPlay = () => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOK = () => {
    if (!nickname.trim()) {
      setError("Please enter your nickname");
      return;
    }

    // Play click sound
    const sound = new Audio(clickSound);
    sound.volume = 0.7;
    sound.currentTime = 0;
    sound.play();

    // Save nickname in localStorage
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("gamePoints", 0); // reset points
    localStorage.setItem("bombCount", 0); // powerups
    localStorage.setItem("lollipopCount", 0);
    localStorage.setItem("shuffleShipCount", 0);

    // Navigate to game page
    setTimeout(() => navigate("/game"), 200); // small delay for sound
  };

  return (
    <div className="HowToPlay">
      {error && <p className="error-msg">{error}</p>}

      <div className="heading">
        <h1>How To Play</h1>
        <p className="error-msg">READ THIS BEFORE YOU CONTINUE</p>
      </div>

      <input
        type="text"
        placeholder="Enter Your nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <div className="Instructions">
        <h4>Match Snacks, Beat the Challenge!</h4>
        <li> Match 3 snacks to score 10 points.</li>
        <li>Complete the challenge goal before you run out of moves.</li>
        <li>Make Double Crush (2 matches in a row) or Triple Crush for bonus points!</li>
        <h4>Power-ups:</h4>
        <li>
          <div>
            <img src={Bomb} alt="Bomb powerup" />
            <p>Bomb → clears 4 Snacks.</p>
          </div>
        </li>
        <li>
          <div>
            <img src={Lollipop} alt="Lollipop powerup" />
            <p>Lollipop → clears any 1 snack.</p>
          </div>
        </li>
        <li>
          <div>
            <img src={Shuffleship} alt="ShuffleShip powerup" />
            <p>ShuffleShip → shuffles the whole board</p>
          </div>
        </li>
      </div>

      <Button label="OK" onClick={handleOK} />
    </div>
  );
};

export default HowToPlay;
