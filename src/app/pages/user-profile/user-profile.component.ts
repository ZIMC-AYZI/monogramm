import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { Observable } from 'rxjs';
import { IUserDetail, IUserInfo } from '../../interfaces/i-user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
public infoUser$: Observable<IUserDetail>;
public opponentUid: string;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private fireStoreUsersService: FirestoreUsersService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      take(1),
      map((params) => {
        this.opponentUid = params.get('uid');
      })
    ).subscribe(() => {
      this.infoUser$ = this.fireStoreUsersService.getUserForInfoPage(this.opponentUid);
    });
  }

  public follow(): void {
    this.infoUser$.pipe(
      take(1),
      map((user) => {
        return user.info.email;
      })
    ).subscribe((email) => {
      this.fireStoreUsersService.setFollowerToDb(email, this.opponentUid);
    });
  }
}
