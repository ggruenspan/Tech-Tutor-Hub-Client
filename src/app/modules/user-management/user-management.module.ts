import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SettingsComponent } from '../../components/settings/settings.component';
import { PublicProfileComponent } from '../../components/public-profile/public-profile.component';
import { AccountComponent } from '../../components/account/account.component';
import { TutorDashboardComponent } from '../../components/tutor-dashboard/tutor-dashboard.component';
import { SecurityAndAccessComponent } from '../../components/security-and-access/security-and-access.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { PaymentsComponent } from '../../components/payments/payments.component';
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard.component';

import { ProfileImageUploaderComponent } from '../../components/modals/profile-image-uploader/profile-image-uploader.component';

@NgModule({
  declarations: [
    SettingsComponent,
    PublicProfileComponent,
    AccountComponent,
    TutorDashboardComponent,
    SecurityAndAccessComponent,
    NotificationsComponent,
    PaymentsComponent,
    AdminDashboardComponent,
    ProfileImageUploaderComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserManagementModule { }
