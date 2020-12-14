import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
}
