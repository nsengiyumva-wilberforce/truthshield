import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoRecorderPage } from './video-recorder.page';

const routes: Routes = [
  {
    path: '',
    component: VideoRecorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRecorderPageRoutingModule {}
