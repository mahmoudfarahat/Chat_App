import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private authSerivce =inject(AuthService)
  private hubUrl = 'https://localhost:5000/hubs/chat'
  onlineUsers = signal<User[]>([])

  private hubConnection? :HubConnection

  startConnection(token:string, senderId? :string){
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`,{
          accessTokenFactory :() => token
        }
        ).withAutomaticReconnect()
          .build();

          this.hubConnection.start()
            .then(() =>{
              console.log("Connection started")
            })
            .catch((error)=>{
              console.log("Connection or login error",error)
            });

            this.hubConnection!.on('OnlineUsers',(user:User[])=>{
                console.log(user)
                this.onlineUsers.update(()=>
                  user.filter(user=>user.userName !== this.authSerivce.currentLoggedUser!.userName)
                )
            })

  }

}
