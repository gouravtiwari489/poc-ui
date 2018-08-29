import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from '../OAuth2/httpClient';
import { AppConstants } from '../app.constants';
import { saveAs } from 'file-saver';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class DashboardService {

  @BlockUI() blockUI: NgBlockUI;

  constructor(private http: HttpClient, private _http: Http) {

  }

  getMappings(formData) {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.getToken());
    const options = new RequestOptions({ headers: headers });
    this.blockUI.start(AppConstants.blockUIFileUploadStartMessage);
    return this._http.post(AppConstants.appUrl + AppConstants.uploadUrl, formData, options)
    .map((response: Response) => response.json())
     .do( () => { this.blockUI.stop(); })
    .catch(this.handleError);
  }

  dummyRequest() {
       return  this.http.get(AppConstants.appUrl + AppConstants.dummyUrl).catch(this.handleError);
  }

  private getToken() {
    const token = JSON.parse(window.localStorage.getItem(AppConstants.localStorageTokenName));
    if (token != null || token !== undefined) {
      return token.value;
    }
  }

  downloadFile(formData, fileType): Observable<Object[]> {
     const blockUI = this.blockUI;
     return Observable.create(observer => {

      const xhr = new XMLHttpRequest();
      blockUI.start(AppConstants.blockUIDownloadStartMessage);
      xhr.open('POST', AppConstants.appUrl + AppConstants.downloadUrl, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + this.getToken());
      xhr.responseType = 'blob';
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType = AppConstants.fileDownloadContentType;
            const blob = new Blob([xhr.response], { type: contentType });
            observer.next(blob);
            observer.complete();
            blockUI.stop();
          } else {
            observer.error(xhr.response);
            blockUI.stop();
          }
        }
      };
      xhr.send(formData);
      });
  }

  private handleError(error: Response) {
    console.log(error);
    if (error.status === 0) {
      return Observable.throw(AppConstants.serverErrorMessage);
    }else {
      return Observable.throw(error.json().message || AppConstants.serverErrorMessage);
    }
  }

}
