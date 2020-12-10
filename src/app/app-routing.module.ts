import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { myRoutes } from './core/constants/router';

const routes: Routes = [
  {
    path: myRoutes.logIn.routerPath,
    loadChildren: () => import('../app/pages/login/login.module').then(m =>
      m.LoginModule
    )
  },
  {
    path: myRoutes.chatPage.fullPath,
    loadChildren: () => import('../app/pages/chat/chat.module').then(m =>
      m.ChatModule
    )
  },
  {path: '**', redirectTo: myRoutes.logIn.fullPath, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
