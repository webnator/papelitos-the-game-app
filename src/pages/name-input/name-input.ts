import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';

@IonicPage()
@Component({
  selector: 'page-name-input',
  templateUrl: 'name-input.html',
})
export class NameInputPage {
  public playerList: Array<string>;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.game.localPlayers = 6;
    this.playerList = Array(this.game.localPlayers).fill('');
  }

  public setPlayerName(playerIndex: number, event: any): void {
    console.log('HEY!', playerIndex, event.target.value);
    this.playerList[playerIndex] = event.target.value;
    console.log(this.playerList);
  }

  public confirmScreen(): void {
    for (let player of this.playerList) {

    }
  }

}
