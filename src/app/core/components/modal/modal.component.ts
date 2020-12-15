import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  myControl = new FormControl();
  public fakeArray: any = [
    {
      name: 'dima',
      img: 'https://img.freepik.com/free-photo/portrait-of-white-man-isolated_53876-40306.jpg?size=626&ext=jpg',
      online: '2 hours ago'
    },
    {
      name: 'stas',
      img: 'https://img.freepik.com/free-photo/portrait-of-white-man-isolated_53876-40306.jpg?size=626&ext=jpg',
      online: '1 hours ago'
    },
    {
      name: 'Kateryna',
      img: 'https://htstatic.imgsmail.ru/pic_image/fa456317efc3741f743a553cf0be04c3/840/630/1238880/',
      online: 'online'
    },
    {
      name: 'Valerya',
      img: 'https://htstatic.imgsmail.ru/pic_image/f6b4cd4441e1bd20e9b8911da89f57a2/840/630/1238882/',
      online: '10 min ago'
    }
  ];
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
