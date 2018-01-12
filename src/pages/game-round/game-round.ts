import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';
import {PagesList} from "../pages.factory";
import {Team} from "../../app/shared/Team";
import {config} from "../../app/shared/config";
import {TimerComponent} from "../../components/timer/timer";

@IonicPage()
@Component({
  selector: 'page-game-round',
  templateUrl: 'game-round.html',
})

export class GameRoundPage implements AfterViewInit {

  @ViewChild(TimerComponent)
  private timerComponent: TimerComponent;

  private teamList: Array<Team>;
  public orderedTeamList: Array<Team>;
  private currentTeamIndex: number;

  public gameState: GameStates;
  public States = GameStates;
  public TURN_TIME: number = config.TURN_TIME;
  public turnPoints: number = 0;

  constructor(public navCtrl: NavController, public game: GameService) {

    // TESTING Initialization
    // this.game.start();
    // this.game.setTotalNumPlayers(8);
    // this.game.setTotalNumLocalPlayers(8);
    // this.game.setLocalPlayers(['Williams', 'Leonel', 'Gabriela', 'Fatima', 'Alejandra', 'Hebert', 'Miguel', 'Somaro']);
    // this.game.players.forEach(player => {
    //   this.game.teams.find(team => team.teamComplete === false).setPlayer(player);
    //   player.setWord(0, player.alias + '-ABC');
    //   player.setWord(1, player.alias + '-CDE');
    //   player.setWord(2, player.alias + '-XYZ');
    // });
    // END TEST

    this.game.roundFinished.subscribe(this.gameRoundFinished.bind(this));
    this.teamList = this.game.teams;

  }

  ngAfterViewInit() {
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
    if (typeof this.currentTeamIndex === 'undefined') {
      this.currentTeamIndex = 0;
    } else {
      if (this.currentTeamIndex >= (this.teamList.length - 1)) {
        this.currentTeamIndex = 0;
      } else {
        this.currentTeamIndex++;
      }
    }
    this.gameState = GameStates.PLAYER_CALL;
  }

  public startTurn() {
    this.turnPoints = 0;
    this.gameState = GameStates.PLAYER_TURN;
    this.timerComponent.start();
  }

  public handleTimer(timeLeft: number) {
    if (timeLeft === 0) {
      this.finishPlayerTurn();
    }
  }

  private finishPlayerTurn() {
    this.orderedTeamList = this.game.getListOfTeamByPoints();
    this.gameState = GameStates.END_TURN;
    this.currentTeam.nextPlayer();
  }

  private startNewRound() {
    const roundStarted = this.game.startRound();
    console.log('round', roundStarted);
    if (roundStarted) {
      this.gameState = GameStates.ROUND_INFO;
    } else {
      console.log('Moving forward!');
      this.navCtrl.push(PagesList.gameFinish)
    }
  }

  private gameRoundFinished(hasFinished: boolean) {
    if (hasFinished === true) {
      // Reset user round
      this.timerComponent.stop();
      this.finishPlayerTurn();
      this.startNewRound();
    }
  }
}

enum GameStates {
  ROUND_INFO,
  PLAYER_CALL,
  PLAYER_TURN,
  END_TURN,
}
