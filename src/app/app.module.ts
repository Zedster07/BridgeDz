import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {FirebaseUIModule} from 'firebaseui-angular';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { environment } from 'src/environments/environment.prod';
import { GlobalsService } from './services/globals.service';
import { LoginService } from './services/login.service';
import { LoadingService } from './services/loading.service';
import { AlertService } from './services/alert.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthGuardService } from './services/auth-guard.service';
import { DashboardMenuListComponent } from './dashboard/dashboard-menu-list/dashboard-menu-list.component';
import { DbinteractionsService } from './services/dbinteractions.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { AgencyModalPage } from './modals/agency-modal/agency-modal.page';
import { FormsModule } from '@angular/forms';
import { AddCarModalPage } from './modals/add-car-modal/add-car-modal.page';
import { ReductionsPage } from './modals/reductions/reductions.page';
import { AccessHoursPage } from './modals/access-hours/access-hours.page';
import { CarAvailabilityPage } from './modals/car-availability/car-availability.page';
import { NgCalendarModule  } from 'ionic2-calendar';
import { ReservePage } from './modals/reserve/reserve.page';
import { MenuListComponent } from './menu-list/menu-list.component';
import { ClientMenuListComponent } from './client/client-menu-list/client-menu-list.component';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';
import { VoituresPipe } from './admin/voitures.pipe';
import { StartLocClientPage } from './modals/start-loc-client/start-loc-client.page';
import { StartLocAgencyPage } from './modals/start-loc-agency/start-loc-agency.page';
import { SearchGoogleAddressPage } from './modals/search-google-address/search-google-address.page';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    }
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
};

@NgModule({
  declarations: [AppComponent, AgencyModalPage , AddCarModalPage , ReductionsPage , AccessHoursPage , CarAvailabilityPage , ReservePage , 
    MenuListComponent , ClientMenuListComponent, VoituresPipe , StartLocClientPage , StartLocAgencyPage , SearchGoogleAddressPage],
  entryComponents: [
    SearchGoogleAddressPage,
    AgencyModalPage,
    AddCarModalPage,
    ReductionsPage,
    AccessHoursPage ,
    CarAvailabilityPage ,
    StartLocClientPage,
    StartLocAgencyPage,
    ReservePage ,
    MenuListComponent, ClientMenuListComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    AngularFireAuthModule,
    Ionic4DatepickerModule,
    IonicTimepickerModule,
    HttpClientModule ,
    IonicStorageModule.forRoot(),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }) , NgCalendarModule],
    
  providers: [
    StatusBar,
    SplashScreen,
    GlobalsService,
    LoadingService,
    AlertService,
    LoginService,
    AuthGuardService,
    DbinteractionsService,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
