import { Component, OnInit } from '@angular/core';
import {FirestoreUsersService} from '../../core/services/firestore-users.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
  users$: Observable<any>;
  constructor(
    private firestoreService: FirestoreUsersService
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  private fetchUsers(): void {
    this.users$ = this.firestoreService.getUsersList();
  }
}
