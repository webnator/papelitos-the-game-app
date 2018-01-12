import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameFinishPage } from './game-finish';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    GameFinishPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GameFinishPage),
  ]
})
export class GameFinishPageModule {}
