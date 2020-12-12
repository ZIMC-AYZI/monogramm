import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

  startMessaging(collectionPath: string): void {
    this.fireStore.collection(collectionPath).doc('initialize chat').set({});
  }

  getMessagesList(collectionPath: string): Observable<any> {
    return this.fireStore.collection(collectionPath, ref => ref.orderBy('date'))
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
