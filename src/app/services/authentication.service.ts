import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { User } from '../shared/auth';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private auth: Auth){

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

  logout(){
    return signOut(this.auth)
  }
}
