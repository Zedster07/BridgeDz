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
  { path: 'agency-modal', loadChildren: './modals/agency-modal/agency-modal.module#AgencyModalPageModule' },
  { path: 'add-car-modal', loadChildren: './modals/add-car-modal/add-car-modal.module#AddCarModalPageModule' },
  { path: 'access-hours', loadChildren: './modals/access-hours/access-hours.module#AccessHoursPageModule' },
  { path: 'car-availability', loadChildren: './modals/car-availability/car-availability.module#CarAvailabilityPageModule' },
  { path: 'reductions', loadChildren: './modals/reductions/reductions.module#ReductionsPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'demandeslocs', loadChildren: './dashboard/demandeslocs/demandeslocs.module#DemandeslocsPageModule' },
  { path: 'reserve', loadChildren: './modals/reserve/reserve.module#ReservePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
