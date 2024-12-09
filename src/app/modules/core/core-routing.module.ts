import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FindYourTutorComponent } from '../../components/core/find-your-tutor/find-your-tutor.component';
import { BecomeATutorComponent } from '../../components/core/become-a-tutor/become-a-tutor.component';
import { CommunityComponent } from '../../components/core/community/community.component';
import { HelpComponent } from '../../components/core/help/help.component';

const routes: Routes = [
  { path: 'find-your-tutor', component: FindYourTutorComponent },
  { path: 'become-a-tutor', component: BecomeATutorComponent },
  { path: 'community', component: CommunityComponent},
  { path: 'help', component: HelpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
