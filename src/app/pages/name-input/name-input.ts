import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {trackByIndex} from "../../shared/commons";
import {SocketService} from '../../providers/socket.service';

@IonicPage()
@Component({
  selector: 'page-name-input',
  templateUrl: 'name-input.html',
})
export class NameInputPage {
  public playerList: Array<string>;
  public error: string;
  public trackByIndex: any = trackByIndex;
  public playersEntered: boolean = false;

  constructor(public navCtrl: NavController, public game: GameService, public socketService: SocketService) {
    //INIT
    this.game.start();
    this.game.setTotalNumPlayers(8);
    this.game.setTotalNumLocalPlayers(6);

    this.playerList = Array(this.game.localPlayers).fill('');
  }

  public setPlayerName(playerIndex: number, event: any): void {
    this.playerList[playerIndex] = event.target.value;
  }

  public confirmScreen(): void {
    if (this.allLocalPlayersAreFilled) {
      this.game.setPlayers(this.playerList);
      this.playersEntered = true;
      if (this.game.allPlayersSet) {
        this.navCtrl.push(PagesList.teamSelection);
      } else {
        this.socketService.registerListener({event: 'playerSet', handler: this.handleRemotePlayer.bind(this)})
      }
    } else {
      this.error = 'Debes introducir el nombre de <strong>todos</strong> los jugadores';
    }
  }

  private handleRemotePlayer() {
    // TODO Remove debug log
    console.log('Hey ho!', this.game);
    if (this.game.allPlayersSet) {
      this.socketService.removeListener({event: 'playerSet', handler: this.handleRemotePlayer.bind(this)});
      this.navCtrl.push(PagesList.teamSelection);
    }
  }

  public get allLocalPlayersAreFilled(): boolean {
    for (let player of this.playerList) {
      if (player.trim() === '') { return false; }
    }
    return true;
  }

  private

}
