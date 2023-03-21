import { LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Report, ReportService } from '../services/report.service';

@Component({
  selector: 'app-view-quick-drafts',
  templateUrl: './view-quick-drafts.page.html',
  styleUrls: ['./view-quick-drafts.page.scss'],
})
export class ViewQuickDraftsPage implements OnInit {
  reportForm!: FormGroup;
  can_edit: boolean = false;
  title: string = "";
  description: string =  "";
  location: string = "";
  parties_involved: string = "";
  evidence: string = "";
  time: string = "";
  status: string = "";

  report: Report = { title: '', description: '', location: '', parties_involved: '', time: '', evidence: '', status: '', entry_category: '', evidence_type: '' };
  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      parties_involved: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      time: [''],
      status: ['submitted']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getReportDetails(id);
    console.log(id);
  }

  getReportDetails(id: any){
    this.reportService.getQuickReportById(id).subscribe(res=>{
      console.log(res)
      this.report = res;
    })
  }

  goBack(){
    window.history.back();
  }

  allowEdit(){
    this.can_edit = !this.can_edit;
    if (this.can_edit) {

        this.title = this.report.title;
        this.description =  this.report.description;
        this.location =this.report.location;
        this.parties_involved = this.report.parties_involved;
        this.evidence = this.report.evidence;
        this.time = this.report.time;
        this.status = this.report.status;

      }
  }

  async submitReport(){
    const loading = await this.loadingCtrl.create({
      message: 'Submitting Reports...',
      cssClass: 'custom-loading',
    });

    loading.present()
    if (this.reportForm.valid) {
      this.reportService.addReport(this.reportForm.value).then(() => {
        console.log('Report added');
        loading.dismiss();
      });
    }
  }
}
