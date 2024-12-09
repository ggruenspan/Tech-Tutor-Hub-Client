import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';
import { FindYourTutorComponent } from '../../components/core/find-your-tutor/find-your-tutor.component';
import { BecomeATutorComponent } from '../../components/core/become-a-tutor/become-a-tutor.component';
import { CommunityComponent } from '../../components/core/community/community.component';
import { HelpComponent } from '../../components/core/help/help.component';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    FindYourTutorComponent,
    BecomeATutorComponent,
    CommunityComponent,
    HelpComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }
