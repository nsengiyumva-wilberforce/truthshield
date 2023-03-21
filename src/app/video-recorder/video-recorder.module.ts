import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoRecorderPageRoutingModule } from './video-recorder-routing.module';

import { VideoRecorderPage } from './video-recorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoRecorderPageRoutingModule
  ],
  declarations: [VideoRecorderPage]
})
export class VideoRecorderPageModule {}
