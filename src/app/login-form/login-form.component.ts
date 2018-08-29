import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import { User } from '../user';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { OauthService } from '../OAuth2/oauth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import { HttpClient } from '../OAuth2/httpClient';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [OauthService, HttpClient]
})
export class LoginFormComponent implements OnInit {

  hideRegistrationForm : boolean;
  sucessMessage: string;
  errorMessage: string;
  cont: boolean;
  warningMessage: string;
  fullName: string;
  emailId: string;
  password: string;
  e: any;

  constructor(private router: Router, private userService: UserService, private user: User,
    private http: Http , private oauthService: OauthService ) { }

  ngOnInit() {
    this.hideRegistrationForm = true;
    this.cont = false;
    this.sucessMessage = AppConstants.emptyString;
    this.errorMessage = AppConstants.emptyString;
    this.warningMessage = AppConstants.emptyString;
    this.fullName = AppConstants.emptyString;
    this.emailId = AppConstants.emptyString;
    this.password = AppConstants.emptyString;
    const user = JSON.parse(window.localStorage.getItem(AppConstants.localStorageTokenName));
    if (user) {
         this.router.navigate([AppConstants.dashboardRoute]);
     }
  }

  closeMessageBox(message) {
    if (message === AppConstants.errorMessageType) {
      this.errorMessage = AppConstants.emptyString;
    }else if (message === AppConstants.warningMessageType) {
      this.warningMessage = AppConstants.emptyString;
    }else {
        this.sucessMessage = AppConstants.emptyString;
    }
  }

  loginUser(e) {
    this.e = e;
    this.e.preventDefault();
    this.user.username = this.e.target.elements[0].value;
    this.user.password = this.e.target.elements[1].value;
    this.oauthService.obtainAccessToken(this.user).subscribe(response =>  {
      return this.oauthService.getCurrentlyLoggedInUser(response, this.cont).subscribe(res => {
        this.oauthService.gotoDashBoard(res);
      }, Error => {
        if (Error.includes(AppConstants.warningResponseCheck)) {
          this.sucessMessage = AppConstants.emptyString;
          this.warningMessage = Error;
          this.errorMessage = AppConstants.emptyString;
        } else {
          this.sucessMessage = AppConstants.emptyString;
          this.errorMessage = Error;
          this.warningMessage = AppConstants.emptyString;
        }
        this.oauthService.stopBlockUI();
    });
    }, Error => {
        this.oauthService.stopBlockUI();
        if (Error.includes(AppConstants.warningResponseCheck)) {
          this.sucessMessage = AppConstants.emptyString;
          this.warningMessage = Error;
          this.errorMessage = AppConstants.emptyString;
        } else {
          this.sucessMessage = AppConstants.emptyString;
          this.errorMessage = Error;
          this.warningMessage = AppConstants.emptyString;
        }
    });
//  	if(this.user.userName == 'admin' && this.user.password == 'admin') {
//      this.userService.setUserLoggedIn();
//      let headers = new Headers();
//   	  headers.append('Content-Type', 'application/json');
//      headers.append('Authorization', 'Basic YWRtaW46YWRtaW4=');
//      let options = new RequestOptions({ headers: headers });
//
//      return this.http.post('http://localhost:9080/datagenerator/login', this.user, options).subscribe(data =>{
//      	// return data;
//    	 if(data.status == 200){
//    		 this.router.navigate(['dashboard']);
//    	 }
//      });
//  	}else{
//  	    	 alert('Invalid Credentials');
//  	}

  }

  continueLogin() {
      this.cont = true;
      this.loginUser(this.e);
  }
  
  toggleRegistration(value) {
      this.hideRegistrationForm = value;
      if (value === true) {
          this.sucessMessage = AppConstants.emptyString;
      } else {
          this.fullName = AppConstants.emptyString;
          this.emailId = AppConstants.emptyString;
          this.password = AppConstants.emptyString;
      }
      this.errorMessage = AppConstants.emptyString;
      this.warningMessage = AppConstants.emptyString;
      //this.oauthService.goToRegistrationPage();
  }
  
  registration(value: any){
      this.userService.saveUser(value)
          .subscribe(UserData =>{
              let newstr= UserData._body;
              this.sucessMessage = newstr;
              this.hideRegistrationForm = true;
          },
          (error)=> {
              this.sucessMessage = AppConstants.emptyString;
              this.warningMessage = AppConstants.emptyString;
              this.errorMessage = error._body;
          });
      };
}
