import {Component, OnInit, Self} from '@angular/core';

import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { MessagesService } from '../../core/services/messages.service';
import { Observable, timer } from 'rxjs';
import { IUserDetail } from '../../interfaces/i-user';
import { IMessage } from '../../interfaces/i-message';
import { AuthService } from '../../core/services/auth.service';
import firebase from 'firebase';
import firestore from 'firebase';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NgOnDestroy } from '../../core/services/ng-on-destroy.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  providers: [NgOnDestroy]
})
export class ChatPageComponent implements OnInit {
  public users$: Observable<IUserDetail[]>;
  public messages$: Observable<IMessage[]>;
  public authUser$: Observable<firebase.User>;
  public dialogCompanion: IUserDetail;

  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private firestoreUsersService: FirestoreUsersService,
    private messagesService: MessagesService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchAuthUser();
  }

  public showDialogWithUser(user: IUserDetail): void {
    this.dialogCompanion = user;
    this.genDialogUid()
      .pipe(
        takeUntil(this.ngOnDestroy$),
        tap((collectionPath: string) => {
          this.messagesService.startMessaging(collectionPath);
          this.fetchMessages(collectionPath);
        })
      ).subscribe();
  }

  private fetchUsers(): void {
    this.users$ = this.firestoreUsersService.getUsersList();
  }

  private fetchMessages(collectionPath: string): void {
    this.messages$ = this.messagesService.getMessagesList(collectionPath);
    this.scrollMessages();
  }

  private fetchAuthUser(): void {
    this.authUser$ = this.authService.getAuthUser$()
      .pipe(
        switchMap((user: firestore.User): Observable<firestore.User> => {
          return this.users$
            .pipe(
              map((users: IUserDetail[]): firestore.User => {
                let result = users.map((userFromDb: IUserDetail): firestore.User => {
                  if (userFromDb.info.userGlobalId === user.uid) {
                    return {
                      ...user,
                      uid: userFromDb.info.uid
                    };
                  }
                });
                result = result.filter(el => el !== undefined);
                return ({
                  ...result[0]
                });
              })
            );
        })
      );
  }

  private genDialogUid(): Observable<string> {
    return this.authUser$
      .pipe(
        takeUntil(this.ngOnDestroy$),
        map((user: firestore.User): string => {
          return (+user.uid + +this.dialogCompanion.info.uid).toString();
        })
      );
  }

  private scrollMessages(): void {
    timer(1000)
      .pipe(
        takeUntil(this.ngOnDestroy$),
        tap(() => {
          const box = document.querySelector('.userMessage-wrapper');
          box.scrollTop = box.scrollHeight;
        })
      ).subscribe();
  }
}
