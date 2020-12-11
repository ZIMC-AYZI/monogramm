import {Component, Input, OnInit} from '@angular/core';

import * as _moment from 'moment';
import {IUserDetail} from '../../../interfaces/i-user';

const moment = _moment;

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  @Input() user: IUserDetail;

  public lastMessage = 'Show me your dicinson';

  constructor() { }

  ngOnInit(): void {
  }

  public showCurrentDialog(): void {
    console.log(1);
  }

  public trimMessage(str: string): string {
    return str.length > 12 ? `${ str.slice(0, 12) }...` : str;
  }

  public setDataFormat(): string {
    return moment(this.user.creationTime).format('dddd');
  }
}
