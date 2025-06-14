import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { loginGuard } from './guards/login.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path:'chat',
    component: ChatComponent,
    canActivate:[authGuard]
  },
  {
   path:"register", loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
   canActivate:[loginGuard]
  },
  {
    path:"login", loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate:[loginGuard]
  },
  {
    path:"**",
    redirectTo:"chat",
    pathMatch:"full"
  }
];
