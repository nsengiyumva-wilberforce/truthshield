import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialsPageRoutingModule } from './tutorials-routing.module';

import { TutorialsPage } from './tutorials.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialsPageRoutingModule
  ],
  declarations: [TutorialsPage]
})
export class TutorialsPageModule {}
