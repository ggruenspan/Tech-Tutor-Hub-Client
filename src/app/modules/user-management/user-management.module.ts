import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SettingsComponent } from '../../components/settings/settings.component';
import { AccountComponent } from '../../components/account/account.component';
import { SecurityAndAccessComponent } from '../../components/security-and-access/security-and-access.component';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { PaymentsComponent } from '../../components/payments/payments.component';
import { ProfileImageUploaderComponent } from '../../components/modals/profile-image-uploader/profile-image-uploader.component';

@NgModule({
  declarations: [
    SettingsComponent,
    AccountComponent,
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
