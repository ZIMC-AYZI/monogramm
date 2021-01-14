import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import {map, switchMap} from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/database';
import 'firebase/storage';
import { IUserDetail } from '../../interfaces/i-user';
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<Observable<firebase.User>> = new BehaviorSubject<Observable<firebase.User>>(null);
  private user$ = this.user
    .asObservable()
    .pipe(switchMap((user: Observable<firebase.User>) => user));

  constructor(
    private afAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
  ) {
    this.user.next(this.afAuth.authState);
  }

  loginViaGoogle(): Observable<IUserDetail> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).pipe(
      map(({user}: UserCredential): IUserDetail => {
        const currentUid = this.genUserNumber();
        return ({
          info: {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: currentUid,
            userGlobalId: user.uid
          },
          creationTime: Date.now(),
          followers: {}
        });
      })
    );
  }

  setUserToFireData(user: IUserDetail): Observable<void> {
    return this.fireStore.collection('users').doc(user.info.email).get()
      .pipe(
        map((res): void => {
          if (!res.exists) {
            this.fireStore.collection('users').doc(user.info.email).set(user);
          }
        })
      );
  }

  getAuthUser$(): Observable<firebase.User> {
    return this.user$;
  }

  public logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  private genUserNumber(): string {
    return (Math.floor(Math.random() * Math.floor(200))).toString();
  }
}
