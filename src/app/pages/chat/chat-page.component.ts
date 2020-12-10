import { Component, OnInit } from '@angular/core';
import { FirestoreUsersService } from '../../core/services/firestore-users.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {

  constructor(private firestoreUsersService: FirestoreUsersService) { }

  ngOnInit(): void {
    this.firestoreUsersService.fetchUsers().subscribe(() => {
      console.log();
    });
  }

}
