import { LinksPage } from './../links/links.page';
import { Component, ViewChild } from '@angular/core';
import { IonSlides, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  corruption_cts: any[] = ["Bribery", "Embezzlement", "Extortion", "Fraud", "Graft", "Nepotism", "Kickbacks","Money Laundering"]
  constructor(private popoverController: PopoverController) {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LinksPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
