import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FindYourTutorComponent } from '../../components/find-your-tutor/find-your-tutor.component';
import { BecomeATutorComponent } from '../../components/become-a-tutor/become-a-tutor.component';
import { CommunityComponent } from '../../components/community/community.component';
import { HelpComponent } from '../../components/help/help.component';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'find-your-tutor', component: FindYourTutorComponent },
  { path: 'become-a-tutor', component: BecomeATutorComponent },
  { path: 'community', component: CommunityComponent},
  { path: 'help', component: HelpComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
