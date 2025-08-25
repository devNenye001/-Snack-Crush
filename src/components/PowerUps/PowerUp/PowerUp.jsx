import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import "./PowerUp.css";
import PowerUpCard from "../PowerUpCard/PowerUpCard";

const PowerUp = ({ image, type, onUse }) => {
  const [count, setCount] = useState(1); // free first
  const [bumping, setBumping] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ownedStars, setOwnedStars] = useState(
    parseInt(localStorage.getItem("stars") || "0")
  );

  const [playPurchase] = useSound("/purchase.mp3");
  const [playFail] = useSound("/fail.mp3");
  const [playPopup] = useSound("/pop-up.mp3");

  // Load saved powerup count
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem(`powerup-${type}`));
    if (!isNaN(savedCount)) {
      setCount(savedCount);
    } else {
      localStorage.setItem(`powerup-${type}`, 1);
      setCount(1);
    }
  }, [type]);

  // Sync stars from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setOwnedStars(parseInt(localStorage.getItem("stars") || "0"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save count when it changes
  useEffect(() => {
    localStorage.setItem(`powerup-${type}`, count);
  }, [count, type]);

  // Use a power-up
  const handleUse = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      localStorage.setItem(`powerup-${type}`, newCount);

      setBumping(true);
      onUse?.(type);
      setTimeout(() => setBumping(false), 500);
    } else {
      playPopup();
      setShowPopup(true);
    }
  };

  // Buy a power-up
  const handleBuy = (price) => {
    if (ownedStars >= price) {
      const newCount = count + 1;
      const newStars = ownedStars - price;

      setCount(newCount);
      setOwnedStars(newStars);

      localStorage.setItem("stars", newStars);
      localStorage.setItem(`powerup-${type}`, newCount);

      playPurchase();
      setShowPopup(false);

      // Manually sync same-tab components
      window.dispatchEvent(new Event("storage"));
    } else {
      playFail();
    }
  };

  // Power-up definitions
  const powerUps = [
    { type: "Bomb", image: "/bomb.svg", price: 100, description: "Clears 4 snacks" },
    { type: "Lollipop", image: "/lollipop.svg", price: 50, description: "Clears one snack" },
    { type: "Shuffle", image: "/shuffleship.svg", price: 80, description: "Shuffles all snacks" },
  ];

  const currentPowerUp = powerUps.find((pu) => pu.type === type);

  return (
    <div className="powerup">
      <img
        src={image}
        alt={type}
        className={`powerup-img ${bumping ? "bump" : ""}`}
        onClick={handleUse}
      />
      <div
        className={`powerup-circle ${count > 0 ? "owned" : "not-owned"}`}
        onClick={() => {
          playPopup();
          setShowPopup(true);
        }}
      >
        {count > 0 ? count : "+"}
      </div>

      {showPopup && currentPowerUp && (
        <PowerUpCard
          image={currentPowerUp.image}
          title={currentPowerUp.type}
          description={currentPowerUp.description}
          price={currentPowerUp.price}
          ownedStars={ownedStars}
          canAfford={ownedStars >= currentPowerUp.price}
          onBuy={() => handleBuy(currentPowerUp.price)}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default PowerUp;
