import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TeamSelectionPage} from './team-selection';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    TeamSelectionPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TeamSelectionPage),
  ]
})
export class TeamSelectionPageModule {
}
