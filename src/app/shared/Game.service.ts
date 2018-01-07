
export class GameService {
  players: Array<any>;
  id: Number;

  constructor() {
    this.players = [];
    console.log('Hey!');
  }

  start(id: Number) {
    console.log('Game started');
    this.id = id;
  }

  getPlayers() {
    return this.players;
  }



}
