import { Component, Input, OnInit } from '@angular/core';

import { IMessage } from '../../../interfaces/i-message';
import * as _moment from 'moment';
import firestore from 'firebase';

const moment = _moment;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() msg: IMessage;
  @Input() authUser: firestore.User;
  constructor() { }

  ngOnInit(): void {
  }

  public setDataFormat(): string {
    return moment(this.msg.date).format('lll');
  }
}
