import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinksPage } from '../links/links.page';

@Component({
  selector: 'app-report-categories',
  templateUrl: './report-categories.page.html',
  styleUrls: ['./report-categories.page.scss'],
})
export class ReportCategoriesPage implements OnInit {
  title: any;
  categories: any[] = ["Baseline", "Pursue"]

  constructor(
    private popoverController: PopoverController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.title = this.route.snapshot.paramMap.get('title')
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LinksPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
