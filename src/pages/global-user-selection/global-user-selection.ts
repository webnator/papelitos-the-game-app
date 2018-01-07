import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';

@IonicPage()
@Component({
  selector: 'page-global-user-selection',
  templateUrl: 'global-user-selection.html',
})
export class GlobalUserSelectionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public game: GameService) {
    console.log('Game id', this.game.id);
  }

}
