import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportCategoriesPageRoutingModule } from './report-categories-routing.module';

import { ReportCategoriesPage } from './report-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportCategoriesPageRoutingModule
  ],
  declarations: [ReportCategoriesPage]
})
export class ReportCategoriesPageModule {}
