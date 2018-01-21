import {EventEmitter, Injectable} from '@angular/core';

import {Player} from './Player';
import {Team} from './Team';
import {config} from '../config';
import {shuffleArray} from './commons';
import {SocketService} from '../providers/socket.service';

@Injectable()
export class GameService {
  private gameRounds: Array<object> = config.GAME_ROUNDS;
  private currentRoundIndex: number = 0;
  private _roundWords: Array<string> = [];
  private _remoteGameId: string;

  public roundFinished = new EventEmitter<boolean>();

  totalPlayers: number;
  localPlayers: number;
  remoteGame: boolean;
  gamePlayers: Array<Player>;
  gameTeams: Array<Team> = [];
  status: gameStatus;

  // private socketService: SocketService;
  constructor(public socketService: SocketService) {}

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

  get allPlayersSet() {
    return this.gamePlayers.length === this.totalPlayers;
  }

  /**
   * Game is ready if it's a local game, or if it's a remote game and the id has been set
   * @returns {boolean}
   */
  get isReady(): boolean {
    return (this.remoteGame === false) || (this.remoteGame === true && this._remoteGameId !== undefined);
  }

  get remoteId(): string {
    return this._remoteGameId;
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
    this.status = gameStatus.CREATED;
  }

  setTotalNumPlayers(totalPlayers: number) {
    this.gamePlayers = [];
    this.totalPlayers = totalPlayers;
    this.status = gameStatus.TOTAL_PLAYERS_SET;
  }

  setTotalNumLocalPlayers(localPlayers: number) {
    this.localPlayers = localPlayers;
    this.remoteGame = this.localPlayers !== this.totalPlayers;
    this.setRemoteGame();
    this.status = gameStatus.LOCAL_PLAYERS_SET;
  }

  setPlayers(players: Array<string>, remote: boolean = false) {
    for (let player of players) {
      this.gamePlayers.push(new Player(remote, player));
    }
    if (this.allPlayersSet) {
      console.log('All players entered, setting teams');
      this.setTeams();
    }
  }

  private setTeams() {
    for (let i = 0; i < this.gamePlayers.length / 2; i++) {
      this.gameTeams.push(new Team((i + 1).toString()));
    }
    if (this.remoteGame) {
      this.socketService.registerListener({
        event: 'wordEntering',
        handler: this.handleRemoteWordEnter.bind(this)
      });
    }
  }

  private setRemoteId(payload: any) {
    this._remoteGameId = payload.gameId;
  }

  private handleRemotePlayer(payload: any) {
    if (this.players.length < this.totalPlayers) {
      this.setPlayers(payload.players, true);
    } else {
      // TODO Remove debug log
      console.error('Getting players after dark!');
    }
  }

  private handleRemoteWordEnter(payload: any) {
    const player = this.players.find((player: Player) => player.name === payload.player && player.isRemote === true);
    if (player) {
      if (typeof payload.word === 'string') {
        payload.word = [payload.word]
      }
      for (let word of payload.word) {
        player.setWord(null, word);
      }
    } else {
      console.error('Player doesnt exist');
    }
  }

  private setRemoteGame() {
    if (this.remoteGame === true) {
      this.socketService.connect().then(res => {
        console.log('Connected');

        this.socketService.publishAndRegister({
          event: 'registerNewGame',
          payload: {
            totalPlayers: this.totalPlayers,
            localPlayers: this.localPlayers,
          },
          handler: this.setRemoteId.bind(this)
        });

        this.socketService.registerListener({event: 'playerSet', handler: this.handleRemotePlayer.bind(this)});
      }).catch(err => {
        console.log('Not connected', err);
      });
    }
  }

  private setRoundWords() {
    this._roundWords = [];
    this.players.forEach(player => {
      player.words.forEach(word => {
        this._roundWords.push(word);
      });
    });
    this._roundWords = shuffleArray(this._roundWords);
  }
}

enum gameStatus {
  CREATED,
  TOTAL_PLAYERS_SET,
  LOCAL_PLAYERS_SET
}
