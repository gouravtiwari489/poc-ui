import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from './authguard.guard';
import { UserService } from './user.service';
import { UserComponent } from './user/user.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HttpModule } from '@angular/http';
import { User } from './user';
import { BlockUIModule } from 'ng-block-ui';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { NgxPasswordToggleModule } from 'ngx-password-toggle'; 
import { SimpleTimer } from 'ng2-simple-timer';

const appRoutes: Routes = [
  {
    path: 'users',
    pathMatch: 'full',
    children: [
      {
        path: ':name',
        component: UserComponent
      },
      {
         path: ':name/:id',
         component: UserComponent
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [AuthguardGuard],
    component: DashboardComponent
  },
  {
    path: '',
    // redirectTo: 'users/mehulmpt/1',
    pathMatch: 'prefix',
    component: LoginFormComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginFormComponent,
    FooterComponent,
    DashboardComponent,
    UserComponent,
    NotfoundComponent
    ],
  imports: [
  RouterModule.forRoot(appRoutes),
  BrowserModule,
  FormsModule,
  HttpModule,
  BlockUIModule,
  NgIdleKeepaliveModule.forRoot(),
  ShowHidePasswordModule.forRoot(),
  NgxPasswordToggleModule
  ],
  providers: [UserService, AuthguardGuard, User, SimpleTimer],
  bootstrap: [AppComponent]
})

export class AppModule { }
