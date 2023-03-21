import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewQuickDraftsPage } from './view-quick-drafts.page';

const routes: Routes = [
  {
    path: '',
    component: ViewQuickDraftsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewQuickDraftsPageRoutingModule {}
