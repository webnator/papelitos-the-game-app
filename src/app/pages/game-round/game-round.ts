import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {Team} from "../../shared/Team";
import {config} from "../../config";
import {TimerComponent} from "../../components/timer/timer";
import {SocketService} from "../../providers/socket.service";

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

  constructor(public navCtrl: NavController, public game: GameService, public socketService: SocketService) {
    this.game.roundFinished.subscribe(this.gameRoundFinished.bind(this));
    this.teamList = this.game.teams;
    this.socketService.registerListener({ event: 'beginPlayerTurns_response', handler: this.handleRemotebeginPlayerTurns.bind(this) });
    this.socketService.registerListener({ event: 'startTurn_response', handler: this.startTurn.bind(this) });
    //this.socketService.registerListener({ event: 'finishTurn_response', handler: this.finishTurn.bind(this) });
    this.socketService.registerListener({ event: 'wordGuessed_response', handler: this.wordGuessed.bind(this) });
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

  private handleRemotebeginPlayerTurns() {
    this.beginPlayerTurns({remote: true});
  }

  public beginPlayerTurns({ remote = false } = {}) {
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
    if (this.game.remoteGame && !remote) {
      this.socketService.publish({event: 'beginPlayerTurns', payload: {code: this.game.remoteId}});
    }
  }

  public startTurn() {
    this.turnPoints = 0;
    this.gameState = GameStates.PLAYER_TURN;
    if (this.game.remoteGame && !this.currentTeam.currentPlayer.isRemote) {
      this.socketService.publish({event: 'startTurn', payload: {code: this.game.remoteId}});
    }
    this.timerComponent.start();
  }

  private finishTurn() {
    this.orderedTeamList = this.game.getListOfTeamByPoints();
    this.gameState = GameStates.END_TURN;
    // if (this.game.remoteGame && !this.currentTeam.currentPlayer.isRemote) {
    //   console.log('Sending socket event Finishing turn!');
    //   this.socketService.publish({event: 'finishTurn', payload: {code: this.game.remoteId}});
    // }
    this.currentTeam.nextPlayer();
  }

  public wordGuessed() {
    if (this.game.guessWord && this.game.guessWord !== '') {
      if (this.game.remoteGame && !this.currentTeam.currentPlayer.isRemote) {
        this.socketService.publish({event: 'wordGuessed', payload: {code: this.game.remoteId}});
      }
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
