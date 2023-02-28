import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, PopoverController } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  navigate: any;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private popoverController: PopoverController,
    private menu: MenuController
  ) {
    this.sideMenu();
  }

  sideMenu() {
    this.navigate =
    [
      {
        title : 'Home',
        url   : '/home',
        icon  : 'home'
      },
      {
        title : 'Reports',
        url   : '/reports',
        icon  : 'library'
      },
      {
        title : 'Games',
        url   : '/contacts',
        icon  : 'game-controller'
      },
      {
        title : 'Quiz',
        url   : '/start',
        icon  : 'help'
      },
      {
        title : 'Events and Workshops',
        url   : '/contacts',
        icon  : 'calendar'
      },
      {
        title : 'News',
        url   : '/contacts',
        icon  : 'newspaper'
      },
      {
        title : 'Statistics',
        url   : '/contacts',
        icon  : 'newspaper'
      },
      // {
      //   title : 'Profile',
      //   url   : '/contacts',
      //   icon  : 'person'
      // },
    ];
  }

  logout(){
    this.menu.toggle();
    this.authenticationService.logout()
    this.router.navigateByUrl('', { replaceUrl: true });
  }
}
