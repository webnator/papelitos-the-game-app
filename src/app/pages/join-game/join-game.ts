import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from '../pages.factory';

@IonicPage()
@Component({
  selector: 'join-game',
  templateUrl: 'join-game.html',
})
export class JoinGamePage {
  public error: string;

  constructor(public navCtrl: NavController, public gameService: GameService) {}

  public confirmScreen(code: string, totalPlayers: number): void {
    this.error = null;
    this.gameService.join(code, totalPlayers).then(() => {
      this.gameService.setTotalNumLocalPlayers(totalPlayers);
      this.navCtrl.push(PagesList.nameInput);
    }).catch((err) => {
      this.error = err;
    })
  }

}
