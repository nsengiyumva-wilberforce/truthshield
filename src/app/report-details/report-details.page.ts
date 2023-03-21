import { Report } from '../services/report.service';
import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { LinksPage } from '../links/links.page';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { ReportService } from '../services/report.service';
import { LoadingController } from '@ionic/angular';

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
reports: Report[] = [];
  constructor(
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private loadingCtrl: LoadingController
  ) {


  }

  async ngOnInit() {
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
    // this.getReports()
    this.getReportsByEntryCategory()
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

  async getReports(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading Reports...',
      cssClass: 'custom-loading',
    });
    loading.present();
    this.reportService.getReports().subscribe(res=>{
      this.reports = res;
      console.log(res)
      loading.dismiss();
    })
  }
  goBack(){
    window.history.back();
  }

  async getReportsByEntryCategory()
  {
    const loading = await this.loadingCtrl.create({
      message: 'Loading Reports...',
      cssClass: 'custom-loading',
    });
    loading.present();
    this.reportService.getReportByEntryCategory(this.title).subscribe(res=>{
      this.reports = res;
      console.log("reports of extortion",res)
      loading.dismiss();
    })
  }
}
