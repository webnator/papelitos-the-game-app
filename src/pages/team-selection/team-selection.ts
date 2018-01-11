import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../app/shared/Game.service';
import {PagesList} from "../pages.factory";
import {Player} from "../../app/shared/Player";
import {Team} from "../../app/shared/Team";
import {shuffleArray} from "../../app/shared/commons";

@IonicPage()
@Component({
  selector: 'page-team-selection',
  templateUrl: 'team-selection.html',
})

export class TeamSelectionPage {
  public selectionStarted: boolean = false;
  public playerList: Array<Player>;
  public teamList: Array<Team>;
  public showConfirmScreen: boolean = false;

  constructor(public navCtrl: NavController, public game: GameService) {
    this.playerList = this.game.players;
    this.teamList = this.game.teams;
  }

  public selectTeams(random: boolean) {
    if (random) {
      this.selectRandomTeams();
    }
    this.selectionStarted = true;
  }

  public assignTeam(player: Player) {
    const team = this.getNextTeamMissingPlayers();
    if (team) {
      team.setPlayer(player);
    }

  }

  public confirmScreen(): void {
    if (!this.getNextTeamMissingPlayers()) {
      if (this.showConfirmScreen === true) {
        this.navCtrl.push(PagesList.wordsInput);
      } else {
        this.showConfirmScreen = true;
      }
    } else {
     // TODO handle error
    }
  }

  public goBack(): void {
    this.showConfirmScreen = false;
  }

  private getNextTeamMissingPlayers(): Team {
    return this.teamList.find(team => team.teamComplete === false);
  }

  private selectRandomTeams() {
    const randomList = shuffleArray(this.game.players);
    randomList.forEach(player => {
      this.getNextTeamMissingPlayers().setPlayer(player);
    });
  }


}
