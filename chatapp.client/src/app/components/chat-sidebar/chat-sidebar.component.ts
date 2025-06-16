import { TitleCasePipe } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { User } from '../../Models/User';

@Component({
  selector: 'app-chat-sidebar',
  imports: [MatIconModule , MatMenuModule ,TitleCasePipe] ,
  templateUrl: './chat-sidebar.component.html',
  styles: ``
})
export class ChatSidebarComponent implements OnInit {
 ngOnInit(): void {
  this.chatService.startConnection(this.authSerice.getAccessToken!)
}
 authSerice = inject(AuthService)
 chatService = inject(ChatService)
 router = inject(Router)

 logout(){
  this.authSerice.logout()
  this.router.navigate(['/login'])
  this.chatService.disConnectConnection()
 }

 openChatWindow(user: User) {
  this.chatService.currebrOpenedChat.set(user);
 }
}
