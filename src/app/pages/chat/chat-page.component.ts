import { Component, OnInit, Self } from '@angular/core';

import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { MessagesService } from '../../core/services/messages.service';
import { Observable, of, Subscription, timer } from 'rxjs';
import { IUserDetail } from '../../interfaces/i-user';
import { IMessage } from '../../interfaces/i-message';
import { AuthService } from '../../core/services/auth.service';
import firebase from 'firebase';
import { concatMap, map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';
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

  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private firestoreUsersService: FirestoreUsersService,
    private messagesService: MessagesService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchMessages();
    this.fetchAuthUser();
  }

  private fetchUsers(): void {
    this.users$ = this.firestoreUsersService.getUsersList();
  }

  private fetchMessages(): void {
    this.messages$ = this.messagesService.getMessagesList('92');
    this.scrollMessages();
  }

  private fetchAuthUser(): void {
    this.authUser$ = this.authService.getAuthUser$();
  }

  public scrollMessages(): void {
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
