import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { Note } from '../note';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  notes: Note[] = [];
  constructor(
    private dataService: DataService,
    private alertcontroller: AlertController,
    private modalcontroller: ModalController) {
    this.dataService.getnotes().subscribe(res => {
      console.log(res);
      this.notes = res;
    })
  }

  ngOnInit() {
  }

  async openNoteDetail(note: Note) {
    const modal = await this.modalcontroller.create({
      component: ModalPage,
      componentProps: {
        id: note.id,
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5,

    });
    await modal.present();
  }

  async addNote() {
    const alert = await this.alertcontroller.create({
      header: 'Add Note',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title'
          },
        {
          name: 'text',
          type: 'textarea',
          placeholder: 'Learn Ionic'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (res) => {
            this.dataService.addNote({title: res.title, text: res.text})
          }
        }
      ]
    });

    await alert.present();
  }

}
