import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';
import {PagesList} from "../pages.factory";
import {Team} from "../../app/shared/Team";
import {config} from "../../app/shared/config";

@IonicPage()
@Component({
  selector: 'page-game-round',
  templateUrl: 'game-round.html',
})

export class GameRoundPage {
  private teamList: Array<Team>;
  private currentTeamIndex: number = 0;

  public gameState: GameStates;
  public States = GameStates;
  public TURN_TIME: number = config.TURN_TIME;
  public turnPoints: number = 0;

  constructor(public navCtrl: NavController, public game: GameService) {

    // TESTING Initialization
    this.game.start();
    this.game.setTotalNumPlayers(8);
    this.game.setTotalNumLocalPlayers(8);
    this.game.setLocalPlayers(['Williams', 'Leonel', 'Gabriela', 'Fatima', 'Alejandra', 'Hebert', 'Miguel', 'Somaro']);
    this.game.players.forEach(player => {
      this.game.teams.find(team => team.teamComplete === false).setPlayer(player);
      player.setWord(0, player.alias + '-ABC');
      player.setWord(1, player.alias + '-CDE');
      player.setWord(2, player.alias + '-XYZ');
    });
    // END TEST

    this.game.roundFinished.subscribe(this.gameRoundFinished);
    this.teamList = this.game.teams;
    this.startNewRound();

  }

  public get currentTeam() {
    return this.teamList[this.currentTeamIndex];
  }

  public wordGuessed() {
    if (this.game.guessWord && this.game.guessWord !== '') {
      this.game.wordGuessed(this.currentTeam, this.game.guessWord);
      this.turnPoints++;
    }
  }

  public startRound() {
    this.gameState = GameStates.PLAYER_CALL;
  }

  public startTurn() {
    this.turnPoints = 0;
    this.gameState = GameStates.PLAYER_TURN;
  }

  public confirmScreen(): void {

  }

  private startNewRound() {
    const roundStarted = this.game.startRound();
    if (roundStarted) {
      this.gameState = GameStates.ROUND_INFO;
    } else {
      console.log('Game ended!!!', 'next screen?');
      this.navCtrl.push(PagesList.gameRound)
    }
  }

  private gameRoundFinished(hasFinished: boolean) {
    if (hasFinished === true) {
      // Reset user round
      this.gameState = GameStates.END_TURN;
    }
  }
}

enum GameStates {
  ROUND_INFO,
  PLAYER_CALL,
  PLAYER_TURN,
  END_TURN,
}
