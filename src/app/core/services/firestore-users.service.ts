import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IFollowers, IUserDetail} from '../../interfaces/i-user';
import firebase from 'firebase';

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
        map((users) => users)
      );
  }

  getUserForInfoPage(uid: string): Observable<IUserDetail> {
    return this.fireStore.collection('users')
      .valueChanges()
      .pipe(
        map((users: IUserDetail[]): IUserDetail => {
          return Object.assign({}, ...users.filter((user: IUserDetail): boolean => user.info.userGlobalId === uid));
        })
      );
  }

  setFollowerToDb(email, authUid): void {
    const collectionState = this.fireStore.collection('users').doc(email).get();
    collectionState
      .pipe(
        take(1),
        map((collection) => collection.data())
      ).subscribe((collection: IUserDetail) => {
      const followers = collection.followers;
      const newFollower = {};
      newFollower[authUid] = authUid;

      this.fireStore.collection('users').doc(email).update({
        followers: Object.assign({}, followers, newFollower)
      });
    });
  }

  removeFollowerFromDb(email, authUid): void {
    const collectionState = this.fireStore.collection('users').doc(email).get();
    collectionState
      .pipe(
        take(1),
        map((collection) => collection.data())
      ).subscribe((collection: IUserDetail) => {
      const followers = collection.followers;
      delete followers[authUid];

      this.fireStore.collection('users').doc(email).update({
        followers: Object.assign({}, followers)
      });
    });
  }

  getAllFollowers$(email): Observable<IFollowers> {
    return this.fireStore.collection('users')
      .doc(email)
      .valueChanges()
      .pipe(
        map((user: IUserDetail): IFollowers => user.followers)
      );
  }
}
