import { Injectable } from '@angular/core';
import { map, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/database';
import 'firebase/storage';
import { AngularFirestore } from '@angular/fire/firestore';


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
    private fireStore: AngularFirestore
  ) {
    this.user.next(this.afAuth.authState);
  }

  loginViaGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).pipe(
      map(({user}): any => {
        const currentUid = this.genUserNumber();
        return ({
          info: {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: currentUid,
            userGlobalId: user.uid
          },
          creationTime: Date.now()
        });
      })
    );
  }

  setUserToFireData(user): Observable<any> {
    return this.fireStore.collection('users').doc(user.info.email).get()
      .pipe(
        map((res) => {
          if (!res.exists) {
            this.fireStore.collection('users').doc(user.info.email).set(user);
          }
        })
      );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  // constructor(
  //   private fireStore: AngularFirestore,
  // ) { }
  //
  // login(): any {
  //   const provider = new firestore.auth.GoogleAuthProvider();
  //   provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  //
  //   firestore.auth().signInWithPopup(provider)
  //     .then(result => {
  //       const user = result.user;
  //       console.log(user);
  //       console.log(user.displayName);
  //       console.log(user.email);
  //       const currentUid = this.genUserNumber();
  //
  //       const setUserToDb$ = this.fireStore.collection('users').doc(user.email).get()
  //         .pipe(
  //           take(1),
  //           map((res) => {
  //             if (!res.exists) {
  //               this.fireStore.collection('users').doc(user.email).set({
  //                 info: {
  //                   displayName: user.displayName,
  //                   photoURL: user.photoURL,
  //                   uid: currentUid,
  //                   userGlobalId: user.uid
  //                 },
  //                 creationTime: Date.now()
  //               });
  //             }
  //           })
  //         );
  //       setUserToDb$.subscribe();
  //     })
  //     .catch(error => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       const email = error.email;
  //       const credential = error.credential;
  //       console.log(errorCode);
  //       console.log(errorMessage);
  //       console.log(email);
  //       console.log(credential);
  //     });
  // }

  private genUserNumber(): string {
    return (Math.floor(Math.random() * Math.floor(200))).toString();
  }
}
