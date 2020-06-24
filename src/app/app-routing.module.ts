import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  { path: 'registerValid/:id',loadChildren: './login/login.module#LoginPageModule'  },
  { path: '',  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/:type/:id/:guid/:token/:resp',  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home/:type/:id/:guid',  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login' , loadChildren: './login/login.module#LoginPageModule' },
  { path: 'dashboard',  canActivate: [AuthGuardService] , loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'client', canActivate: [AuthGuardService] , loadChildren: './client/client.module#ClientPageModule' },
  { path: 'agency/:type', loadChildren: './agency/agency.module#AgencyPageModule' },
  { path: 'agency', loadChildren: './agency/agency.module#AgencyPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'faq', loadChildren: './faq/faq.module#FaqPageModule' },
  { path: 'ddetagency', loadChildren: './dashboard/dagency/ddetagency/ddetagency.module#DdetagencyPageModule' },
  { path: 'car-validate-modal', loadChildren: './modals/car-validate-modal/car-validate-modal.module#CarValidateModalPageModule' },
  { path: 'start-loc-client', loadChildren: './modals/start-loc-client/start-loc-client.module#StartLocClientPageModule' },
  { path: 'start-loc-agency', loadChildren: './modals/start-loc-agency/start-loc-agency.module#StartLocAgencyPageModule' },
  { path: 'search-google-address', loadChildren: './modals/search-google-address/search-google-address.module#SearchGoogleAddressPageModule' },
  { path: 'checkout', loadChildren: './modals/checkout/checkout.module#CheckoutPageModule' },
  { path: 'validation-request', loadChildren: './dashboard/validation-request/validation-request.module#ValidationRequestPageModule' },
  { path: 'booking-out', loadChildren: './modals/booking-out/booking-out.module#BookingOutPageModule' },
  { path: 'pwd', loadChildren: './pwd/pwd.module#PwdPageModule' },
  { path: 'pwd/:token', loadChildren: './pwd/pwd.module#PwdPageModule' },
  { path: 'mplocations', loadChildren: './client/mplocations/mplocations.module#MplocationsPageModule' },
  { path: 'rating', loadChildren: './modals/rating/rating.module#RatingPageModule' },
  { path: 'search/:type/:id/:guid/token', loadChildren: './search/search.module#SearchPageModule'},
  { path: 'home/:type/:id/:guid/:token',  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
