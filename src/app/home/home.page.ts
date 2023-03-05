import { AuthenticationService } from './../services/authentication.service';
import { LinksPage } from './../links/links.page';
import { Component, ViewChild } from '@angular/core';
import { IonSlides, PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera/dist/esm/definitions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  profile = null;

  subjects: any[] = [
    {
      img: 'assets/imgs/voice.png',
      name:"Audio"
    },
    {
      img: 'assets/imgs/camera.png',
      name:"Video"
    },
    {
      img: 'assets/imgs/notes.png',
      name:"Notes"
    },
    {
      img: 'assets/imgs/hotspot.png',
      name:"Hotspots"
    },
  ]
  constructor(
    private authenticationService: AuthenticationService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
  }
  ngOnInit(){
    this.authenticationService.getUserProfile().subscribe((data: any) => {
      this.profile = data;
      console.log(data)
    })
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
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
      }
    }
  }

}
