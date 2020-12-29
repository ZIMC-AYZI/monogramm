import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { BURGER_MENU } from '../../constants/burger-menu';
import { IBurgerMenuItem } from '../../../interfaces/i-burger-menu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public burgerSettings: IBurgerMenuItem[] = BURGER_MENU;
  public isAuthUser: Observable<any>;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.isAuthUser = this.authService.getAuthUser$();
  }

  public btnOnClick(item: IBurgerMenuItem): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item.title;
    this.dialog.open(ModalComponent, dialogConfig);
  }

}
