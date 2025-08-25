import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../../components/Buttons/Button';
import './Home.css';
import BurgerGamesLogo from '/burgerGames.svg';
import GameLogo from '/gameLogo.svg';
import Intro from '/BurgerGamesIntro.svg';
import clickSound from '/click-sound.wav';

const Home = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowHome(true);
      }, 1000); // Wait for fade-out to finish
    }, 1000); // Optional delay before starting fade

    return () => clearTimeout(timer);
  }, []);

  const handlePlay = () => {
    const sound = new Audio(clickSound);
    sound.volume = 0.7;
    sound.currentTime = 0;
    sound.play().catch(err => console.log("Audio error:", err));

    setTimeout(() => {
      navigate("/howtoplay");
    }, 200);
  };

  return (
    <>
      <div className={`BurgerGamesIntro ${fadeOut ? 'fade-out' : ''}`}>
        <img src={Intro} alt="Burger Games Intro" />
      </div>

      {showHome && (
        <div className="HomePage show">
          <img src={BurgerGamesLogo} alt="Burger Games logo" />
          <img src={GameLogo} className='GameLogo' alt="Snack Crush" />
          <Button label="PLAY" onClick={handlePlay} />
        </div>
      )}
    </>
  );
};

export default Home;