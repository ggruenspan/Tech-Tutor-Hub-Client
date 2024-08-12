import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from '../../components/settings/settings.component';
import { PublicProfileComponent } from '../../components/public-profile/public-profile.component';
import { AccountComponent } from '../../components/account/account.component';
import { TutorDashboardComponent } from '../../components/tutor-dashboard/tutor-dashboard.component';
import { SecurityAndAccessComponent } from '../../components/security-and-access/security-and-access.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { PaymentsComponent } from '../../components/payments/payments.component';
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard.component';

import { ProtectedRouteGuardService as ProtectedRouteGuard } from '../../guards/protected-route.guard';
import { RoleGuardService as RoleGuard } from '../../guards/role.guard';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent, canActivate: [ProtectedRouteGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: PublicProfileComponent},
      { path: 'account', component: AccountComponent},
      { path: 'tutor-dashboard', component: TutorDashboardComponent, canActivate: [RoleGuard], data: { requiredRole: 'Tutor' }},
      { path: 'security&access', component: SecurityAndAccessComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'payments', component: PaymentsComponent},
      { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { requiredRole: 'Admin' }},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
