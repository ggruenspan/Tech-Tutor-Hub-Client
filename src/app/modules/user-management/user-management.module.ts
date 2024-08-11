import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SettingsComponent } from '../../components/settings/settings.component';
import { PublicProfileComponent } from '../../components/public-profile/public-profile.component';
import { SecurityAndAccessComponent } from '../../components/security-and-access/security-and-access.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { PaymentsComponent } from '../../components/payments/payments.component';
import { ProfileImageUploaderComponent } from '../../components/modals/profile-image-uploader/profile-image-uploader.component';

@NgModule({
  declarations: [
    SettingsComponent,
    PublicProfileComponent,
    SecurityAndAccessComponent,
    NotificationsComponent,
    PaymentsComponent,
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
