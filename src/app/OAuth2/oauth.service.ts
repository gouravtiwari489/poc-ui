import { Injectable, ErrorHandler } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import { UserService } from '../user.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class OauthService {

  private appData = AppConstants;
  private oauthUrl = this.appData.appUrl + AppConstants.oauthUrl;
  private oauthRefreshUrl = this.appData.appUrl + AppConstants.oauthRefreshUrl;
  private getLoggedUserUrl = this.appData.appUrl + AppConstants.loggedUserUrl ;
  private logoutUrl = this.appData.appUrl + AppConstants.logoutUrl;
  private TOKEN = AppConstants.localStorageTokenName;
  private REFRESH_TOKEN= AppConstants.localStorageRefreshTokenName;
  private token = {accessToken: AppConstants.emptyString, expiresIn: 0};
  @BlockUI() blockUI: NgBlockUI;

  constructor(private router: Router, private http: Http , private user: UserService) {
  }

  obtainAccessToken(user) {
    const headers = new Headers();
    headers.append('Authorization', AppConstants.authorizationToken);
    const options = new RequestOptions({ headers: headers });
     this.blockUI.start(AppConstants.blockUIStartMessage);
    return this.http.post(this.oauthUrl + user.username + '&password=' + user.password, AppConstants.emptyString, options)
    .map(res => res.json())
    .do( () => { this.blockUI.stop(); })
    .catch(this.handleError);
  }

  getCurrentlyLoggedInUser(data, cont) {
    this.saveToken(data);
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.getToken());
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.getLoggedUserUrl + '/' + cont, options)
      .map(res => res.json())
      .do( () => { this.blockUI.stop(); })
      .catch(this.handleError);
  }

  gotoDashBoard(data) {
    this.saveLoggedUser(data);
    this.blockUI.stop();
    this.router.navigate([AppConstants.dashboardRoute]);
    this.user.setUserLoggedIn();
  }

  goToRegistrationPage() {
      this.router.navigate([AppConstants.registrationRoute]);
       
  }
  
  stopBlockUI() {
    this.blockUI.stop();
  }

  logout(formData) {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.getToken());
    const options = new RequestOptions({ headers: headers });
    return this.http.post(this.logoutUrl, formData, options)
    .catch((error: Response) => {
      return Observable.throw(AppConstants.logoutErrorMessage);
    });
  }

  private saveToken(data) {
    const token = this.getTokenFromParams(data);
    const refreshToken = token.refreshToken;
    window.localStorage.setItem(this.TOKEN, JSON.stringify(token));
    window.localStorage.setItem(this.REFRESH_TOKEN, JSON.stringify(refreshToken));
  }

  private getTokenFromParams(params) {
    const token = params.access_token;
    const expiresIn = params.expires_in;
    const currentEpochTime = ((new Date)).getTime();
    const expirationPeriodInMilliseconds = expiresIn * 1000;
    return {'value': token, 'expirationTime': currentEpochTime + expirationPeriodInMilliseconds,
             'refreshToken': params.refresh_token};
  }

  private getToken() {
    const token = JSON.parse(window.localStorage.getItem(this.TOKEN));
    if (token != null || token !== undefined) {
        return token.value;
    }
  }

  private saveLoggedUser(data) {
    window.localStorage.setItem(AppConstants.localStorageUserTokenName, JSON.stringify(data));
  }

   getLoggedUser() {
    const user = JSON.parse(window.localStorage.getItem(AppConstants.localStorageUserTokenName));
    return user;
  }

  private handleError(error: any) {
     // this.blockUI.stop();
    console.log(error);
    if (error.status === 400 || error.status === 401) {
       var errorBody = JSON.parse(error._body); 
        if(errorBody.error_description && errorBody.error_description.includes(AppConstants.warningResponseCheck)) {
            return Observable.throw(errorBody.error_description);
        }
        return Observable.throw(AppConstants.invalidCredentialsErrorMessage);
    }else if (error.status === 0) {
      return Observable.throw(AppConstants.authenticationProblemErrorMessage);
    }else {
      return Observable.throw(error.json().message || AppConstants.defaultErrorMessage);
    }
  }
}
