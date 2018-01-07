import {Component} from '@angular/core';
import {IonicPage, NavController, MenuController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';

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
    this.game.start(123);
    console.log('Game id 1', this.game.id);
    this.navCtrl.push('GlobalUserSelectionPage');
  }

}
