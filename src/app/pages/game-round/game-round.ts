import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {Team} from "../../shared/Team";
import {config} from "../../config";
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
  private roundFinished: boolean;

  public gameState: GameStates;
  public States = GameStates;
  public TURN_TIME: number = config.TURN_TIME;
  public turnPoints: number = 0;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.game.roundFinished.subscribe(this.gameRoundFinished.bind(this));
    this.teamList = this.game.teams;
  }

  ngAfterViewInit() {
    this.currentTeamIndex = -1;
    this.startNewRound();
  }

  public get currentTeam() {
    return this.teamList[this.currentTeamIndex];
  }

  private startNewRound() {
    if (this.game.isThereANextRound()) {
      this.game.startRound();
      this.roundFinished = false;
      this.gameState = GameStates.ROUND_INFO;
    } else {
      this.navCtrl.push(PagesList.gameFinish)
    }
  }

  public beginPlayerTurns() {
    if (this.roundFinished === true) {
      this.startNewRound();
    } else {
      if (this.currentTeamIndex >= (this.teamList.length - 1)) {
        this.currentTeamIndex = 0;
      } else {
        this.currentTeamIndex++;
      }
      this.gameState = GameStates.PLAYER_CALL;
    }
  }

  public startTurn() {
    this.turnPoints = 0;
    this.gameState = GameStates.PLAYER_TURN;
    this.timerComponent.start();
  }

  private finishTurn() {
    this.orderedTeamList = this.game.getListOfTeamByPoints();
    this.gameState = GameStates.END_TURN;
    this.currentTeam.nextPlayer();
  }

  public wordGuessed() {
    if (this.game.guessWord && this.game.guessWord !== '') {
      this.game.wordGuessed(this.currentTeam, this.game.guessWord);
      this.turnPoints++;
    }
  }

  public handleTimer(timeLeft: number) {
    if (timeLeft === 0) {
      this.finishTurn();
    }
  }

  private gameRoundFinished(hasFinished: boolean) {
    if (hasFinished === true) {
      // Reset user round
      this.timerComponent.stop();
      this.finishTurn();
      this.roundFinished = true;
    }
  }
}

enum GameStates {
  ROUND_INFO,
  PLAYER_CALL,
  PLAYER_TURN,
  END_TURN,
}
