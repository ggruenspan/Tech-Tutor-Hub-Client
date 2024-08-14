import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from '../../components/auth/sign-in/sign-in.component';
import { SignUpComponent } from '../../components/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../../components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../../components/auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from '../../components/auth/verify-email/verify-email.component';

import { AuthGuardService as AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent, canActivate: [AuthGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'verify-email/:token', component: VerifyEmailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
