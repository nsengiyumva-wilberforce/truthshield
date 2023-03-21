import { AuthenticationService } from './../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera/dist/esm/definitions';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import * as WebVPPlugin from 'capacitor-video-player';
import { Capacitor, Plugins } from '@capacitor/core';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';

const { CapacitorVideoPlayer } = Plugins;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile: any = null;
  placeholder: any;
  reportForm: FormGroup;
  latitude: any;
  longitude: any;
  location: any;
  files: any;
  report_id: any;
  recording: boolean = false;
  durationDisplay = ''
  duration = 0;
  evidence_type!: string;


  constructor(
    private authenticationService: AuthenticationService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private loadingCtrl: LoadingController,
    private storage: Storage
  ) {
    this.authenticationService.getUserProfile().subscribe((data: any) => {
      this.profile = data;
      console.log(data)
    })

    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      parties_involved: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
      time: [''],
      status: [''],
      entry_category: [''],
      evidence_type: ['']
    });
  }
  ngOnInit(){

  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    })

    console.log(image)

    if(image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.authenticationService.uploadImage(image);
      loading.dismiss();

      if(!result){
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem in uploading your image',
          buttons: ['OK']
        })

        await alert.present();
      } else {
        console.log(result)
      }
    }
  }

  addPhotoToGallery() {
    //take the photo and convert it to blob
        this.reportService.takePicture().then((data)=>{
          this.files=data;
          this.evidence_type = 'image';
          this.submitReportWithEvidence()
        })
      }

  //stop recording and upload the audio to firebase storage
  addAudioToGallery(){
    if (!this.recording) return;
    this.recording = false;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {

      if(result.value && result.value.recordDataBase64){
        const recordingData = result.value.recordDataBase64;
        const audioName = Date.now() + '.wav';
        const path: any = `uploads/evidences/audios/${audioName}`;
        const storageRef = ref(this.storage, path);

        try {
          await uploadString(storageRef, recordingData, 'base64');
          const photoURL: any = await getDownloadURL(storageRef);
          console.log(photoURL)
          this.files = photoURL;
          this.evidence_type = 'audio';
        } catch (error) {
          console.log("audio upload failed", error)
          this.files = null;
        }

        this.submitReportWithEvidence()
      }
    })
  }

  async submitReportWithEvidence() {

    //create the report template to submit with the recorded evidence
    this.reportForm.setValue({
      title: 'Case Title',
      description: 'Describe the corruption case in the evidence provided, thanks!',
      parties_involved: 'Wilberforce',
      time: "12:00",
      location: '12, 13',
      evidence: this.files,
      status: 'quick_draft',
      entry_category: 'select',
      evidence_type: this.evidence_type
    });

    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      spinner: 'circles',
      showBackdrop: true,
      duration: 3000
    });

    await loading.present();
      const result = this.reportService.addQuickReport(this.reportForm.value).then((data: any) => {
        console.log('Report added');
        this.report_id = data;
      });
      loading.dismiss();

      if(!result){
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem in uploading your image',
          buttons: ['OK']
        })

        await alert.present();
      } else {
        //alert that the report has been submitted
        const alert = await this.alertController.create({
          header: 'Report Submitted',
          message: 'Your report has been saved as a draft',
          buttons: ['OK']
        })
        alert.present();
      }
}

startRecording(){
  VoiceRecorder.requestAudioRecordingPermission();
  if(this.recording) return;

  this.recording = true;
  VoiceRecorder.startRecording();
  // calculate duration
  this.calculateDuration();
 }

 calculateDuration(){
  if(!this.recording){
    this.duration = 0;
    this.durationDisplay = ''
    return
  }

  this.duration++;
  const minutes = Math.floor(this.duration / 60);
  const seconds = (this.duration % 60).toString().padStart(2, '0');
  this.durationDisplay = `${minutes}:${seconds}`
  setTimeout(() => {
    this.calculateDuration()
  }, 1000)
}


}
