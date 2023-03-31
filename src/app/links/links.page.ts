import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-links',
  templateUrl: './links.page.html',
  styleUrls: ['./links.page.scss'],
})
export class LinksPage implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController
    ) { }

  ngOnInit() {
  }

  logout(){
    this.authenticationService.logout()
    this.router.navigateByUrl('', { replaceUrl: true });
    this.popoverController.dismiss()
  }

  async changeImage() {
    this.popoverController.dismiss()
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    })

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.authenticationService.uploadImage(image);
      loading.dismiss();

      if (!result) {
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


}
