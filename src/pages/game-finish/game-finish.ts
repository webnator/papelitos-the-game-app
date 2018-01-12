import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';
import {PagesList} from "../pages.factory";
import {Team} from "../../app/shared/Team";

@IonicPage()
@Component({
  selector: 'page-game-finish',
  templateUrl: 'game-finish.html',
})
export class GameFinishPage {
  public orderedTeamList: Array<Team>;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.orderedTeamList = this.game.getListOfTeamByPoints();
  }

  public confirmScreen(): void {
    this.game.reset();
    this.navCtrl.push(PagesList.home);
  }

}
