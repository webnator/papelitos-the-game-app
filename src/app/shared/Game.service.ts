
import {Player} from './Player';
import {Team} from './Team';

export class GameService {
  totalPlayers: number;
  localPlayers: number;
  remoteGame: boolean;
  players: Array<Player>;
  teams: Array<Team>;
  status: gameStatus;

  constructor() {
    this.players = [];
  }

  start() {
    this.status = gameStatus.CREATED
  }

  setPlayers(totalPlayers: number) {
    this.totalPlayers = totalPlayers;
    this.status = gameStatus.TOTAL_PLAYERS_SET;
  }

  setLocalPlayers(localPlayers: number) {
    this.localPlayers = localPlayers;
    this.remoteGame = this.localPlayers !== this.totalPlayers;
    this.setRemoteGame();
    this.status = gameStatus.LOCAL_PLAYERS_SET;
  }

  getPlayers() {
    return this.players;
  }

  private setRemoteGame() {
    if (this.remoteGame === true) {
      // TODO create game in server
    }
  }
}

enum gameStatus {
  CREATED,
  TOTAL_PLAYERS_SET,
  LOCAL_PLAYERS_SET
}
