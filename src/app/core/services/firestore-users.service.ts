import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IUserDetail} from '../../interfaces/i-user';
import firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class FirestoreUsersService {

  constructor(
    private fireStore: AngularFirestore
  ) {
  }

  getUsersList(): Observable<any> {
    return this.fireStore.collection('users')
      .valueChanges()
      .pipe(
        map((snaps) => snaps)
      );
  }

  getUserForInfoPage(uid: string): Observable<any> {
    return this.fireStore.collection('users')
      .valueChanges()
      .pipe(
        map((users: IUserDetail[]): IUserDetail[] => {
          return Object.assign({}, ...users.filter((user: IUserDetail): boolean => user.info.userGlobalId === uid));
        })
      );
  }

  setFollowerToDb(email, authUid): void {
    this.fireStore.collection('users').doc(email).update({
      followers: FieldValue.arrayUnion(authUid)
    });
  }

  removeFollowerFromDb(email, authUid): void {
    this.fireStore.collection('users').doc(email).update({
      followers: FieldValue.arrayRemove(authUid)
    });
  }

  getAllFollowers$(email): Observable<string[]> {
    return this.fireStore.collection('users')
      .doc(email)
      .valueChanges()
      .pipe(
        map((user: IUserDetail): string[] => user.followers)
      );
  }
}
