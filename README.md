🎨 Sketch Battle – Multiplayer Drawing Game

Sketch Battle is a real-time multiplayer drawing and guessing game built using React, Node.js, Express, and Socket.IO.

Players join a room, take turns drawing a word, and other players try to guess it within 60 seconds. After 3 rounds, the player with the highest score wins.

🚀 Features

Create and join game rooms

Real-time drawing using Socket.IO

60-second timer per round

Automatic drawer rotation

Score tracking system

Winner announcement after 3 rounds

Canvas clears after each round

🛠 Technologies Used
Frontend

React (Vite)

Socket.IO Client

CSS

Backend

Node.js

Express

Socket.IO

📂 Project Structure
sketch-battle/
│
├── server/
│   ├── server.js        # Main backend entry file
│   ├── Room.js          # Room management logic
│   ├── Game.js          # Game logic (rounds, timer, scoring)
│   ├── Player.js        # Player model
│   ├── words.js         # Word list for drawing
│   └── utils.js         # Utility/helper functions
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Lobby.jsx
│   │   │   ├── Game.jsx
│   │   ├── components/
│   │   │   ├── CanvasBoard.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Leaderboard.jsx
│   │   └── socket.js
│
└── README.md

🎮 How the Game Works

One player creates a room.

Other players join using the room code.

The game starts.

One player draws a word.

Other players guess within 60 seconds.

Correct guess gives 10 points.

After 3 rounds, the player with the highest score wins.

⚙️ How to Run the Project
1️⃣ Run Backend
cd server
npm install
node server.js

Backend runs on:
http://localhost:5000

2️⃣ Run Frontend
cd client
npm install
npm run dev

Frontend runs on:
http://localhost:5173

🧪 Testing

Open two browser windows.

Create a room in one window.

Join the same room in the second window.

Start the game and play.

👩‍💻 Author

Gauri Soni
Software Developer Intern