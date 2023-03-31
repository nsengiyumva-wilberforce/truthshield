import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { ConnectionStatus, Network } from '@capacitor/network';


export interface Note {
  id?: string;
  title: string;
  text: string;
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private isConnected!: boolean;

  constructor(private firestore: Firestore,
    private toastController: ToastController) {
      this.isConnected = true;
      this.checkNetworkStatus();
     }

  getnotes():Observable<Note[]>{
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, { idField: 'id' }) as Observable<Note[]>;
  }

  getNoteById(id: any): Observable<Note> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  }
  addNote(note: Note){
    const notesRef = collection(this.firestore, 'notes');
    return addDoc(notesRef, note);
  }
  deleteNote(note: Note){
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return deleteDoc(noteDocRef);
  }
  updateNote(note: Note){
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return updateDoc(noteDocRef, { title: note.title, text: note.text});
  }

  async checkNetworkStatus() {
    Network.addListener('networkStatusChange', async (status) => {
      this.isConnected = status.connected;
    });

    const status = await Network.getStatus();
    this.isConnected = status.connected;
  }

  get isOnline(): boolean {
    return this.isConnected;
  }

  async presentToastcontroller(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      //add message color
      color: color,
      position: 'bottom'
    });

    await toast.present();
  }


}
