const Game = require("./Game");
const Player = require("./Player");

class Room {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.game = new Game();
  }

  addPlayer(socketId, name) {
    const player = new Player(socketId, name);
    this.players.push(player);
  }

  removePlayer(socketId) {
    this.players = this.players.filter(p => p.id !== socketId);
  }

  getPlayers() {
    return this.players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
    }));
  }

  startGame(io, roomId) {
    this.game.start(this.players, io, roomId);
  }

  handleGuess(socketId, text, io, roomId) {
    this.game.checkGuess(socketId, text, this.players, io, roomId);
  }
}

module.exports = Room;