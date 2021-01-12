import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IUserDetail, IUserInfo } from '../../interfaces/i-user';

@Injectable({
  providedIn: 'root'
})
export class FirestoreUsersService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

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
        take(1),
        map((users: IUserDetail[]): IUserDetail[] => {
          return Object.assign({}, ...users.filter((user: IUserDetail): boolean => user.info.userGlobalId === uid));
        })
      );
  }
}
