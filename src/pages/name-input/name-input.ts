import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';
import {PagesList} from "../pages.factory";
import {trackByIndex} from "../../app/shared/commons";

@IonicPage()
@Component({
  selector: 'page-name-input',
  templateUrl: 'name-input.html',
})
export class NameInputPage {
  public playerList: Array<string>;
  public error: string;
  public trackByIndex: any = trackByIndex;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.playerList = Array(this.game.localPlayers).fill('');
  }

  public setPlayerName(playerIndex: number, event: any): void {
    this.playerList[playerIndex] = event.target.value;
  }

  public confirmScreen(): void {
    if (this.allPlayersAreFilled()) {
      this.game.setLocalPlayers(this.playerList);
      this.navCtrl.push(PagesList.teamSelection);
    } else {
      this.error = 'Debes introducir el nombre de <strong>todos</strong> los jugadores';
    }
  }

  private allPlayersAreFilled(): boolean {
    for (let player of this.playerList) {
      if (player.trim() === '') { return false; }
    }
    return true;
  }

}
