import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptionsArgs, URLSearchParams, RequestMethod, RequestOptions  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import { Router } from '@angular/router';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class HttpClient {

  private oauthRefreshUrl = AppConstants.appUrl + AppConstants.oauthRefreshUrl;
  private TOKEN = AppConstants.localStorageTokenName;
  private token = {accessToken: AppConstants.emptyString, expiresIn: 0};
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private http: Http,
    private router: Router) {}

  public get(url: string, search?: URLSearchParams): Observable<any> {
    return this.request(url, { method: RequestMethod.Get, search })
      .map((response: any) => response);
  }

  public post(url: string, data?: Object): Observable<Object> {
    return this.request(url, { method: RequestMethod.Post }, data)
      .map((response: any) => response);
  }

  public put(url: string, data?: Object): Observable<Object> {
    return this.request(url, { method: RequestMethod.Put }, data)
      .map((response: any) => response);
  }

  public delete(url: string): Observable<Object> {
    return this.request(url, { method: RequestMethod.Delete });
  }

  private request(url: string, options: RequestOptionsArgs, body?: Object): Observable<Response> {
    this.blockUI.start(AppConstants.blockUIStartMessage);
    options.headers = new Headers();
    options.headers.append('Authorization', 'Bearer ' + this.getToken());

    if (body) {
        options.body = JSON.stringify(body);
        options.headers.append(AppConstants.contentType, AppConstants.JSONContentType);
    }

    const options2 = options;
    return this.http.request(url, options)
      .map((response: any) => response.json())
      .do( () => { this.blockUI.stop(); })
      .catch((error) => {
      this.blockUI.stop();
      if (error.status === 401) {
        this.blockUI.start(AppConstants.blockUIStartMessage);
        const token = JSON.parse(window.localStorage.getItem(AppConstants.localStorageTokenName));
        const refreshToken = JSON.parse(window.localStorage.getItem(AppConstants.localStorageRefreshTokenName));
        if (token === null || token === undefined) {
          this.router.navigate([AppConstants.loginRoute]);
        }
        window.localStorage.removeItem(this.TOKEN);
        const headers = new Headers();
        headers.append('Authorization', AppConstants.authorizationToken);
        const options1 = new RequestOptions({ headers: headers });
        return  this.http.post(this.oauthRefreshUrl + refreshToken , AppConstants.emptyString, options1)
          .mergeMap((data: any) => {
              const obj = JSON.parse(data.text());
              const accessToken = obj.access_token;
              const expiresIn = obj.expires_in;
              const currentEpochTime = ((new Date)).getTime();
              const expirationPeriodInMilliseconds = expiresIn * 1000;
              const token1 = {'value': accessToken, 'expirationTime': currentEpochTime + expirationPeriodInMilliseconds,
                          'refreshToken': obj.refresh_token};
              window.localStorage.setItem(this.TOKEN, JSON.stringify(token1));
            return this.request(url, options2, body);
          })
          .catch(() => {
            this.blockUI.stop();
            return Observable.fromPromise(this.router.navigate([AppConstants.loginRoute]));
          });
      }

      return Observable.throw(error);
    });
  }

  private getToken() {
    const token = JSON.parse(window.localStorage.getItem(AppConstants.localStorageTokenName));
    if (token != null || token !== undefined) {
        return token.value;
    }
 }

}
