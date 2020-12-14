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

  public setMessageToDb(message, collectionPath, user): void {
    this.fireStore.collection(collectionPath).doc(this.getRandomUidMessage()).set({
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
      .valueChanges()
      .pipe(
        map((snaps) => {
            console.log(snaps);
            return snaps;
        })
      );
  }

  private getRandomUidMessage(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
