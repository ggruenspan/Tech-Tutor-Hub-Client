import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { HomeComponent } from './home/home.component';
import { FindYourTutorComponent } from './find-your-tutor/find-your-tutor.component';
import { BecomeATutorComponent } from './become-a-tutor/become-a-tutor.component';
import { HelpComponent } from './help/help.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '', component: HomeComponent }, 
  { path: 'find-your-tutor', component: FindYourTutorComponent },
  { path: 'become-a-tutor', component: BecomeATutorComponent },
  { path: 'help', component: HelpComponent },
  { path: 'account-settings', component: AccountSettingsComponent},

  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
