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
    // TODO Remove debug log
    console.log('HEYYYY', PagesList.userSelection);
    this.navCtrl.push(PagesList.userSelection);
  }

}
