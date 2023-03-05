import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  quiz_categories: any[] = [
    {
      img: 'assets/imgs/voice.png',
      name:"Definitions and Terminology",
    },
    {
      img: 'assets/imgs/camera.png',
      name:"Legal Framework"
    },
    {
      img: 'assets/imgs/notes.png',
      name:"Case Studies"
    },
    {
      img: 'assets/imgs/hotspot.png',
      name:"Prevention and Detection:"
    },
    {
      img: 'assets/imgs/hotspot.png',
      name:"Ethics and Values"
    },
    {
      img: 'assets/imgs/hotspot.png',
      name:"International Anti-Corruption Efforts"
    },
  ]
  constructor() { }

  ngOnInit() {
  }


}
