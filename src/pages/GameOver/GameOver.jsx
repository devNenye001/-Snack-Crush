import Button from "../../components/Buttons/Button";
import "./GameOver.css";
import Star from "/star.svg";

const GameOver = ({ challengeSnack, name, snacksCollected, points, performance, restart }) => {
  // Render crowns
  const renderCrowns = () => {
    switch (performance) {
      case "good":
        return (
          <>
            <img src="/gold-crown.svg" alt="Gold Crown" />
            <img src="/grey-crown.svg" alt="Grey Crown" />
            <img src="/grey-crown.svg" alt="Grey Crown" />
          </>
        );
      case "almost":
        return (
          <>
            <img src="/gold-crown.svg" alt="Gold Crown" />
            <img src="/gold-crown.svg" alt="Gold Crown" />
            <img src="/grey-crown.svg" alt="Grey Crown" />
          </>
        );
      case "passed":
        return (
          <>
            <img src="/gold-crown.svg" alt="Gold Crown" />
            <img src="/gold-crown.svg" alt="Gold Crown" />
            <img src="/gold-crown.svg" alt="Gold Crown" />
          </>
        );
      case "bad":
      default:
        return (
          <>
            <img src="/grey-crown.svg" alt="Grey Crown" />
            <img src="/grey-crown.svg" alt="Grey Crown" />
            <img src="/grey-crown.svg" alt="Grey Crown" />
          </>
        );
    }
  };

  // Render comment
  const renderComment = () => {
    switch (performance) {
      case "good":
        return `Nice try, ${name}! You were close.`;
      case "almost":
        return `So close, ${name}! Just a little more next time.`;
      case "passed":
        return `Congratulations ${name}! You crushed it 🎉`;
      case "bad":
      default:
        return `You can do better, ${name}.`;
    }
  };

  return (
    <div className="gameoverpage">
      <div className="GameOverdiv">
        <h1>GAME OVER</h1>

        <div className="crowns">{renderCrowns()}</div>

        <div className="scores">
          {/* Challenge score */}
          <div className="snack-score">
            <img src={challengeSnack} alt="Challenge snack" />
            <span>{snacksCollected}</span>
          </div>
          <div className="points-score">
            <img src={Star} alt="Star" />
            <span>{points}</span>
          </div>
        </div>

        <p className="comment">{renderComment()}</p>
        <Button label="PLAY AGAIN" onClick={restart} />
      </div>
    </div>
  );
};

export default GameOver;
