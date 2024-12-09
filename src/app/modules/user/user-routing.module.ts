import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from '../../components/user/user-profile/user-profile.component';
import { MessageCenterComponent } from '../../components/user/message-center/message-center.component';

const routes: Routes = [
  { path: 'messages', component: MessageCenterComponent },
  { path: ':userName', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}