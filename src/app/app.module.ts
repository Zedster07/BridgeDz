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
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireFunctionsModule} from '@angular/fire/functions';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



import { environment } from 'src/environments/environment.prod';
import { GlobalsService } from './services/globals.service';
import { LoginService } from './services/login.service';
import { GeolocService } from './services/geoloc.service';
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
import { CarValidateModalPage } from './modals/car-validate-modal/car-validate-modal.page';
import { CheckoutPage } from './modals/checkout/checkout.page';
import { ReductionsPage } from './modals/reductions/reductions.page';
import { AccessHoursPage } from './modals/access-hours/access-hours.page';
import { CarAvailabilityPage } from './modals/car-availability/car-availability.page';
import { CarAvailabilityV1Page } from 'src/app/modals/car-availability-v1/car-availability-v1.page'
import { BookingOutPage } from 'src/app/modals/booking-out/booking-out.page'
import { NgCalendarModule  } from 'ionic2-calendar';
import { ReservePage } from './modals/reserve/reserve.page';
import { MenuListComponent } from './menu-list/menu-list.component';
import { ClientMenuListComponent } from './client/client-menu-list/client-menu-list.component';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';
import { UtilService } from './services/util.service';
import { Util2Service } from './services/util2.service';
import { BillingService } from './services/billing.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {TranslateModule, TranslateLoader, TranslatePipe} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from  '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { StartLocClientPage } from './modals/start-loc-client/start-loc-client.page';
import { RatingPage } from './modals/rating/rating.page';
import { StartLocAgencyPage } from './modals/start-loc-agency/start-loc-agency.page';
import { LanguagePage } from './language/language.page';
import { SearchGoogleAddressPage } from './modals/search-google-address/search-google-address.page';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { CarValidateModalPageModule } from './modals/car-validate-modal/car-validate-modal.module';
import { BookingOutPageModule } from './modals/booking-out/booking-out.module';
import { LanguagePageModule } from './language/language.module';
import { SearchGoogleAddressPageModule } from './modals/search-google-address/search-google-address.module';
import { StartLocAgencyPageModule } from './modals/start-loc-agency/start-loc-agency.module';
import { RatingPageModule } from './modals/rating/rating.module';
import { StartLocClientPageModule } from './modals/start-loc-client/start-loc-client.module';
import { CheckoutPageModule } from './modals/checkout/checkout.module';
import { CarAvailabilityV1PageModule } from 'src/app/modals/car-availability-v1/car-availability-v1.module'

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

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, AgencyModalPage , AddCarModalPage   , ReductionsPage   , AccessHoursPage , CarAvailabilityPage ,  ReservePage , 
    MenuListComponent , ClientMenuListComponent, ],
  entryComponents: [
    AgencyModalPage,
    CarValidateModalPage,
    BookingOutPage,
    LanguagePage,
    CheckoutPage,
    RatingPage,
    AddCarModalPage,
    ReductionsPage,
    AccessHoursPage ,
    CarAvailabilityPage ,
    CarAvailabilityV1Page,
    ReservePage ,
    MenuListComponent,
    ClientMenuListComponent ,
    StartLocClientPage ,
    StartLocAgencyPage ,
    SearchGoogleAddressPage,
],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    DeviceDetectorModule.forRoot(),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    Ionic4DatepickerModule,
    IonicTimepickerModule,
    HttpClientModule,
    LeafletModule,
    NgbModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CarValidateModalPageModule,
    BookingOutPageModule,
    LanguagePageModule,
    SearchGoogleAddressPageModule,
    StartLocAgencyPageModule,
    RatingPageModule,
    StartLocClientPageModule,
    CheckoutPageModule,
    CarAvailabilityV1PageModule,
    ChartsModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
   }),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }) , NgCalendarModule],


    
  providers: [
    StatusBar,
    SplashScreen,
    GlobalsService,
    UtilService,
    Util2Service,
    BillingService,
    LoadingService,
    AlertService,
    LoginService,
    GeolocService,
    AuthGuardService,
    DbinteractionsService,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],

  exports: [
    TranslateModule
], 

  bootstrap: [AppComponent]
})
export class AppModule {}
