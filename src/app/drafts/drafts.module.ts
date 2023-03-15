import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DraftsPageRoutingModule } from './drafts-routing.module';

import { DraftsPage } from './drafts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DraftsPageRoutingModule
  ],
  declarations: [DraftsPage]
})
export class DraftsPageModule {}
