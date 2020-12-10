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
      .snapshotChanges()
      .pipe(
        map((snaps) =>
          snaps.map((snap) => {
            return({
            //   id: snap.payload.doc.id,
              ...(snap.payload.doc.data() as {}),
            });
          }),
        )
      );
  }
}
