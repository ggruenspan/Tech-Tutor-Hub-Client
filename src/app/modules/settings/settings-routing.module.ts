import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from '../../components/settings/settings.component';
import { PublicProfileComponent } from '../../components//settings/public-profile/public-profile.component';
import { AccountComponent } from '../../components/settings/account/account.component';
import { AdminDashboardComponent } from '../../components/settings/admin-dashboard/admin-dashboard.component';
import { TutorDashboardComponent } from '../../components/settings/tutor-dashboard/tutor-dashboard.component';
import { NotificationsComponent } from '../../components/settings/notifications/notifications.component';
import { PaymentsComponent } from '../../components/settings/payments/payments.component';
import { SecurityAndAccessComponent } from '../../components/settings/security-and-access/security-and-access.component';
import { PrivacyAndPermissionsComponent } from '../../components/settings/privacy-and-permissions/privacy-and-permissions.component';
import { LanguageAndTimeComponent } from '../../components/settings/language-and-time/language-and-time.component';
import { HelpAndSupportComponent } from '../../components/settings/help-and-support/help-and-support.component';

import { ProtectedRouteGuardService as ProtectedRouteGuard } from '../../guards/protected-route.guard';
import { RoleGuardService as RoleGuard } from '../../guards/role.guard';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent, canActivate: [ProtectedRouteGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: PublicProfileComponent},
      { path: 'account', component: AccountComponent},
      { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { requiredRole: 'Admin' }},
      { path: 'tutor-dashboard', component: TutorDashboardComponent, canActivate: [RoleGuard], data: { requiredRole: 'Tutor' }},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'payments', component: PaymentsComponent},
      { path: 'security&access', component: SecurityAndAccessComponent},
      { path: 'privacy&permissions', component: PrivacyAndPermissionsComponent},
      { path: 'language&time', component: LanguageAndTimeComponent},
      { path: 'help&support', component: HelpAndSupportComponent},

      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
