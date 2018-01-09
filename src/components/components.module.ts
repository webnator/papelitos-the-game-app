import {NgModule} from '@angular/core';
import {CommonModule}       from '@angular/common';
import {IonicModule} from 'ionic-angular';

import {NumberSelectorComponent} from './number-selector/number-selector';

@NgModule({
  declarations: [
    NumberSelectorComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(NumberSelectorComponent),
  ],
  exports: [
    NumberSelectorComponent
  ]
})
export class ComponentsModule {
}
