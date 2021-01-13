import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IUserDetail, IUserInfo } from '../../../interfaces/i-user';
import firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public authUser$: Observable<firebase.User>;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authUser$ = this.authService.getAuthUser$();
  }

  public openProfile(): void {
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
