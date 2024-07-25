import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { SignInComponent } from '../../components/auth-form/sign-in/sign-in.component';
import { SignUpComponent } from '../../components/auth-form/sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../../components/auth-form/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/auth-form/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AuthFormComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
