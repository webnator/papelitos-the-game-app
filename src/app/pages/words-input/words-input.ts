import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {Player} from "../../shared/Player";
import {trackByIndex} from "../../shared/commons";
import {SocketService} from '../../providers/socket.service';

@IonicPage()
@Component({
  selector: 'page-team-selection',
  templateUrl: 'words-input.html',
})

export class WordsInputPage {
  public playerList: Array<Player>;
  public currentPlayer: Player;
  public trackByIndex: any = trackByIndex;
  public waitingRemotely: boolean;

  constructor(public navCtrl: NavController, public game: GameService, public socketService: SocketService) {
    this.playerList = this.game.players;
    this.currentPlayer = this.getNextPlayerWithoutWords();
  }

  public selectPlayerForWordSelection(player: Player) {
    if (!player.isRemote) {
      this.currentPlayer = player;
    }
  }

  public confirmScreen(): void {
    const nextPlayer = this.getNextPlayerWithoutWords();
    this.game.sendPlayersWords();
    if (nextPlayer) {
      this.currentPlayer = nextPlayer;
    } else if (!this.allPlayersHaveWords) {
      this.waitingRemotely = true;
      this.socketService.registerListener({
        event: 'wordEntering_response',
        handler: this.handleRemoteWordEnter.bind(this)
      })
    } else {
      this.navCtrl.push(PagesList.gameRound);
    }
  }

  private handleRemoteWordEnter() {
    if (this.waitingRemotely && this.allPlayersHaveWords) {
      this.navCtrl.push(PagesList.gameRound);
    }
  }

  private getNextPlayerWithoutWords(): Player {
    return this.playerList.find(player => player.hasEnteredWords !== true && player.isRemote === false);
  }

  public get allPlayersHaveWords() {
    return !this.playerList.find(player => player.hasEnteredWords !== true);
  }

}
