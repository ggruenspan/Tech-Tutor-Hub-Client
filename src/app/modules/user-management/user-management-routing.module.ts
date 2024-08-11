import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from '../../components/settings/settings.component';
import { PublicProfileComponent } from '../../components/public-profile/public-profile.component';
import { AccountComponent } from '../../components/account/account.component';
import { SecurityAndAccessComponent } from '../../components/security-and-access/security-and-access.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { PaymentsComponent } from '../../components/payments/payments.component';
import { ProtectedRouteGuardService as ProtectedRouteGuard } from '../../guards/protected-route.guard';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent, canActivate: [ProtectedRouteGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: PublicProfileComponent},
      { path: 'account', component: AccountComponent},
      { path: 'security&access', component: SecurityAndAccessComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'payments', component: PaymentsComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
