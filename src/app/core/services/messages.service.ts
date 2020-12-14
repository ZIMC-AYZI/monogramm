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
  ) {
  }

  public startMessaging(collectionPath: string): void {
    this.fireStore.collection(collectionPath).doc('initialize chat').set({});
  }

  public setMessageToDb(message, uid, user): void {
    this.fireStore.collection(uid).doc(this.getRandomUidMessage()).set({
      text: message,
      author: {
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      date: Date.now()
    });
  }

  public getMessagesList(collectionPath: string): Observable<any> {
    return this.fireStore.collection(collectionPath, ref => ref.orderBy('date'))
      .snapshotChanges()
      .pipe(
        map((snaps) =>
          snaps.map((snap) => {
            return ({
              //   id: snap.payload.doc.id,
              ...(snap.payload.doc.data() as {}),
            });
          }),
        )
      );
  }

  private getRandomUidMessage(): string {
    let s = '';
    const abd = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const aL = abd.length;
    while (s.length < 20) {
      s += abd[Math.random() * aL];
    }
    return s;
  }
}
