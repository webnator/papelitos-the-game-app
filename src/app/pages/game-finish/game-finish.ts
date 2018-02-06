import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {Team} from "../../shared/Team";

@IonicPage()
@Component({
  selector: 'page-game-finish',
  templateUrl: 'game-finish.html',
})
export class GameFinishPage {
  public orderedTeamList: Array<Team>;

  constructor(public navCtrl: NavController, public gameService: GameService) {
    this.orderedTeamList = this.gameService.getListOfTeamByPoints();
  }

  public confirmScreen(): void {
    this.gameService.reset();
    this.navCtrl.push(PagesList.home);
  }

}
