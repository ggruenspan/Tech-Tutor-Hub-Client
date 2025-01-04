import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FindYourTutorComponent } from '../../components/core/find-your-tutor/find-your-tutor.component';

import { BecomeATutorComponent } from '../../components/core/become-a-tutor/become-a-tutor.component';
import { TutorRegistrationComponent } from '../../components/core/become-a-tutor/tutor-registration/tutor-registration.component';

import { CommunityComponent } from '../../components/core/community/community.component';
import { HelpComponent } from '../../components/core/help/help.component';

import { RoleGuardService as RoleGuard } from '../../guards/role.guard';
import { AccessGuardService as AccessGuard } from '../../guards/access.guard';

const routes: Routes = [
  { path: 'find-your-tutor', component: FindYourTutorComponent },
  { path: 'become-a-tutor', component: BecomeATutorComponent},
    { path: 'become-a-tutor/register', component: TutorRegistrationComponent, canActivate: [AccessGuard, RoleGuard], data: { rolesNotAllowed: ['Tutor'] }},
  { path: 'community', component: CommunityComponent},
  { path: 'help', component: HelpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
