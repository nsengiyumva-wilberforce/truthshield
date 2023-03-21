import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { getDownloadURL, ref, Storage, uploadString, uploadBytes, uploadBytesResumable  } from '@angular/fire/storage';
import { ReportService } from '../services/report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-recorder',
  templateUrl: './video-recorder.page.html',
  styleUrls: ['./video-recorder.page.scss'],
})
export class VideoRecorderPage implements OnInit {
  mediaRecorder: any;
  videoPlayer: any;
  isRecording = false;
  videos = [];
  device_height: any;
  files: any;
  evidence_type!: string;
  reportForm: FormGroup;
  report_id: any;


  @ViewChild('video')
  captureElement!: ElementRef;

  constructor(
    platform: Platform,
    private storage: Storage,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private loadingCtrl: LoadingController,
    ) {
    platform.ready().then(() => {
      this.device_height = platform.height();
      // console.log('Width: ' + platform.width());
      // console.log('Height: ' + platform.height());
    });

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

  ngOnInit() {
    this.recordVideo();
  }

  async recordVideo(){
    // Create a stream of video capturing
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
    },
    audio: true
  });
  console.log(stream)

  // Show the stream inside our video object
  this.captureElement.nativeElement.srcObject = stream;

  var options = {mimeType: 'video/webm'};
  this.mediaRecorder = new MediaRecorder(stream, options);
  let chunks: any[] = [];

      // Store the video on stop
      this.mediaRecorder.onstop = async (event: any) => {
        console.log("recording stopped, I am submitting the video")
        const videoBuffer: any = new Blob(chunks, { type: 'video/webm' });
        console.log(videoBuffer)
        const videoName = Date.now() + '.webm';
        const path: any = `uploads/evidences/videos/${videoName}`;
        const storageRef = ref(this.storage, path);

        try {
          const metadata = {
            contentType: 'video/webm'
          };
          //await uploadString(storageRef, videoBuffer, 'base64');
          uploadBytes(storageRef, videoBuffer).then((snapshot) => {
            console.log('snapshot', snapshot);
            //this.files = snapshot;
          });
          const uploadTask = uploadBytesResumable(storageRef, videoBuffer, metadata);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on('state_changed',
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            },
            (error) => {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  console.log("un authorized error")
                  break;
                case 'storage/canceled':
                  console.log("upload cancelled")
                  break;

                // ...

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  console.log("unknown error")
                  break;
              }
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                this.files = downloadURL;
                console.log("this.files", this.files)
                this.submitReportWithEvidence()
              });
            }
          );
        } catch (error) {
          console.log("audio upload failed", error)
          this.files = null;
        }



      }

   // Store chunks of recorded video
   this.mediaRecorder.ondataavailable = (event: any) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data)
    }
  }

  // Start recording wth chunks of data
  this.mediaRecorder.start(100);
  this.isRecording = true;

  console.log(this.mediaRecorder.state);
  console.log("stream:",stream)
}

stopRecord() {
  this.mediaRecorder.stop();
  this.mediaRecorder = null;
  this.captureElement.nativeElement.srcObject = null;
  this.isRecording = false;
}

  // Helper function
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    return reader.readAsDataURL(blob);
  });

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
      evidence_type: "video"
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

}
