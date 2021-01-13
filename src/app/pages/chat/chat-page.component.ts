import {
  Component,
  ElementRef, HostListener,
  OnInit,
  QueryList,
  Self,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { MessagesService } from '../../core/services/messages.service';
import {BehaviorSubject, Observable, of, timer} from 'rxjs';
import { IUserDetail, IUserInfo } from '../../interfaces/i-user';
import { IMessage } from '../../interfaces/i-message';
import { AuthService } from '../../core/services/auth.service';
import firebase from 'firebase';
import firestore from 'firebase';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { NgOnDestroy } from '../../core/services/ng-on-destroy.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  providers: [NgOnDestroy]
})
export class ChatPageComponent implements OnInit {
  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  public messageSub: BehaviorSubject<Observable<IMessage[]>> = new BehaviorSubject<Observable<IMessage[]>>(null);
  public users$: Observable<IUserDetail[]>;
  public messages$ = this.messageSub
    .asObservable()
    .pipe(switchMap((messages: Observable<IMessage[]>) => messages));
  public authUser$: Observable<firebase.User>;
  public dialogCompanion: IUserDetail;
  // public userMessage = '';
  public currentForm = new FormGroup({});
  public messageControl: FormControl;
  public basicSize = 10;

  private scrollContainer: any;

  @HostListener('scroll', ['$event'])
  public onScroll(event: any): void {
    if (!event.target.scrollTop) {
      this.basicSize += 10;
      this.genDialogUid()
        .pipe(
          takeUntil(this.ngOnDestroy$),
          tap((collectionPath: string): void => {
            this.messageSub.next(this.messagesService.getMessagesList(collectionPath, this.basicSize));
          }
          )
        ).subscribe();
    }
  }
  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private firestoreUsersService: FirestoreUsersService,
    private messagesService: MessagesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.messageSub.next(of([]));
  }

  ngOnInit(): void {
    this.fetchAuthUser();
    this.fetchUsers();
    this.initForm();
  }

  public initForm(): void {
    this.messageControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/\S/)
    ]);
    this.currentForm.addControl('message-control', this.messageControl);

  }

  private scrollToBottom(time): void {
    this.scrollContainer = this.scrollFrame.nativeElement;
    timer(time)
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

  public showDialogWithUser(user: IUserDetail): void {
    this.basicSize = 10;
    this.messageControl.reset();
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
                this.messagesService.setMessageToDb(this.messageControl.value, uid, user);
              })
            );
        })
      ).subscribe(() => {
      this.messageControl.reset();
    });
    this.scrollToBottom(100);
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
    this.messageSub.next(this.messagesService.getMessagesList(collectionPath, this.basicSize));
    this.scrollToBottom(500);
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

  public openProfileCompanion(): void {
      this.router.navigate(['/userPage', this.dialogCompanion.info.userGlobalId]);
  }

  public openProfileAuthUser(): void {
    this.authService.getAuthUser$().pipe(
      take(1),
      map((user) => {
        return user.uid;
      })
    ).subscribe((uid) => {
      this.router.navigate(['/userPage', uid]);
    });
  }
}
