import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page.component';
import { ChatListComponent } from './chat-list/chat-list.component';


const routes: Routes = [
  {
    path: '',
    component: ChatPageComponent
  }
];

@NgModule({
  declarations: [
    ChatPageComponent,
    ChatListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ChatPageComponent,
    ChatListComponent
  ]
})
export class ChatModule { }
