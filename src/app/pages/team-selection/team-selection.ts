import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

import {GameService} from '../../shared/Game.service';
import {PagesList} from "../pages.factory";
import {Player} from "../../shared/Player";
import {Team} from "../../shared/Team";
import {shuffleArray} from "../../shared/commons";
import {Game} from "../../shared/Game";

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
  public game: Game;

  constructor(public navCtrl: NavController, public gameService: GameService) {
    this.game = this.gameService.getGame();
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
        this.gameService.teamsSet();
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
