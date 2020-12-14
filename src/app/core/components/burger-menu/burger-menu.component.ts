import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { BURGER_MENU } from '../../constants/burger-menu';
import { IBurgerMenuItem } from '../../../interfaces/i-burger-menu';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public burgerSettings: IBurgerMenuItem[] = BURGER_MENU;

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  public btnOnClick(item: IBurgerMenuItem): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item.title;
    this.dialog.open(ModalComponent, dialogConfig);
  }

}
