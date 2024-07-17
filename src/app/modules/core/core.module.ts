import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';
import { FindYourTutorComponent } from '../../components/find-your-tutor/find-your-tutor.component';
import { BecomeATutorComponent } from '../../components/become-a-tutor/become-a-tutor.component';
import { HelpComponent } from '../../components/help/help.component';
import { PageNotFoundComponent } from '../../components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    FindYourTutorComponent,
    BecomeATutorComponent,
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
