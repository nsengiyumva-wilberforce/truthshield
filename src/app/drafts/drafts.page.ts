import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Report, ReportService } from '../services/report.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.page.html',
  styleUrls: ['./drafts.page.scss'],
})
export class DraftsPage implements OnInit {
  reports: Report[] = [];
  constructor(
    private loadingCtrl: LoadingController,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getReports()
  }

  goBack(){
    window.history.back();
  }

  async getReports(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading Reports...',
      cssClass: 'custom-loading',
    });
    loading.present();
    this.reportService.getQuickReports().subscribe(res=>{
      this.reports = res;
      console.log(res)
      loading.dismiss();
    })
  }

}
