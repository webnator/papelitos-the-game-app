import {Component} from '@angular/core';
import {IonicPage, NavController, MenuController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from '../pages.factory';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController, public game: GameService) {
    this.menu.enable(false);
  }

  startGame() {
    this.game.start();
    this.navCtrl.push(PagesList.userSelection);
  }

  joinGame() {
    this.navCtrl.push(PagesList.joinGame);
  }

}
