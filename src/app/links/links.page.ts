import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-links',
  templateUrl: './links.page.html',
  styleUrls: ['./links.page.scss'],
})
export class LinksPage implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private popoverController: PopoverController
    ) { }

  ngOnInit() {


  }

  logout(){
    this.authenticationService.logout()
    this.router.navigateByUrl('', { replaceUrl: true });
    this.popoverController.dismiss()
  }

}
