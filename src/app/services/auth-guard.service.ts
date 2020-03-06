import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate  {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const url = route.url.join('/');

    const allowed = {
      auth: ['dashboard' , 'client'],
      notAuth: ['' , 'login']
    };

    const loggedIn = this.authService.isLoggedIn();
    console.log(loggedIn);
    if (loggedIn) {
      if ( allowed.notAuth.indexOf(url) !== -1 ) {
        this.route.navigate(['client']);
        return false;
      }
    } else {
      if (allowed.auth.indexOf(url) !== -1) {
        this.route.navigate(['']);
        return false;
      }
    }

    return true;
  }
  constructor(
    private authService: LoginService,
    private route: Router) { }
}
