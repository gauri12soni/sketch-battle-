import { io } from "socket.io-client";

const socket = io("https://sketch-battle-backend.onrender.com");

export default socket;