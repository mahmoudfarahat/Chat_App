import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  {
path:'chat',
component: ChatComponent
  },
  {
  path:"register", loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
    {
  path:"login", loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  }
];
