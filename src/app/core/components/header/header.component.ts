import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
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
