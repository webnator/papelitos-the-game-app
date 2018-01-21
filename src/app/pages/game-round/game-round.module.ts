import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {GameRoundPage} from './game-round';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    GameRoundPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GameRoundPage),
  ]
})
export class GameRoundPageModule {
}
