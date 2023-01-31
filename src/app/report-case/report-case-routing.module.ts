import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportCasePage } from './report-case.page';

const routes: Routes = [
  {
    path: '',
    component: ReportCasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportCasePageRoutingModule {}
