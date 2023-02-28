import { LinksPage } from './../links/links.page';
import { Component, ViewChild } from '@angular/core';
import { IonSlides, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  subjects: any[] = [
    {
      img: 'assets/imgs/voice.png',
      name:"Audio"
    },
    {
      img: 'assets/imgs/camera.png',
      name:"Video"
    },
    {
      img: 'assets/imgs/notes.png',
      name:"Notes"
    },
    {
      img: 'assets/imgs/hotspot.png',
      name:"Hotspots"
    },
  ]
  constructor() {}
  ngOnInit(){

  }

}
