import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DraftsPage } from './drafts.page';

const routes: Routes = [
  {
    path: '',
    component: DraftsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DraftsPageRoutingModule {}
