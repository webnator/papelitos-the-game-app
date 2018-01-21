import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WordsInputPage} from './words-input';

import {ComponentsModule} from '../../components/components.module'

@NgModule({
  declarations: [
    WordsInputPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(WordsInputPage),
  ]
})
export class WordsInputPageModule {
}
