import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { MessageComponent } from './message/message.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: ChatPageComponent
  }
];

@NgModule({
  declarations: [
    ChatPageComponent,
    ChatListComponent,
    MessageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  exports: [
    ChatPageComponent,
    ChatListComponent,
    MessageComponent
  ]
})
export class ChatModule { }
