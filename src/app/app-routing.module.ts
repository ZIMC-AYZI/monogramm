import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { myRoutes } from './core/constants/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: myRoutes.logIn.routerPath,
    loadChildren: () => import('../app/pages/login/login.module').then(m =>
      m.LoginModule,
    )
  },
  {
    path: myRoutes.chatPage.fullPath,
    loadChildren: () => import('../app/pages/chat/chat.module').then(m =>
      m.ChatModule),
    canActivate: [AuthGuard]
  },
  {path: '**', redirectTo: myRoutes.logIn.routerPath, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
