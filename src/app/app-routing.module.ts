import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { AuthGuardService as AuthGuard } from './guards/auth.guard.';
import { SignGuardService as SignGuard } from './guards/sign.guard.';


const routes: Routes = [
  { path: 'sign-in', component: SignInComponent, canActivate: [SignGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [SignGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: '', component: HomeComponent }, 
  { path: 'find-your-tutor', component: FindYourTutorComponent },
  { path: 'become-a-tutor', component: BecomeATutorComponent },
  { path: 'help', component: HelpComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      { path: 'account', component: AccountComponent},
      { path: 'security&access', component: SecurityAndAccessComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'payments', component: PaymentsComponent},
    ]
  },

  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
