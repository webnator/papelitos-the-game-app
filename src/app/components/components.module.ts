import {NgModule} from '@angular/core';
import {CommonModule}       from '@angular/common';
import {IonicModule} from 'ionic-angular';

import {NumberSelectorComponent} from './number-selector/number-selector';
import {TimerComponent} from "./timer/timer";

@NgModule({
  declarations: [
    NumberSelectorComponent,
    TimerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    NumberSelectorComponent,
    TimerComponent
  ]
})
export class ComponentsModule {
}
