import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { myRoutes } from '../core/constants/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private route: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    return this.authService.getAuthUser$()
      .pipe(
        map((user): boolean => {
            if (user) {
              console.log(`hello ${user.displayName}`);
              return true;
            } else {
              this.route.navigate([myRoutes.logIn.routerPath]);
              console.log('войдите в систему');
            }
        })
      );
  }
}
