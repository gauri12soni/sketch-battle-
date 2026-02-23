import { useState, useEffect } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("create_room", {
      hostName: name,
      settings: {
        rounds: 3,
        drawTime: 60,
        maxPlayers: 8,
      },
    });
  };

  const joinRoom = () => {
    socket.emit("join_room", { roomId, playerName: name });
    navigate(`/game/${roomId}`);
  };

  useEffect(() => {
    socket.on("room_created", ({ roomId }) => {
      navigate(`/game/${roomId}`);
    });
  }, []);

  return (
    <div className="lobby">
      <h1>Sketch Battle</h1>

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={createRoom}>Create Room</button>

      <input
        placeholder="Room Code"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default Lobby;