import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';

export interface Report{
  id?: string;
  title: string;
  description: string;
  location: string;
  parties_involved: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private firestore: Firestore
  ) { }

  getReports():Observable<Report[]>{
    const reportsRef = collection(this.firestore, 'entries');
    return collectionData(reportsRef, { idField: 'id' }) as Observable<Report[]>;
  }

  getReportById(id: any): Observable<Report> {
    const reportdocRef = doc(this.firestore, `entries/${id}`);
    return docData(reportdocRef, { idField: 'id' }) as Observable<Report>;
  }

  addReport(report: Report){
    const reportsRef = collection(this.firestore, 'entries');
    return addDoc(reportsRef, report);
  }

  deleteReport(report: Report){
    const reportdocRef = doc(this.firestore, `entries/${report.id}`);
    return deleteDoc(reportdocRef);
  }

  updateReport(report: Report){
    const reportdocRef = doc(this.firestore, `entries/${report.id}`);
    return updateDoc(reportdocRef, { title: report.title, text: report.description, location: report.location, parties_involved: report.parties_involved});
  }

}
