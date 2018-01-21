import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {config} from "../../config";

@IonicPage()
@Component({
  selector: 'page-global-user-selection',
  templateUrl: 'global-user-selection.html',
})
export class GlobalUserSelectionPage {
  private totalPlayers: number;
  public maxPlayers: number = config.MAX_GAME_PLAYERS;
  public error: string;

  constructor(public navCtrl: NavController, public game: GameService) {
  }

  public totalPlayerSelection(playerTotal: number): void {
    this.error = null;
    this.totalPlayers = playerTotal;
  }

  public confirmScreen(): void {
    this.error = null;
    if (this.totalPlayers > 0 && this.totalPlayers % 2 == 0) {
      this.game.setTotalNumPlayers(this.totalPlayers);
      this.navCtrl.push(PagesList.localUserSelection);
    } else {
      // TODO sacar a archivo de strings de respuesta
      this.error = "El número de jugadores no es valido, recuerda que debe ser un número <strong>par</strong>, menor a 20"
    }
  }

}
