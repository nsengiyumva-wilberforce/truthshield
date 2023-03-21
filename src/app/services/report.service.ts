import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Camera, CameraResultType } from '@capacitor/camera';
import { collection } from '@firebase/firestore';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { Observable } from 'rxjs';

export interface Report {
  id?: string;
  title: string;
  description: string;
  location: string;
  parties_involved: string;
  time: string;
  evidence: any;
  status: string;
  entry_category: string;
  evidence_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getReports(): Observable<Report[]> {
    const reportsRef = collection(this.firestore, 'entries');
    return collectionData(reportsRef, { idField: 'id' }) as Observable<Report[]>;
  }

  getReportById(id: any): Observable<Report> {
    const reportdocRef = doc(this.firestore, `entries/${id}`);
    return docData(reportdocRef, { idField: 'id' }) as Observable<Report>;
  }

  getReportByEntryCategory(entry_category: any): Observable<Report[]> {
    const reportdocRef = query(collection(this.firestore, 'entries'), where('entry_category', '==', entry_category));
    return collectionData(reportdocRef, { idField: 'id' }) as Observable<Report[]>;
  }

  async addReport(report: Report) {
    const reportsRef = collection(this.firestore, 'entries');
    const docRef = await addDoc(reportsRef, report);
    const docId = docRef.id;
    return Promise.resolve(docId);
  }

  deleteReport(report: Report) {
    const reportdocRef = doc(this.firestore, `entries/${report.id}`);
    return deleteDoc(reportdocRef);
  }

  updateReport(report: Report) {
    const reportdocRef = doc(this.firestore, `entries/${report.id}`);
    return updateDoc(reportdocRef, { title: report.title, text: report.description, location: report.location, parties_involved: report.parties_involved, status: report.status, entry_category: report.entry_category });
  }


  async takePicture() {
    const image: any = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });
    const imageName = Date.now() + '.jpeg';
    const path: any = `uploads/evidences/files/${imageName}`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, image.base64String, 'base64');
      const photoURL: any = await getDownloadURL(storageRef);
      console.log(photoURL)
      return photoURL;
    } catch (error) {
    }
  }


  //add quick reports
  async addQuickReport(report: Report) {
    const reportsRef = collection(this.firestore, 'quick_entries');
    const docRef = await addDoc(reportsRef, report);
    const docId = docRef.id;
    return Promise.resolve(docId);
  }

  getQuickReports(): Observable<Report[]> {
    const reportsRef = collection(this.firestore, 'quick_entries');
    return collectionData(reportsRef, { idField: 'id' }) as Observable<Report[]>;
  }

  getQuickReportById(id: any): Observable<Report> {
    const reportdocRef = doc(this.firestore, `quick_entries/${id}`);
    return docData(reportdocRef, { idField: 'id' }) as Observable<Report>;
  }
}
