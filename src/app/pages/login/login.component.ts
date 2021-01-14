import {Component, OnInit, Self} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { NgOnDestroy } from '../../core/services/ng-on-destroy.service';
import { myRoutes } from '../../core/constants/router';
import { IUserDetail } from '../../interfaces/i-user';
import firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgOnDestroy]
})
export class LoginComponent implements OnInit {
  public authUser$: Observable<firebase.User> = this.authService.getAuthUser$();
  public user: any;

  registerForm: FormGroup;

  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.initRegistrationForm();
  }

  private initUser(): void {
    this.user = JSON.parse(localStorage.getItem('user')) || this.authUser;
  }
  private initRegistrationForm(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('', [
        Validators.email, Validators.required
      ]),
      password: new FormControl('', [
        Validators.required, Validators.minLength(6)
      ])
    });
  }

  private get authUser(): any {
    this.authUser$.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
    });
    return this.user;
  }

  login(): void {
    this.authService.loginViaGoogle()
      .pipe(
        takeUntil(this.ngOnDestroy$),
        switchMap((user: IUserDetail): Observable<void> => {
          return this.authService.setUserToFireData(user);
        })
      )
      .subscribe(() => {
        this.router.navigate([myRoutes.chatPage.routerPath]);
      });
  }
}
