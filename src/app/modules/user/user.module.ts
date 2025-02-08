import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from '../../components/user/user-profile/user-profile.component';
import { MessageCenterComponent } from '../../components/user/message-center/message-center.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    MessageCenterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
