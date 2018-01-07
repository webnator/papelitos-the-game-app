import {NgModule} from '@angular/core';
import {CommonModule}       from '@angular/common';

import {NumberSelectorComponent} from './number-selector/number-selector';

@NgModule({
  declarations: [
    NumberSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberSelectorComponent
  ]
})
export class ComponentsModule {
}
