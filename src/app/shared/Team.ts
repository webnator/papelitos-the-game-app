
import {Player} from "./Player";
import {config} from "../config";

export class Team {
  private MAX_PLAYERS: number = config.MAX_TEAM_PLAYERS;
  players: Array<Player> = [];
  currentPlayerIndex: number = 0;
  private _totalPoints: number;
  teamComplete: boolean = false;
  private teamName: string;

  constructor(name: string) {
    this.teamName = name;
    this._totalPoints = 0;
  }

  get name() {
    return this.teamName;
  }

  get totalPoints() {
    return this._totalPoints;
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  get guessingPlayers(): Array<Player> {
    let guessingPlayers = this.players.slice();
    guessingPlayers.splice(this.currentPlayerIndex, 1)
    return guessingPlayers;
  }

  addPoint() {
    this._totalPoints++;
  }

  setPlayer(player: Player): boolean {
    if (this.teamComplete) { return false; }
    this.players.push(player);
    player.setTeam();
    this.checkForCompleteness();
    return true;
  }

  removePlayer(): void {
    if (this.players.length > 0) {
      this.players[this.players.length - 1].setTeam(false);
      this.players.pop();
    }
    this.checkForCompleteness();
  }

  nextPlayer(): Player {
    if (this.currentPlayerIndex >= (this.players.length - 1)) {
      this.currentPlayerIndex = 0;
    } else {
      this.currentPlayerIndex++;
    }
    return this.currentPlayer;
  }

  private checkForCompleteness() {
    this.teamComplete = this.players.length >= this.MAX_PLAYERS;
  }

}
