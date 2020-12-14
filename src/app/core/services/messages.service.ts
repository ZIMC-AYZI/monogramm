import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {delay, map, take, takeUntil, tap} from 'rxjs/operators';
import {Observable, of, timer} from 'rxjs';

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
    })
      .then(() => {
        of(null)
          .pipe(
            take(1),
            delay(0),
            tap(() => {
              this.scrollMessages();
            })
          ).subscribe();
      });
  }

  public getMessagesList(collectionPath: string): Observable<any> {
    return this.fireStore.collection(collectionPath, ref => ref.orderBy('date'))
      .valueChanges()
      .pipe(
        map((snaps) => {
            return snaps;
        }),
        delay(0),
        tap(() => {
          this.scrollMessages();
        })
      );
  }

  private scrollMessages(): void {
    const box = document.querySelector('.userMessage-wrapper');
    box.scrollTop = box.scrollHeight;
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
