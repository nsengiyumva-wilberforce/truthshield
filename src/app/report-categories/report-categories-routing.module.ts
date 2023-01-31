import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportCategoriesPage } from './report-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ReportCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportCategoriesPageRoutingModule {}
