import {
  AfterViewInit,
  Component,
  ElementRef, HostListener, Inject,
  OnInit,
  QueryList,
  Self,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { MessagesService } from '../../core/services/messages.service';
import { Observable, of, timer } from 'rxjs';
import { IUserDetail } from '../../interfaces/i-user';
import { IMessage } from '../../interfaces/i-message';
import { AuthService } from '../../core/services/auth.service';
import firebase from 'firebase';
import firestore from 'firebase';
import { map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { NgOnDestroy } from '../../core/services/ng-on-destroy.service';
import { FormControl, Validators } from '@angular/forms';
import { log } from 'util';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  providers: [NgOnDestroy]
})
export class ChatPageComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;

  public users$: Observable<IUserDetail[]>;
  public messages$: Observable<IMessage[]>;
  public authUser$: Observable<firebase.User>;
  public dialogCompanion: IUserDetail;
  public userMessage = '';
  public messageControl = new FormControl('', [
    Validators.required,
    Validators.pattern('/^[^\\s]+$/')
  ]);
  public basicSize = 10;

  @HostListener('scroll', ['$event'])
  public onScroll(event: any): void {
    if (!event.target.scrollTop) {
      this.basicSize += 10;
      this.genDialogUid()
        .pipe(
          takeUntil(this.ngOnDestroy$),
          tap((collectionPath: string) => {
            this.messages$.pipe(
              mergeMap((initialState: IMessage[]): Observable<IMessage[]> => {
                console.log(initialState);
                return  this.messagesService.getMessagesList(collectionPath, this.basicSize)
                  .pipe(
                    map((newState) => {
                      console.log(newState);
                      console.log([...initialState, ...newState]);
                      return [...initialState, ...newState];
                    })
                  );
              })
            ).subscribe();
          })
        ).subscribe();
    }
  }

  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private firestoreUsersService: FirestoreUsersService,
    private messagesService: MessagesService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.fetchAuthUser();
    this.fetchUsers();
  }

  ngAfterViewInit(): void {
    // this.scrollContainer = this.scrollFrame.nativeElement;
    // this.itemElements.changes
    //   .pipe(
    //     takeUntil(this.ngOnDestroy$)
    //   )
    //   .subscribe(() => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    timer(100)
      .pipe(
        take(1)
      ).subscribe(() => {
      this.scrollContainer.scroll({
        top: this.scrollContainer.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  private loadMoreMessages(): Observable<any> {
    return of(window.onscroll);
  }

  public showDialogWithUser(user: IUserDetail): void {
    this.userMessage = '';
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

  public trackByFn(index, item): void {
    return item.date;
  }

  public sendMessage(): void {
      this.genDialogUid()
        .pipe(
          takeUntil(this.ngOnDestroy$),
          switchMap((uid: string ): Observable<firebase.User> => {
            return this.authUser$
              .pipe(
                tap((user: firestore.User): void  => {
                  this.messagesService.setMessageToDb(this.userMessage, uid, user);
                })
              );
          })
        ).subscribe(() => {
        console.log(this.userMessage);
        this.userMessage = '';
      });
  }

  private fetchUsers(): void {
    this.users$ = this.firestoreUsersService.getUsersList()
      .pipe(
        switchMap((users: IUserDetail[]): Observable<IUserDetail[]> => {
          return this.authUser$
            .pipe(
              map((user: firestore.User): IUserDetail[] => {
                return users.filter(el => el.info.uid !== user.uid);
              })
            );
        })
      );
  }

  private fetchMessages(collectionPath: string): void {
    this.messages$ = this.messagesService.getMessagesList(collectionPath, this.basicSize);
  }

  private fetchAuthUser(): void {
    this.authUser$ = this.authService.getAuthUser$()
      .pipe(
        switchMap((user: firestore.User): Observable<firestore.User> => {
          return this.firestoreUsersService.getUsersList()
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
}
