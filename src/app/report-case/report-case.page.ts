import { Capacitor } from '@capacitor/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ReportService } from '../services/report.service';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getDownloadURL, ref, uploadString, Storage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';

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
  image: boolean = false;
  photo_src: any;
  real_photo: any;
  entry_category: any;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private route: ActivatedRoute
    ) {
    this.entry_category = this.route.snapshot.paramMap.get('entry_category');
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      parties_involved: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      time: [''],
      status: ['drafts'],
      entry_category: [this.entry_category],
      evidence_type: ['image']
    });
  }

 async ngOnInit() {
  //get entry_category from the url
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
                if(this.image){
                  this.saveUploadedImage(this.real_photo).then((data)=>{
                    this.reportForm.value.evidence = data
                    console.log(this.reportForm.value)
                      this.reportService.addReport(this.reportForm.value).then(() => {
                        console.log('Report added');
                        // loading.dismiss();
                      });

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

  async submitReportWithEvidence() {
        //create the order form with the image
        const formData = new FormData();
        formData.append('title', "Add title")
        formData.append('description', "describe the corruption case")
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

  async uploadImage(){
    this.reportForm.value.evidence_type = "image"
    const image: any = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    this.image = true;
    this.photo_src = "data:image/"+image.format+";base64,"+image.base64String;
    this.real_photo = image;
  }

  async saveUploadedImage(image: any){
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

  async uploadVideo(){

  }

  async uploadDocument(){

  }
}
