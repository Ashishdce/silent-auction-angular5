import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Services } from './services';

import { AppComponent } from './app.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyAFHX-xn1z9mY_9ddmEZRaXYuS8pp5oK4g',
  authDomain: 'silentauction-986e2.firebaseapp.com',
  databaseURL: 'https://silentauction-986e2.firebaseio.com',
  projectId: 'silentauction-986e2',
  storageBucket: '',
  messagingSenderId: '616289920075'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [Services],
  bootstrap: [AppComponent]
})
export class AppModule { }
