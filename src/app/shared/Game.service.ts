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
  private _joinedGame: boolean;

  public roundFinished = new EventEmitter<boolean>();

  totalPlayers: number;
  localPlayers: number;
  remoteGame: boolean;
  gamePlayers: Array<Player>;
  gameTeams: Array<Team> = [];
  status: gameStatus;

  // private socketService: SocketService;
  constructor(public socketService: SocketService) {
  }

  public get round() { return this.gameRounds[this.currentRoundIndex];}
  public get players() { return this.gamePlayers;}
  public get teams() { return this.gameTeams;}
  public get guessWord() { return this._roundWords[0];}
  public get roundWords() { return this._roundWords;}
  public get allPlayersSet() { return this.gamePlayers.length === this.totalPlayers;}
  public get isReady(): boolean { return (this.remoteGame === false) || (this.remoteGame === true && this._remoteGameId !== undefined);}
  public get remoteId(): string { return this._remoteGameId;}
  public get joinedGame(): boolean { return this._joinedGame;}

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

  public teamsSet() {
    if (this.remoteGame) {
      this.socketService.publish({
        event: 'teamsSet',
        payload: {
          code: this._remoteGameId,
          teams: this.teams
        }
      });
    }
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

  public start() {
    this.status = gameStatus.CREATED;
  }

  public join(gameCode: string, localPlayers: number) {
    return new Promise((resolve, reject) => {
      this.socketService.connect()
        .then(() => this.socketService.publishAndRegister({
          event: 'joinGame',
          payload: {code: gameCode, players: localPlayers},
          handler: (response) => {
            if (response.error) {
              return reject(this.handleRemoteResponses(response.error));
            }
            this._joinedGame = true;
            this.setTotalNumPlayers(response.data.totalPlayers);
            this.setPlayers(response.data.players, true);
            this.setRemotePlayerListener();
            this.setRemoteTeamListener();
            this._remoteGameId = gameCode;
            return resolve(this.handleRemoteResponses(response.result));
          },
        }));
      setTimeout(() => reject(this.handleRemoteResponses('TIMEOUT')), config.CONNECTION_TIMEOUT);
    });
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
    if (this.remoteGame && remote === false) {
      this.sendPlayersToServer(players);
    }
    if (this.allPlayersSet) {
      console.log('All players entered, setting teams');
      this.setTeams();
    }
  }

  public sendPlayersWords() {
    this.gamePlayers
      .filter(player => !player.isRemote)
      .forEach(player => {
        this.socketService.publish({
          event: 'wordEntering',
          payload: {
            code: this._remoteGameId,
            player: player.name,
            words: player.words
          }
        });
      });
  }

  private sendPlayersToServer(players: Array<string>) {
    this.socketService.publish({
      event: 'playerSet',
      payload: {
        code: this._remoteGameId,
        players
      },
    });
  }

  private setTeams() {
    for (let i = 0; i < this.gamePlayers.length / 2; i++) {
      this.gameTeams.push(new Team((i + 1).toString()));
    }
    if (this.remoteGame) {
      this.socketService.registerListener({
        event: 'wordEntering_response',
        handler: this.handleRemoteWordEnter.bind(this),
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
      console.error('Getting players after dark!');
    }
  }

  private handleRemoteTeams(payload: any) {
    payload.teams.forEach(serverTeam => {
      const gameTeam = this.gameTeams.find(gameTeam => gameTeam.name === serverTeam.teamName);
      serverTeam.players.forEach(teamPlayer => {
        const gamePlayer = this.gamePlayers.find(gamePlayer => gamePlayer.name === teamPlayer.userName);
        gameTeam.setPlayer(gamePlayer);
      });

    });
  }

  private handleRemoteWordEnter(payload: any) {
    const player = this.players.find((player: Player) => player.name === payload.player && player.isRemote === true);
    if (player) {
      if (typeof payload.word === 'string') {
        payload.word = [payload.word];
      }
      payload.word.forEach((word, index) => {
        player.setWord(index, word);
      });
    } else {
      console.error('Player doesnt exist', this.players, payload);
    }
  }

  private handleRemoteResponses(response) {
    switch (response) {
      case 'GAME_NOT_FOUND':
        return 'EL código de juego proporcionado no existe';
      case 'GAME_FULL':
        return 'El juego ya no acepta mas jugadores. Intenta con menos';
      case 'JOIN_GAME_ALL_GOOD':
        return 'Todo correcto';
      case 'TIMEOUT':
        return 'Ha ocurrido un error conectando con el servidor. Por favor verifica tu conexión a internet';
      default:
        return 'Ha ocurrido algo extraño';
    }
  }

  private setRemoteGame() {
    if (this.remoteGame === true && !this._remoteGameId) {
      this.socketService.connect().then(res => {
        console.log('Connected');

        this.socketService.publishAndRegister({
          event: 'registerNewGame',
          payload: {
            totalPlayers: this.totalPlayers,
            localPlayers: this.localPlayers,
          },
          handler: this.setRemoteId.bind(this),
        });
        this.setRemotePlayerListener();
      }).catch(err => {
        console.log('Not connected', err);
      });
    }
  }

  private setRemotePlayerListener() {
    this.socketService.registerListener({event: 'playerSet_response', handler: this.handleRemotePlayer.bind(this)});
  }
  private setRemoteTeamListener() {
    this.socketService.registerListener({event: 'teamsSet_response', handler: this.handleRemoteTeams.bind(this)});
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
