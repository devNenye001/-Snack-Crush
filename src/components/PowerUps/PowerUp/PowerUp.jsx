import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import "./PowerUp.css";
import PowerUpCard from "../PowerUpCard/PowerUpCard";

const PowerUp = ({ image, type, onUse }) => {
  const [count, setCount] = useState(1); // First power-up is free
  const [bumping, setBumping] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ownedStars, setOwnedStars] = useState(
    parseInt(localStorage.getItem("stars") || 0)
  );

  const [playPurchase] = useSound("/purchase.mp3");
  const [playFail] = useSound("/fail.mp3");
  const [playPopup] = useSound("/pop-up.mp3");

  // Load saved count
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem(`powerup-${type}`));
    if (!isNaN(savedCount)) {
      setCount(savedCount);
    } else {
      localStorage.setItem(`powerup-${type}`, 1);
    }
  }, [type]);

  // Save count
  useEffect(() => {
    localStorage.setItem(`powerup-${type}`, count);
  }, [count, type]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".powerup-card")) {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  // Use power-up
  const handleUse = () => {
    if (count > 0) {
      setCount((c) => c - 1);
      setBumping(true);
      if (onUse) onUse(type);
      setTimeout(() => setBumping(false), 500);
    } else {
      playPopup();
      setShowPopup(true);
    }
  };

  // Buy power-up
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
    } else {
      playFail();
    }
  };

  // Power-up definitions
  const powerUps = [
    {
      type: "Bomb",
      image: "/bomb.svg",
      price: 100,
      description: "Clears 4 snacks",
    },
    {
      type: "Lollipop",
      image: "/lollipop.svg",
      price: 50,
      description: "Clears one snack",
    },
    {
      type: "Shuffle",
      image: "/shuffleship.svg",
      price: 80,
      description: "Shuffles all snacks",
    },
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
          onBuy={() => handleBuy(currentPowerUp.price)} // ✅ function always passed
          onClose={() => setShowPopup(false)} // ✅ close modal
        />
      )}
    </div>
  );
};

export default PowerUp;
