import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import { HomeComponent } from './components/home/home.component';
import { FindYourTutorComponent } from './components/find-your-tutor/find-your-tutor.component';
import { BecomeATutorComponent } from './components/become-a-tutor/become-a-tutor.component';
import { HelpComponent } from './components/help/help.component';

import { SettingsComponent } from './components/settings/settings.component';
import { AccountComponent } from './components/account/account.component';
import { SecurityAndAccessComponent } from './components/security-and-access/security-and-access.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PaymentsComponent } from './components/payments/payments.component';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { HttpInterceptorService } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    FindYourTutorComponent,
    BecomeATutorComponent,
    HelpComponent,
    PageNotFoundComponent,
    SettingsComponent,
    AccountComponent,
    NotificationsComponent,
    PaymentsComponent,
    SecurityAndAccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpInterceptorService, 
      multi: true 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
