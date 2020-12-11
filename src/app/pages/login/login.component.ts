import { Component, OnInit, Self } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { NgOnDestroy } from '../../core/services/ng-on-destroy.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { myRoutes } from '../../core/constants/router';
import {Observable} from 'rxjs';
import {IUserDetail} from '../../interfaces/i-user';
import firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgOnDestroy]
})
export class LoginComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('',[
        Validators.email, Validators.required
      ]),
      password: new FormControl('', [
        Validators.required, Validators.minLength(6)
      ])
    });
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
