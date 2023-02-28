import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LinksPage } from '../links/links.page';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  corruption_cts: any[] = ["Bribery", "Embezzlement", "Extortion", "Fraud", "Graft", "Nepotism", "Kickbacks","Money Laundering", "Cronysim"]
  constructor(private popoverController: PopoverController) {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LinksPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  ngOnInit() {
  }

}
