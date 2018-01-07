import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GlobalUserSelectionPage } from './global-user-selection';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    GlobalUserSelectionPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GlobalUserSelectionPage),
  ]
})
export class GlobalUserSelectionPageModule {}
