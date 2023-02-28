import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LinksPage } from '../links/links.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.page.html',
  styleUrls: ['./report-details.page.scss'],
})
export class ReportDetailsPage implements OnInit {
title: any;
type: any;
active_tab: any;
select_tab: any;
  constructor(
    private popoverController: PopoverController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.title = this.route.snapshot.paramMap.get('ctg')
    this.type = this.route.snapshot.paramMap.get('type')

    //preselect a tab depending on
    //whether it's followup or baseline
    if(this.type==='Pursue'){
      this.select_tab = 'new'
      this.active_tab = 'new'
    } else {
      this.select_tab = 'drafts'
      this.active_tab = 'drafts'
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LinksPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  segmentChanged(ev:any){
    this.active_tab = ev.detail.value;
    console.log(ev.detail.value)
  }

}
