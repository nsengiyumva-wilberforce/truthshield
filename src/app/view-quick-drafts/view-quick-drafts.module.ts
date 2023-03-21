import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQuickDraftsPageRoutingModule } from './view-quick-drafts-routing.module';

import { ViewQuickDraftsPage } from './view-quick-drafts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViewQuickDraftsPageRoutingModule
  ],
  declarations: [ViewQuickDraftsPage]
})
export class ViewQuickDraftsPageModule {}
