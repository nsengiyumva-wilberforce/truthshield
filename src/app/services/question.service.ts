import { Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private firestore: Firestore,
  ) { }

  async addQuestion(question: any) {
    const reportsRef = collection(this.firestore, 'questions');
    const docRef = await addDoc(reportsRef, question);
    const docId = docRef.id;
    return Promise.resolve(docId);
  }

  getQuestionsByCategory(category: any): Observable<any[]> {
    const questiondocRef = query(collection(this.firestore, 'questions'), where('category', '==', category));
    return collectionData(questiondocRef, { idField: 'id' }) as Observable<any[]>;
  }
}
