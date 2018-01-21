import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";

@IonicPage()
@Component({
  selector: 'page-local-user-selection',
  templateUrl: 'local-user-selection.html',
})
export class LocalUserSelectionPage {
  private localPlayers: number;
  public gamePlayers: number;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.gamePlayers = this.game.totalPlayers;
  }

  public localPlayerSelection(playerTotal: number): void {
    this.localPlayers = playerTotal;
  }

  public confirmScreen(): void {
    this.game.setTotalNumLocalPlayers(this.localPlayers);
    this.navCtrl.push(PagesList.nameInput);
  }

}
