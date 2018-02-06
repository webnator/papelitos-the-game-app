import {EventEmitter} from '@angular/core';

import {Player} from './Player';
import {Team} from './Team';
import {config} from '../config';
import {shuffleArray} from './commons';

export class Game {
  private _gameRounds: Array<object> = config.GAME_ROUNDS;
  private _currentRoundIndex: number = 0;
  private _roundWords: Array<string> = [];
  private _remoteGameId: string;
  private _joinedGame: boolean;

  private _totalPlayers: number;
  private _localPlayers: number;
  private _remoteGame: boolean;
  private _gamePlayers: Array<Player>;
  private _gameTeams: Array<Team> = [];

  public roundFinished = new EventEmitter<boolean>();

  constructor() {}

  public get round() { return this._gameRounds[this._currentRoundIndex];}
  public get players() { return this._gamePlayers;}
  public get totalPlayers() { return this._totalPlayers;}
  public get localPlayers() { return this._localPlayers;}
  public get teams() { return this._gameTeams;}
  public get guessWord() { return this._roundWords[0];}
  public get roundWords() { return this._roundWords;}
  public get allPlayersSet() { return this._gamePlayers.length === this.totalPlayers;}
  public get isReady(): boolean { return (this._remoteGame === false) || (this._remoteGame === true && this._remoteGameId !== undefined);}
  public get remoteId(): string { return this._remoteGameId;}
  public get joinedGame(): boolean { return this._joinedGame;}
  public get gameRounds(): Array<object> { return this._gameRounds; }
  public get currentRoundIndex(): number { return this._currentRoundIndex; }
  public get remoteGame(): boolean { return this._remoteGame; }

  public set joinedGame(isJoined) {
    this._joinedGame = isJoined;
  }

  public set remoteId(remoteId){
    this._remoteGameId = remoteId;
  }

  public set totalPlayers(totalPlayers: number) {
    this._gamePlayers = [];
    this._totalPlayers = totalPlayers;
  }

  public set localPlayers(localPlayers: number) {
    this._localPlayers = localPlayers;
    this._remoteGame = this._localPlayers !== this._totalPlayers;
  }

  public set players(players: Array<Player>) {
    for (let player of players) {
      this._gamePlayers.push(player);
    }
    if (this.allPlayersSet) {
      console.log('All players entered, setting teams');
      this.setTeams();
    }
  }

  public setRoundWords() {
    this._roundWords = [];
    this.players.forEach(player => {
      player.words.forEach(word => {
        this._roundWords.push(word);
      });
    });
    this._roundWords = shuffleArray(this._roundWords);
  }

  public wordGuessed(team: Team, word: string) {
    team.addPoint();
    this._roundWords.splice(this._roundWords.findIndex(_word => _word === word), 1);
    if (this._roundWords.length <= 0) {
      this.finishRound();
    }
  }

  private finishRound() {
    this.roundFinished.emit(true);
    this._currentRoundIndex++;
  }

  private setTeams() {
    for (let i = 0; i < this._gamePlayers.length / 2; i++) {
      this._gameTeams.push(new Team((i + 1).toString()));
    }
  }

}
