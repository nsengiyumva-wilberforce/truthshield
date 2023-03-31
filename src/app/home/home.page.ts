import { LinksPage } from './../links/links.page';
import { Capacitor } from '@capacitor/core';
import { AuthenticationService } from './../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { Component } from '@angular/core';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera/dist/esm/definitions';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { DataService } from '../services/data.service';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile: any = null;
  placeholder: any;
  reportForm!: FormGroup;
  latitude: any;
  longitude: any;
  location: any;
  files: any;
  report_id: any;
  recording: boolean = false;
  durationDisplay = ''
  duration = 0;
  evidence_type!: string;
  capturedFile: any;
  base64Video!: string;
  private win: any = window;

  highlightSlideOpts = {
    slidesPerView: 1.05,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  };

  questions = [{"question": "What are the ethical values that are violated when an official takes a bribe in Uganda?", "category": "Ethics and Values", "answers": [{"answer": "Honesty and integrity", "correct": true}, {"answer": "Loyalty and patriotism", "correct": false}, {"answer": "Respect and accountability", "correct": false}, {"answer": "Transparency and efficiency", "correct": false}]},

  {"question": "What ethical principle is violated when an official embezzles public funds in Uganda?", "category": "Ethics and Values", "answers": [{"answer": "Justice", "correct": true}, {"answer": "Loyalty", "correct": false}, {"answer": "Respect", "correct": false}, {"answer": "Transparency", "correct": false}]},

  {"question": "What is the role of ethics in the fight against corruption in Uganda?", "category": "Ethics and Values", "answers": [{"answer": "To promote moral behavior and prevent unethical conduct", "correct": true}, {"answer": "To support political campaigns and lobby for reforms", "correct": false}, {"answer": "To provide legal guidance and enforce compliance", "correct": false}, {"answer": "To facilitate public participation and accountability", "correct": false}]},

  {"question": "What ethical issue arises when an official awards a government contract to a company owned by their relative in Uganda?", "category": "Ethics and Values", "answers": [{"answer": "Nepotism", "correct": true}, {"answer": "Bribery", "correct": false}, {"answer": "Favoritism", "correct": false}, {"answer": "Misuse of power", "correct": false}]},

  {"question": "What is the impact of corruption on ethical values in Uganda?", "category": "Ethics and Values", "answers": [{"answer": "It undermines trust, morality, and social justice", "correct": true}, {"answer": "It promotes transparency, efficiency, and accountability", "correct": false}, {"answer": "It encourages civic participation, responsibility, and patriotism", "correct": false}, {"answer": "It fosters innovation, competition, and economic growth", "correct": false}]},

  {"question": "What ethical obligation do journalists have in Uganda in exposing corruption?", "category": "Ethics and Values", "answers": [{"answer": "To report accurately, objectively, and fairly on corruption", "correct": true}, {"answer": "To protect government officials from public scrutiny", "correct": false}, {"answer": "To support government campaigns against corruption", "correct": false}, {"answer": "To sensationalize and exaggerate corruption stories for media ratings", "correct": false}]},

  {"question": "What is the role of civil society in promoting ethical values in the fight against corruption in Uganda?", "category": "Ethics and Values", "answers": [{"answer": "To advocate for transparency, accountability, and public participation", "correct": true}, {"answer": "To monitor government programs and projects", "correct": false}, {"answer": "To provide legal aid and protection for whistleblowers", "correct": false}, {"answer": "To engage in political campaigns and elections", "correct": false}]},
  {"question": "What ethical principle requires public officials to make decisions based on objective criteria, without favoring one group or individual over another?", "category": "Ethics and Values", "answers": [{"answer": "Fairness", "correct": true}, {"answer": "Transparency", "correct": false}, {"answer": "Integrity", "correct": false}, {"answer": "Public interest", "correct": false}]},

  {"question": "What is the term used to describe the act of disclosing information about corrupt practices in order to hold wrongdoers accountable?", "category": "Ethics and Values", "answers": [{"answer": "Whistleblowing", "correct": true}, {"answer": "Embezzlement", "correct": false}, {"answer": "Bribery", "correct": false}, {"answer": "Money laundering", "correct": false}]},

  {"question": "What is the name of the Ugandan law that criminalizes bribery and corruption?", "category": "Ethics and Values", "answers": [{"answer": "The Anti-Corruption Act", "correct": true}, {"answer": "The Public Procurement and Disposal of Public Assets Act", "correct": false}, {"answer": "The Leadership Code Act", "correct": false}, {"answer": "The Whistleblowers Protection Act", "correct": false}]},

  {"question": "What ethical principle requires public officials to act in the best interest of the public, even if it conflicts with their personal interests?", "category": "Ethics and Values", "answers": [{"answer": "Accountability", "correct": false}, {"answer": "Transparency", "correct": false}, {"answer": "Integrity", "correct": false}, {"answer": "Public interest", "correct": true}]},

  {"question": "What is the name of the Ugandan organization that promotes ethical values and practices in public service?", "category": "Ethics and Values", "answers": [{"answer": "Uganda Ethics and Integrity Commission", "correct": false}, {"answer": "Uganda Anti-Corruption Coalition", "correct": false}, {"answer": "Inspectorate of Government", "correct": false}, {"answer": "Public Procurement and Disposal of Public Assets Authority", "correct": true}]},

  {"question": "What ethical principle emphasizes the importance of honesty, integrity, and transparency in public service?", "category": "Ethics and Values", "answers": [{"answer": "Accountability", "correct": false}, {"answer": "Fairness", "correct": false}, {"answer": "Integrity", "correct": true}, {"answer": "Responsibility", "correct": false}]},

  {"question": "What is the ethical principle that requires Ugandan public officials to disclose conflicts of interest?", "category": "Ethics and values", "answers": [{"answer": "Integrity", "correct": false}, {"answer": "Transparency", "correct": true}, {"answer": "Accountability", "correct": false}, {"answer": "Honesty", "correct": false}]},

  {"question": "What is the ethical value that emphasizes the importance of treating all individuals equally?", "category": "Ethics and values", "answers": [{"answer": "Respect for persons", "correct": true}, {"answer": "Integrity", "correct": false}, {"answer": "Honesty", "correct": false}, {"answer": "Fairness", "correct": false}]},

  ]
  constructor(
    private authenticationService: AuthenticationService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private mediaCapture: MediaCapture,
    private file: File,
    private popoverController: PopoverController,
    private dataService: DataService,
    private questionService: QuestionService
  ) {
  }
  ngOnInit() {
    //iterate through questions and insert them into the database
    for (let index = 0; index < this.questions.length; index++) {
      const element = this.questions[index];
      this.questionService.addQuestion(element).then((data: any) => {
        console.log(data);
      })

    }
    console.log(this.dataService.isOnline)
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


  async addPhotoToGallery() {
    //take the photo and convert it to blob
    if (this.dataService.isOnline) {
      this.reportService.takePicture().then((data) => {
        this.files = data;
        this.evidence_type = 'image';
        this.submitReportWithEvidence()
      })
    } else {
      //show the snackbar
      this.dataService.presentToastcontroller('No internet connection', 'danger');
    }
  }

  //stop recording and upload the audio to firebase storage
  async addAudioToGallery() {
    //create a loading spinner
    const uploading_audio = await this.loadingCtrl.create({
      message: 'Uploading Audio...',
      spinner: 'circles',
    });

    //alert audio upload failure
    const audio_upload_failed = await this.alertController.create({
      header: 'Audio Upload Failed',
      message: 'There was a problem in uploading your audio',
      buttons: ['OK']
    })

    if (!this.recording) return;
    this.recording = false;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {

      if (result.value && result.value.recordDataBase64) {
        const recordingData = result.value.recordDataBase64;
        const audioName = Date.now() + '.wav';
        const path: any = `uploads/evidences/audios/${audioName}`;
        const storageRef = ref(this.storage, path);

        //start the loading spinner
        uploading_audio.present();
        try {
          await uploadString(storageRef, recordingData, 'base64').then(() => {
            uploading_audio.dismiss();
          });
          const photoURL: any = await getDownloadURL(storageRef);
          console.log(photoURL)
          this.files = photoURL;
          this.evidence_type = 'audio';
        } catch (error) {
          console.log("audio upload failed", error)
          uploading_audio.dismiss().then(() => {
            audio_upload_failed.present();
          })
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

    //alert that the report has been submitted
    const alert = await this.alertController.create({
      header: 'Report Submitted',
      message: 'Your report has been saved as a draft',
      buttons: ['OK']
    })

    const loading = await this.loadingCtrl.create({
      message: 'Submitting Report...',
      spinner: 'circles',
      showBackdrop: true,
      duration: 3000
    });

    await loading.present();
    const result = this.reportService.addQuickReport(this.reportForm.value).then(async (data: any) => {
      console.log('Report added');
      this.report_id = data;
      loading.dismiss();
      alert.present();

    });


    if (!result) {
      const alert = await this.alertController.create({
        header: 'Upload failed',
        message: 'There was a problem in uploading your image',
        buttons: ['OK']
      })

      await alert.present();
    }
  }

  startRecording() {
    if(this.dataService.isOnline){
    VoiceRecorder.requestAudioRecordingPermission();
    if (this.recording) return;

    this.recording = true;
    VoiceRecorder.startRecording();
    // calculate duration
    this.calculateDuration();
    }else{
      //show the snackbar
      this.dataService.presentToastcontroller('No internet connection', 'danger');
    }
  }

  calculateDuration() {
    if (!this.recording) {
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

  //hack the fileReader plugin to read the file as a base64 string
  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || fileReader;
  }

  async recordVideo() {
    if(this.dataService.isOnline){
    //alert that the report has been submitted
    const alert = await this.alertController.create({
      header: 'Report Submitted',
      message: 'Your report has been saved as a draft',
      buttons: ['OK']
    })

    //create an alert to show failure in recording the video
    const record_video_failure = await this.alertController.create({
      header: 'Video Recording Failed',
      message: 'There was a problem in recording your video',
      buttons: ['OK']
    })

    //create a loading spinner
    const loading = await this.loadingCtrl.create({
      message: 'submitting the video',
      spinner: 'circles',
    });

    //start capturing video
    this.mediaCapture.captureVideo().then(
      async (data: MediaFile[] | CaptureError) => {
        if (Array.isArray(data)) {

          await loading.present();

          const path = 'DCIM/Camera/' + data[0].name;
          const contents = await Filesystem.readFile({
            path: path,
            directory: Directory.ExternalStorage,
          });

          //send the video to firebase storage
          this.reportService.uploadVideo(contents.data).then((data: any) => {
            console.log(data);
            this.files = data;
            this.evidence_type = 'video';
            //submit the report with the video evidence
            this.submitReportWithEvidence().then(() => {

              loading.dismiss().then(() => {
                alert.present();
              }, (err) => {
                //dismiss the loading spinner
                loading.dismiss().then(() => {
                  //alert failure in submitting the report
                  record_video_failure.present();
                });
              });
            });

          })
        }
      },
      async (err: CaptureError) => {
        await loading.dismiss().then(() => {
          record_video_failure.present();
        });

      }
    );
    }else{
      //show the snackbar
      this.dataService.presentToastcontroller('No internet connection', 'danger');
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LinksPage,
      event: ev,
      mode: 'ios',
      translucent: true
    })
    await popover.present()
  }
}
