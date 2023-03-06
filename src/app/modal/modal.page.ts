import { Note } from './../services/data.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id!: string;
  note!: Note;
  constructor(
    private dataService: DataService,
    private modalcontroller: ModalController,
    private toastcontroller: ToastController
  ) { }

  ngOnInit() {
    this.dataService.getNoteById(this.id).subscribe(res => {
      console.log(res);
      this.note = res;
    });
  }

  async updateNote(){
    this.dataService.updateNote(this.note);
    const toast = await this.toastcontroller.create({
      message: 'Note updated',
      duration: 2000
    });
    toast.present();
  }

  async deleteNote(){
    await this.dataService.deleteNote(this.note);
    this.modalcontroller.dismiss();
  }

}
