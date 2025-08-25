import React, { useEffect, useState } from "react";
import Button from "../../Buttons/Button";
import "./PowerUpCard.css";
import purchaseSound from "/purchase.mp3";
import failSound from "/fail.mp3";

const PowerUpCard = ({ title, description, image, price, onBought, onClose }) => {
  const [balance, setBalance] = useState(() =>
    parseInt(localStorage.getItem("stars") || "0")
  );

  useEffect(() => {
    const ls = parseInt(localStorage.getItem("stars") || "0");
    if (!isNaN(ls)) setBalance(ls);
  }, []);

  const canAfford = balance >= price;

  const playSound = (src, vol = 0.8) => {
    const audio = new Audio(src);
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const handleBuy = () => {
    if (balance >= price) {
      const newBal = balance - price;
      localStorage.setItem("stars", newBal);
      setBalance(newBal);
      playSound(purchaseSound);
      onBought?.(newBal); // notify parent
      onClose?.(); // close modal
    } else {
      playSound(failSound);
    }
  };

  const handleOverlayClick = () => onClose?.();
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="powerup-card-overlay" onClick={handleOverlayClick}>
      <div className="powerup-card" onClick={stopPropagation}>
        {/* <button className="powerup-close" onClick={onClose}>×</button> */}

        {/* Current balance */}
        <div className="stars-owned">
          <img src="/star.svg" alt="star" />
          <span>{balance}</span>
        </div>

        <img src={image} alt={title} className="powerup-image" />

        <div className="powerup-content">
          <h2>{title}</h2>
          <p>{description}</p>

          <div className="powerup-price">
            <img src="/star.svg" alt="star" />
            <span>{price}</span>
          </div>

          {!canAfford ? (
            <p className="purchase-msg Not-Enough">Not Enough Stars</p>
          ) : (
            <p className="purchase-msg success">Tap BUY to purchase</p>
          )}

          <Button label="BUY" disabled={!canAfford} onClick={handleBuy} />
        </div>
      </div>
    </div>
  );
};

export default PowerUpCard;
