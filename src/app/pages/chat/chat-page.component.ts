import { Component, OnInit } from '@angular/core';

import { FirestoreUsersService } from '../../core/services/firestore-users.service';
import { MessagesService } from '../../core/services/messages.service';
import { Observable } from 'rxjs';
import { IUserInfo } from '../../interfaces/i-user';
import { IMessage } from '../../interfaces/i-message';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  public users$: Observable<IUserInfo>;
  public messages$: Observable<IMessage>;

  constructor(
    private firestoreUsersService: FirestoreUsersService,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchMessages();
  }

  private fetchUsers(): void {
    this.users$ = this.firestoreUsersService.getUsersList();
  }

  private fetchMessages(): void {
    this.messages$ = this.messagesService.getMessagesList('92');
  }
}
