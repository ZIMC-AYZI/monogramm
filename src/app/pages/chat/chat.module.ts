import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page.component';


const routes: Routes = [
  {
    path: '',
    component: ChatPageComponent
  }
];

@NgModule({
  declarations: [ChatPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ChatPageComponent]
})
export class ChatModule { }
