
import {EventEmitter, Injectable} from "@angular/core";

import {Player} from './Player';
import {Team} from './Team';
import {config} from "./config";
import {shuffleArray} from "./commons";
import {SocketService} from "./socket.service";

@Injectable()
export class GameService {
  private gameRounds: Array<object> = config.GAME_ROUNDS;
  private currentRoundIndex: number = 0;
  private _roundWords: Array<string> = [];

  public roundFinished = new EventEmitter<boolean>();

  totalPlayers: number;
  localPlayers: number;
  remoteGame: boolean;
  gamePlayers: Array<Player>;
  gameTeams: Array<Team> = [];
  status: gameStatus;

  // private socketService: SocketService;
  constructor(public socketService: SocketService) {
    this.gamePlayers = [];

    this.socketService.connect().then(res => {
      console.log('Connected');
      this.socketService.publish({event: 'registerNewGame', payload: 'walla'});
    }).catch(err => {
      console.log('Not connected', err);
    })

  }

  public get round() {
    return this.gameRounds[this.currentRoundIndex];
  }

  get players() {
    return this.gamePlayers;
  }

  get teams() {
    return this.gameTeams;
  }

  get guessWord() {
    return this._roundWords[0];
  }

  get roundWords() {
    return this._roundWords;
  }

  public startRound() {
    this.setRoundWords();
  }

  public isThereANextRound() {
    return !!(this.gameRounds[this.currentRoundIndex]);
  }

  public getListOfTeamByPoints(): Array<Team> {
    const teamsByPoints = this.teams.slice();
    teamsByPoints.sort((teamA, teamB) => {
      if (teamA.totalPoints <= teamB.totalPoints) {
        return 1;
      }
      return -1;
    });
    return teamsByPoints;
  }

  private finishRound() {
    this.roundFinished.emit(true);
    this.currentRoundIndex++;
  }

  public wordGuessed(team: Team, word: string) {
    team.addPoint();
    this._roundWords.splice(this._roundWords.findIndex(_word => _word === word), 1);
    if (this._roundWords.length <= 0) {
      this.finishRound();
    }
  }

  public reset() {
    this.currentRoundIndex = 0;
    this._roundWords = [];
    this.gamePlayers = [];
    this.gameTeams = [];
    this.totalPlayers = undefined;
    this.localPlayers = undefined;
    this.remoteGame = undefined;
  }

  start() {
    this.status = gameStatus.CREATED
  }

  setTotalNumPlayers(totalPlayers: number) {
    this.totalPlayers = totalPlayers;
    this.status = gameStatus.TOTAL_PLAYERS_SET;
  }

  setTotalNumLocalPlayers(localPlayers: number) {
    this.localPlayers = localPlayers;
    this.remoteGame = this.localPlayers !== this.totalPlayers;
    this.setRemoteGame();
    this.status = gameStatus.LOCAL_PLAYERS_SET;
  }

  setLocalPlayers(players: Array<string>) {
    if(players.length !== this.localPlayers) { throw 'All local players need to be set' }
    for (let player of players) {
      this.gamePlayers.push(new Player(player));
    }
    this.setTeams();
  }

  private setTeams() {
    for (let i = 0; i < this.gamePlayers.length / 2; i++) {
      this.gameTeams.push(new Team((i + 1).toString()));
    }
  }

  private setRemoteGame() {
    if (this.remoteGame === true) {
      // this.socketService.connect();
      // TODO create game in server
    }
  }

  private setRoundWords() {
    this._roundWords = [];
    this.players.forEach(player => {
      player.words.forEach(word => {
        this._roundWords.push(word);
      })
    });
    this._roundWords = shuffleArray(this._roundWords);
  }
}

enum gameStatus {
  CREATED,
  TOTAL_PLAYERS_SET,
  LOCAL_PLAYERS_SET
}
