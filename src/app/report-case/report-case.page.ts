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
  files: any;

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
      evidence: ['', [Validators.required]],
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

  addPhotoToGallery() {
    //take the photo and convert it to blob
        this.reportService.takePicture().then((data)=>{
          this.files=data
        })
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

  async submitReportWithEvidence() {
        //create the order form with the image
        const formData = new FormData();
        formData.append('title', "from camera")
        formData.append('description', "case")
        formData.append('location', this.reportForm.value.location)
        formData.append('parties_involved', this.reportForm.value.parties_involved)
        formData.append("evidence", this.files, this.files.filepath)
        console.log("form added")
        const loading = await this.loadingCtrl.create({
          message: 'Loading'
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
