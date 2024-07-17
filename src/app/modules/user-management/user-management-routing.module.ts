import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from '../../components/settings/settings.component';
import { AccountComponent } from '../../components/account/account.component';
import { SecurityAndAccessComponent } from '../../components/security-and-access/security-and-access.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { PaymentsComponent } from '../../components/payments/payments.component';
import { ProtectedRouteGuardService as ProtectedRouteGuard } from '../../guards/protected-route.guard';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent, canActivate: [ProtectedRouteGuard],
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
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
