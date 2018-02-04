import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';

import {GameService} from './shared/Game.service'
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SocketService} from "./providers/socket.service";
import {ComponentsModule} from "./components/components.module";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocketService,
    GameService,
  ]
})
export class AppModule {
}
