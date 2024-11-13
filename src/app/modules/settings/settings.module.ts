import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
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

import { ProfileImageUploaderComponent } from '../../components/modals/profile-image-uploader/profile-image-uploader.component';

@NgModule({
  declarations: [
    SettingsComponent,
    PublicProfileComponent,
    AccountComponent,
    TutorDashboardComponent,
    AdminDashboardComponent,
    NotificationsComponent,
    PaymentsComponent,
    SecurityAndAccessComponent,
    PrivacyAndPermissionsComponent,
    LanguageAndTimeComponent,
    HelpAndSupportComponent,
    ProfileImageUploaderComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
