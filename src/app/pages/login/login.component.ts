import { Component, OnInit, Self } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { myRoutes } from '../../core/constants/router';
import { NgOnDestroy } from '../../core/services/ng-on-destroy.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgOnDestroy]
})
export class LoginComponent implements OnInit {

  constructor(
    @Self() private ngOnDestroy$: NgOnDestroy,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.authService.loginViaGoogle()
      .pipe(
        takeUntil(this.ngOnDestroy$),
        switchMap((user: any): any => {
         return this.authService.setUserToFireData(user);
        })
      )
      .subscribe(() => {
        this.router.navigate([myRoutes.chatPage.routerPath]);
      });
  }
}
