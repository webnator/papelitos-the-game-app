import {Injectable} from '@angular/core';

import {Player} from './Player';
import {Team} from './Team';
import {config} from '../config';
import {SocketService} from '../providers/socket.service';
import {Game} from "./Game";

@Injectable()
export class GameService {
  private game: Game;
  private status: gameStatus;

  constructor(public socketService: SocketService) {}

  public start(): void {
    this.game = new Game();
    this.status = gameStatus.CREATED;
  }

  public getGame(): Game {
    return this.game;
  }

  public startRound() {
    this.game.setRoundWords();
  }

  public isThereANextRound() {
    return !!(this.game.gameRounds[this.game.currentRoundIndex]);
  }

  public getListOfTeamByPoints(): Array<Team> {
    const teamsByPoints = this.game.teams.slice();
    teamsByPoints.sort((teamA, teamB) => {
      if (teamA.totalPoints <= teamB.totalPoints) {
        return 1;
      }
      return -1;
    });
    return teamsByPoints;
  }

  public teamsSet() {
    if (this.game.remoteGame) {
      this.socketService.publish({
        event: 'teamsSet',
        payload: {
          code: this.game.remoteId,
          teams: this.game.teams
        }
      });
    }
  }

  public reset() {
    this.game = new Game();
  }

  public join(gameCode: string, localPlayers: number) {
    this.game = new Game();
    return new Promise((resolve, reject) => {
      this.socketService.connect()
        .then(() => this.socketService.publishAndRegister({
          event: 'joinGame',
          payload: {code: gameCode, players: localPlayers},
          handler: (response) => {
            if (response.error) {
              return reject(this.handleRemoteResponses(response.error));
            }
            this.game.joinedGame = true;
            this.game.totalPlayers = response.data.totalPlayers;
            this.game.players = response.data.players.map(player => new Player(true, player));
            this.game.remoteId = gameCode;
            this.setRemotePlayerListener();
            this.setRemoteTeamListener();
            return resolve(this.handleRemoteResponses(response.result));
          },
        }));
      setTimeout(() => reject(this.handleRemoteResponses('TIMEOUT')), config.CONNECTION_TIMEOUT);
    });
  }

  public setTotalNumPlayers(totalPlayers: number) {
    this.game.totalPlayers = totalPlayers;
    this.status = gameStatus.TOTAL_PLAYERS_SET;
  }

  public setTotalNumLocalPlayers(localPlayers: number) {
    this.game.localPlayers = localPlayers;
    this.setRemoteGame();
    this.status = gameStatus.LOCAL_PLAYERS_SET;
  }

  public setPlayers(players: Array<string>, remote: boolean = false) {
    this.game.players = players.map(player => new Player(remote, player));

    if (this.game.remoteGame && remote === false) {
      this.sendPlayersToServer(players);
    }
    if (this.game.allPlayersSet && this.game.remoteGame) {
      this.socketService.registerListener({
        event: 'wordEntering_response',
        handler: this.handleRemoteWordEnter.bind(this),
      });
    }
  }

  public sendPlayersWords() {
    if (this.game.remoteGame) {
      this.game.players
        .filter(player => !player.isRemote)
        .forEach(player => {
          this.socketService.publish({
            event: 'wordEntering',
            payload: {
              code: this.game.remoteId,
              player: player.name,
              words: player.words
            }
          });
        });
    }
  }

  private sendPlayersToServer(players: Array<string>) {
    this.socketService.publish({
      event: 'playerSet',
      payload: {
        code: this.game.remoteId,
        players
      },
    });
  }

  private setRemoteId(payload: any) {
    this.game.remoteId = payload.gameId;
  }

  private handleRemotePlayer(payload: any) {
    if (this.game.players.length < this.game.totalPlayers) {
      this.setPlayers(payload.players, true);
    } else {
      console.error('Getting players after dark!');
    }
  }

  private handleRemoteTeams(payload: any) {
    payload.teams.forEach(serverTeam => {
      const gameTeam = this.game.teams.find(gameTeam => gameTeam.name === serverTeam.teamName);
      serverTeam.players.forEach(teamPlayer => {
        const gamePlayer = this.game.players.find(gamePlayer => gamePlayer.name === teamPlayer.userName);
        gameTeam.setPlayer(gamePlayer);
      });
    });
  }

  private handleRemoteWordEnter(payload: any) {
    const player = this.game.players.find((player: Player) => player.name === payload.player && player.isRemote === true);
    if (player) {
      if (typeof payload.word === 'string') {
        payload.word = [payload.word];
      }
      payload.word.forEach((word, index) => {
        player.setWord(index, word);
      });
    } else {
      console.error('Player doesnt exist', this.game.players, payload);
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
    if (this.game.remoteGame === true && !this.game.remoteId) {
      this.socketService.connect().then(() => {
        console.log('Connected');

        this.socketService.publishAndRegister({
          event: 'registerNewGame',
          payload: {
            totalPlayers: this.game.totalPlayers,
            localPlayers: this.game.localPlayers,
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
}

enum gameStatus {
  CREATED,
  TOTAL_PLAYERS_SET,
  LOCAL_PLAYERS_SET
}
