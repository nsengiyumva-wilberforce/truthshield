import { Report, ReportService } from './../services/report.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  report: Report = { title: '', description: '', location: '', parties_involved: '', time: '', evidence: '', status: '', entry_category: '', evidence_type: '' };
  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getReportDetails(id);
    console.log(id);
  }

  getReportDetails(id: any){
    this.reportService.getReportById(id).subscribe(res=>{
      console.log(res)
      this.report = res;
    })
  }

  goBack(){
    window.history.back();
  }

}
