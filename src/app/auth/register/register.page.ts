import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: any;
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  get email(){
    return this.credentials.get('email');
  }

  get password(){
    return this.credentials.get('email');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  async register(){
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authenticationService.register(this.credentials.value);
    await loading.dismiss();

    if(user){
      this.router.navigateByUrl('/home', { replaceUrl: true})
    } else{
      console.log("registration failed")
      this.showAlert('Registration failed', 'Please try again')
    }
  }



	async showAlert(header: string, message:string) {
		const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}

}
