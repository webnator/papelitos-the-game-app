import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalUserSelectionPage } from './local-user-selection';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    LocalUserSelectionPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(LocalUserSelectionPage),
  ]
})
export class LocalUserSelectionPageModule {}
