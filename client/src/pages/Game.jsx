import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "../socket";
import CanvasBoard from "../components/CanvasBoard";
import "./Game.css";

function Game() {
  const { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [drawerId, setDrawerId] = useState(null);
  const [guess, setGuess] = useState("");

  const [timer, setTimer] = useState(60);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on("update_players", (players) => {
      setPlayers(players);
    });

    socket.on("round_start", ({ drawerId, round, totalRounds, time }) => {
      setDrawerId(drawerId);
      setRound(round);
      setTotalRounds(totalRounds);
      setTimer(time);
      setGameOver(false);
    });

    socket.on("timer_update", (time) => {
      setTimer(time);
    });

    socket.on("guess_result", (data) => {
      alert(`${data.playerName} guessed correctly! +${data.points}`);
    });

    socket.on("game_over", ({ winner }) => {
      setGameOver(true);
      alert(`🎉 Game Over!\nWinner: ${winner.name}\nScore: ${winner.score}`);
    });

    return () => {
      socket.off("update_players");
      socket.off("round_start");
      socket.off("timer_update");
      socket.off("guess_result");
      socket.off("game_over");
    };
  }, []);

  const startGame = () => {
    socket.emit("start_game", { roomId });
  };

  const sendGuess = () => {
    if (timer <= 0) return;
    socket.emit("guess", { roomId, text: guess });
    setGuess("");
  };

  const currentDrawer = players.find((p) => p.id === drawerId);

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🎨 Sketch Battle</h2>
        <p>Room Code: {roomId}</p>
      </div>

      <div className="info-bar">
        <span>Round: {round} / {totalRounds}</span>
        <span>Time: {timer}s</span>
        <span>Drawer: {currentDrawer?.name || "Waiting..."}</span>
      </div>

      {!gameOver && (
        <button onClick={startGame}>Start Game</button>
      )}

      <br /><br />

      <CanvasBoard
        roomId={roomId}
        isDrawer={socket.id === drawerId}
      />

      <div style={{ marginTop: "15px" }}>
        <input
          disabled={socket.id === drawerId || timer === 0}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess..."
        />
        <button onClick={sendGuess}>Guess</button>
      </div>

      <div className="leaderboard">
        <h3>🏆 Leaderboard</h3>
        {players.map((p) => (
          <div
            key={p.id}
            className="leaderboard-item"
            style={{
              background:
                p.id === drawerId ? "#dbeafe" : "#f3f4f6"
            }}
          >
            <span>{p.name}</span>
            <span>{p.score}</span>
          </div>
        ))}
      </div>

      {gameOver && (
        <h2 style={{ color: "green", marginTop: "20px" }}>
          🎉 Game Finished!
        </h2>
      )}
    </div>
  );
}

export default Game;