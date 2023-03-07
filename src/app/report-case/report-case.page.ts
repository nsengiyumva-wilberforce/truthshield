import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ReportService } from '../services/report.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-report-case',
  templateUrl: './report-case.page.html',
  styleUrls: ['./report-case.page.scss'],
})
export class ReportCasePage implements OnInit {
  reportForm: FormGroup;
  latitude: any;
  longitude: any;
  location: any;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private loadingCtrl: LoadingController
    ) {
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      parties_involved: ['', [Validators.required]],
      // evidence: ['', [Validators.required]],
      time: ['']
    });
  }

 async ngOnInit() {
  this.setLocation();
  }

  async setLocation(){
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
    this.location = `${this.latitude}, ${this.longitude}`
    console.log(this.location)
    console.log(coordinates.coords);
  }

  async submitReport() {
    const loading = await this.loadingCtrl.create({
      message: 'Submitting Reports...',
      cssClass: 'custom-loading',
    });
    loading.present();
    if (this.reportForm.valid) {
      this.reportService.addReport(this.reportForm.value).then(() => {
        console.log('Report added');
        loading.dismiss();
      });
    }
  }

}
