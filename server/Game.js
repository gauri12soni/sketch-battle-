const words = require("./words");

class Game {
  constructor() {
    this.currentWord = null;
    this.currentDrawerIndex = 0;
    this.round = 1;
    this.maxRounds = 3;
    this.timerInterval = null;
    this.roundActive = false;
  }

  start(players, io, roomId) {
    if (players.length < 2) return;

    // Clear previous timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.currentWord = this.getRandomWord();
    this.roundActive = true;

    const drawer = players[this.currentDrawerIndex];

    // 🔥 Clear canvas for everyone before new round
    io.to(roomId).emit("clear_canvas");

    io.to(roomId).emit("update_players", players);

    io.to(roomId).emit("round_start", {
      drawerId: drawer.id,
      round: this.round,
      totalRounds: this.maxRounds,
      time: 60,
    });

    console.log("WORD:", this.currentWord);

    this.startTimer(players, io, roomId);
  }

  startTimer(players, io, roomId) {
    let timeLeft = 60;

    this.timerInterval = setInterval(() => {
      timeLeft--;

      io.to(roomId).emit("timer_update", timeLeft);

      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.roundActive = false;

        this.nextTurn(players, io, roomId);
      }
    }, 1000);
  }

  checkGuess(socketId, text, players, io, roomId) {
    if (!this.roundActive) return;

    if (text.trim().toLowerCase() === this.currentWord.toLowerCase()) {
      const player = players.find(p => p.id === socketId);
      if (!player) return;

      player.score += 10;

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      this.roundActive = false;

      io.to(roomId).emit("update_players", players);
      io.to(roomId).emit("guess_result", {
        playerName: player.name,
        points: 10,
      });

      setTimeout(() => {
        this.nextTurn(players, io, roomId);
      }, 2000);
    }
  }

  nextTurn(players, io, roomId) {
    this.currentDrawerIndex =
      (this.currentDrawerIndex + 1) % players.length;

    if (this.currentDrawerIndex === 0) {
      this.round++;
    }

    if (this.round > this.maxRounds) {
      this.endGame(players, io, roomId);
      return;
    }

    this.start(players, io, roomId);
  }

  endGame(players, io, roomId) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.roundActive = false;

    const sorted = [...players].sort((a, b) => b.score - a.score);
    const winner = sorted[0];

    io.to(roomId).emit("clear_canvas"); // 🔥 clear at end also

    io.to(roomId).emit("game_over", {
      winner: {
        id: winner.id,
        name: winner.name,
        score: winner.score,
      },
    });

    this.round = 1;
    this.currentDrawerIndex = 0;
  }

  getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }
}

module.exports = Game;