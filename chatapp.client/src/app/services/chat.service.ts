import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
} from '@microsoft/signalr';

import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../Models/User';
import { Message } from '../Models/Message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private authSerivce = inject(AuthService);
  private hubUrl = 'https://localhost:5000/hubs/chat';
  onlineUsers = signal<User[]>([]);
  currentbrOpenedChat = signal<User | null>(null); // This will hold the user with whom the chat is currently open
chatMessages = signal<Message[]>([]);
  private hubConnection?: HubConnection;
  isLoading = signal<boolean>(true);

  startConnection(token: string, senderId?: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch((error) => {
        console.log('Connection or login error', error);
      });

    this.hubConnection!.on('OnlineUsers', (user: User[]) => {
      console.log(user);
      this.onlineUsers.update(() =>
        user.filter(
          (user) =>
            user.userName !== this.authSerivce.currentLoggedUser!.userName
        )
      );
    });

    this.hubConnection!.on('ReceieveMessageList', (message) => {
      console.log(message);
      this.chatMessages.update((messages) => [...message, ...messages]);
      console.log(this.chatMessages());
    });
  }

  disConnectConnection() {
    if (this.hubConnection?.state == HubConnectionState.Connected) {
      this.hubConnection
        .stop()
        .then(() => {
          console.log('Connection stopped');
        })
        .catch((error) => {
          console.log('Error stopping connection', error);
        });
    }
  }


  status(userName: string):string {
    const currentChatUSer = this.currentbrOpenedChat()
    if(!currentChatUSer) return 'offline';

    const onlineUser = this.onlineUsers().find(
      (user) => user.userName === userName
    );

    return onlineUser?.isTypying? 'typing...'  : this.isUserOnline();
}
isUserOnline() : string{
  let onlineUser = this.onlineUsers().find(
    (user) => user.userName === this.currentbrOpenedChat()?.userName
  );
  return onlineUser?.isOnline? 'online' : this.currentbrOpenedChat()!.userName;
}

loadMessages(pageNumber: number) {
this.hubConnection?.invoke('LoadMessages', this.currentbrOpenedChat()?.id, pageNumber)
.then()
.catch()
.finally(() => {
   this.isLoading.update(() => false);
})
}
}
