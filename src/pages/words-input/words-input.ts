import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';
import {PagesList} from "../pages.factory";
import {Player} from "../../app/shared/Player";
import {config} from "../../app/shared/config";
import {trackByIndex} from "../../app/shared/commons";

@IonicPage()
@Component({
  selector: 'page-team-selection',
  templateUrl: 'words-input.html',
})

export class WordsInputPage {
  public playerList: Array<Player>;
  public currentPlayer: Player;
  public WORDS_PER_PLAYER: number = config.WORDS_PER_PLAYER;
  public trackByIndex: any = trackByIndex;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.playerList = this.game.players;
    this.currentPlayer = this.playerList[0];
  }

  public selectPlayerForWordSelection(player: Player) {
    this.currentPlayer = player;
  }

  public confirmScreen(): void {
    const nextPlayer = this.getNextPlayerWithoutWords();
    if (nextPlayer) {
      this.currentPlayer = nextPlayer;
    } else {
      this.navCtrl.push(PagesList.gameRound);
    }
  }

  private getNextPlayerWithoutWords(): Player {
    return this.playerList.find(player => player.hasEnteredWords !== true);
  }
}
