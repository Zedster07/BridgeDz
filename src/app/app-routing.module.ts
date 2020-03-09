import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '',  loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login' , loadChildren: './login/login.module#LoginPageModule' },
  { path: 'dashboard',  canActivate: [AuthGuardService] , loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'client', canActivate: [AuthGuardService] , loadChildren: './client/client.module#ClientPageModule' },
  { path: 'agency/:type', loadChildren: './agency/agency.module#AgencyPageModule' },
  { path: 'agency', loadChildren: './agency/agency.module#AgencyPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'faq', loadChildren: './faq/faq.module#FaqPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
