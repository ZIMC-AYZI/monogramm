import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreUsersService {
  users: Observable<any[]>;

  constructor(
    private db: AngularFirestore,
    private itemsCollection: AngularFirestoreCollection
  ) {
  }

  public fetchUsers(): Observable<any> {
    this.db.collection('users');
    this.itemsCollection = this.db.collection('users');
    this.users = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        console.log(data)
        const id = a.payload.doc.id;
        console.log(data);
        return {...data};
      })));
    return this.users;
  }
}
