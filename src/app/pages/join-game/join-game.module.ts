import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinGamePage } from './join-game';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    JoinGamePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(JoinGamePage),
  ]
})
export class JoinGamePageModule {}
