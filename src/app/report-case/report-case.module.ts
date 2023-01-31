import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportCasePageRoutingModule } from './report-case-routing.module';

import { ReportCasePage } from './report-case.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReportCasePageRoutingModule
  ],
  declarations: [ReportCasePage]
})
export class ReportCasePageModule {}
