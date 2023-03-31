import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewReportPageRoutingModule } from './view-report-routing.module';

import { ViewReportPage } from './view-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ViewReportPageRoutingModule
  ],
  declarations: [ViewReportPage]
})
export class ViewReportPageModule {}
