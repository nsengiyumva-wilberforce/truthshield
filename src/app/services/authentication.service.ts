import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
    ){

  }

  async register({ email, password}: any){
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user
    } catch(e) {
      return null;
    }
  }

  async login({ email, password}: any){
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user
    } catch(e) {
      return null;
    }
  }

  //login anonymously
  async loginAnonymously(){
    try {
      const user = await signInAnonymously(this.auth);
      return user
    } catch(e) {
      return null;
    }
  }
  
  logout(){
    return signOut(this.auth)
  }

  getUserProfile(){
    const user: any = this.auth.currentUser;
    console.log(user)
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    console.log(docData(userDocRef))
    return docData(userDocRef);
  }

  async uploadImage(cameraFile: any){
    const user: any = this.auth.currentUser;
    const path: any = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const photoURL: any = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`)
      console.log("userDocRef:",userDocRef)
      await setDoc(userDocRef, {
        photoURL
      });

      return true;
    } catch(e) {
      return null;
    }
  }
}
