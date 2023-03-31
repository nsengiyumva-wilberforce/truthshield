import { Report, ReportService } from './../services/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { getDownloadURL, ref, uploadString, Storage } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.page.html',
  styleUrls: ['./view-report.page.scss'],
})
export class ViewReportPage implements OnInit {
  title: string = "";
  description: string = "";
  location: string = "";
  parties_involved: string = "";
  evidence: string = "";
  time: string = "";
  status: string = "";
  entry_category: string = "";
  reportForm!: FormGroup;
  can_edit: boolean = false;
  can_followup: boolean = false;
  photo_src: any;
  tab: any;
  real_photo: any;
  image: boolean = false;
  followups: any[] = [];
  currentReportPosition = 0;
  report: Report = { title: '', description: '', location: '', parties_involved: '', time: '', evidence: '', status: '', entry_category: '', evidence_type: '' };
  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
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
    this.tab = this.route.snapshot.paramMap.get('tab')

    this.getReportDetails(id);
    this.getReportFollowups()
    console.log(id);
  }

  getReportDetails(id: any) {
    this.reportService.getReportById(id).subscribe(res => {
      console.log(res)
      this.report = res;
    })
  }

  getReportFollowups() {
    const report_id: any = this.route.snapshot.paramMap.get('id');
    console.log(report_id)
    this.reportService.getReportFollowups(report_id).subscribe(res => {
      console.log(res[0])
      this.followups = res
    })
  }

  goBack() {
    window.history.back();
  }
  allowEdit() {
    this.can_edit = !this.can_edit;
    this.can_followup = true;
    if (this.can_edit) {

      this.title = this.report.title;
      this.description = this.report.description;
      this.location = this.report.location;
      this.parties_involved = this.report.parties_involved;
      this.evidence = this.report.evidence;
      this.time = this.report.time;
      this.status = this.report.status;
      this.entry_category = this.report.entry_category;
      console.log(this.report.entry_category)

    }
  }
  async submitReport() {
    this.reportForm.value.id = this.report.id;
    console.log(this.report.id)
    this.reportForm.value.entry_category = this.report.entry_category;

    const alert = await this.alertCtrl.create({
      inputs: [
        {
          label: 'Keep as Draft',
          type: 'radio',
          value: 'drafts',
        },
        {
          label: 'Submit',
          type: 'radio',
          value: 'submitted',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: async (alertData) => { //takes the data
            this.reportForm.value.status = alertData;
            console.log(this.reportForm.value);
            const loading = await this.loadingCtrl.create({
              message: 'Submitting Reports...',
              cssClass: 'custom-loading',
              duration: 3000
            });

            loading.present()
            if (this.reportForm.valid) {
              this.reportService.updateReport(this.reportForm.value).then(() => {
                console.log('Report added');
                loading.dismiss();
                this.goBack();
              }).catch(async (error: any) => {
                const alert = await this.alertCtrl.create({
                  header: 'Report Submission failed',
                  message: 'There was a problem in sending your report. Please try again later.',
                  buttons: ['OK']
                })

                await alert.present();
                console.error('Error updating report:', error);
              });;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  allowFollowup() {
    this.can_followup = !this.can_followup;
    this.can_edit = true;

    if (this.can_followup) {
      this.title = this.report.title;
      this.parties_involved = this.report.parties_involved;
      this.evidence = this.report.evidence;
      this.entry_category = this.report.entry_category;
      console.log(this.report.entry_category)

    }
  }

  async followupReport() {
    this.reportForm.value.report_id = this.report.id;
    this.reportForm.value.title = this.report.title;
    this.reportForm.value.location = this.report.location;
    const alert = await this.alertCtrl.create({
      inputs: [
        {
          label: 'Save as Draft',
          type: 'radio',
          value: 'drafts',
        },
        {
          label: 'Submit',
          type: 'radio',
          value: 'submitted',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: (alertData) => { //takes the data
            this.reportForm.value.status = alertData
            //check if there is an image
            if (this.image) {
              this.saveUploadedImage(this.real_photo).then((data) => {
                this.reportForm.value.evidence = data
                console.log(this.reportForm.value)
                this.reportService.followupReport(this.reportForm.value).then(() => {
                  console.log('Report added');
                  // loading.dismiss();
                  this.goBack();
                }).catch(async (error: any) => {
                  const alert = await this.alertCtrl.create({
                    header: 'Report Submission failed',
                    message: 'There was a problem in sending your report. Please try again later.',
                    buttons: ['OK']
                  })

                  await alert.present();
                  console.error('Error updating report:', error);
                }
                );
              })
            } else {
              this.reportForm.value.evidence = "No evidence"
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async saveUploadedImage(image: any) {
    const imageName = Date.now() + image.format;
    const path: any = `uploads/evidences/files/${imageName}`;
    const storageRef = ref(this.storage, path);
    try {
      await uploadString(storageRef, image.base64String, 'base64');
      const photoURL: any = await getDownloadURL(storageRef);
      console.log(photoURL)
      return photoURL;
    } catch (error) {
      console.log(error);
    }
  }
  async uploadImage() {
    this.reportForm.value.evidence_type = "image"
    const image: any = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    this.image = true;
    this.photo_src = "data:image/" + image.format + ";base64," + image.base64String;
    this.real_photo = image;
  }

  async uploadVideo() {

  }

  async uploadDocument() {

  }
  navigateToReport(direction: string) {
    if (this.currentReportPosition < this.followups.length + 1) {
      if (direction == 'next') {
        if (this.currentReportPosition < this.followups.length) {
          this.report = this.followups[this.currentReportPosition];
          this.currentReportPosition++;
          console.log(this.report)
        } else {
          this.currentReportPosition = 0;
          this.getReportDetails(this.report.report_id);
        }

      }

      if (direction === 'previous') {
        this.currentReportPosition--;
        if (this.currentReportPosition == 0) {
          this.getReportDetails(this.report.report_id);
        } else {
          this.report = this.followups[this.currentReportPosition];
          console.log(this.report)
        }
      }
    } else {
      console.log("No more followups")
    }
  }

}
