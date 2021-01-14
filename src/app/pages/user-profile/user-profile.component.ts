import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { IUserDetail } from '../../interfaces/i-user';
import firebase from 'firebase';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
public infoUser$: Observable<IUserDetail>;
public authUserUid: string;
public isFollowed: boolean;
public opponentUid: string;
public followers$: Observable<object>;
public keys = Object.keys;
private opponentEmail: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private fireStoreUsersService: FirestoreUsersService
  ) { }

  ngOnInit(): void {
    this.fetchUserInfo();
    this.fetchAuthUser();
    this.fetchFollowers();
  }

  private fetchUserInfo(): void {
    this.infoUser$ = this.activatedRoute.paramMap.pipe(
      take(1),
      tap((params): void => {
        this.opponentUid = params.get('uid');
      }),
      switchMap((): Observable<any> => this.fireStoreUsersService.getUserForInfoPage(this.opponentUid)),
      tap(({ info }: IUserDetail) => {
        this.opponentEmail = info.email;
      })
    );
  }

  private fetchAuthUser(): void {
    this.authService.getAuthUser$().pipe(
      take(1),
      tap((user: firebase.User) => {
        this.authUserUid = user.uid;
      })
    ).subscribe();
  }

  private fetchFollowers(): void {
    this.followers$ = this.infoUser$.pipe(
      take(1),
      switchMap((opponent: IUserDetail): Observable<object> => {
        return this.fireStoreUsersService.getAllFollowers$(opponent.info.email);
      }),
      tap((followers: object) => {
        this.isFollowed = !!followers[this.authUserUid];
      })
    );
    this.followers$.subscribe();
  }

  public follow(): void {
    this.fireStoreUsersService.setFollowerToDb(this.opponentEmail, this.authUserUid);
  }

  public unFollow(): void {
    this.fireStoreUsersService.removeFollowerFromDb(this.opponentEmail, this.authUserUid);
  }
}
