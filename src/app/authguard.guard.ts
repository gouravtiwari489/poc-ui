import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import { AppConstants } from './app.constants';

@Injectable()
export class AuthguardGuard implements CanActivate {

  constructor(private user: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const isLoggedIn = this.user.getUserLoggedIn();
  const user = JSON.parse(window.localStorage.getItem(AppConstants.localStorageTokenName));
  if (user) {
      return true;
  }
  if (!isLoggedIn) {
    this.router.navigate([AppConstants.loginRoute]);
    console.log('You are not authenticated');
  }
    return this.user.getUserLoggedIn();
   }
}
