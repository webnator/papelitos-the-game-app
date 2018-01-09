import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NameInputPage} from './name-input';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    NameInputPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(NameInputPage),
  ]
})
export class NameInputPageModule {
}
