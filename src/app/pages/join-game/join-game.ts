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

  constructor(public navCtrl: NavController, public game: GameService) {}

  public confirmScreen(code: string, totalPlayers: number): void {
    this.error = null;
    this.game.join(code, totalPlayers).then((res) => {
      this.game.setTotalNumLocalPlayers(totalPlayers);
      // TODO Remove debug log
      console.log('HEEEEYYY', this.game);
      this.navCtrl.push(PagesList.nameInput);
    }).catch((err) => {
      this.error = err;
    })
  }

}
