import { Routes } from '@angular/router';
import {AuthComponent} from "./components/auth-component/auth.component";
import {ChatNavListComponent} from "./components/chat-nav-list/chat-nav-list.component";
import {ChatComponent} from "./components/chat/chat.component";
import {AuthGuard} from "./guards/auth-guard";
import {UsersComponent} from "./components/users/users.component";

export const routes: Routes = [
  {path: 'auth', component: AuthComponent },
  {path: 'chats', component: ChatComponent, canActivate: [AuthGuard] },
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  {path: 'chats-nav-list', component: ChatNavListComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth' }
];
