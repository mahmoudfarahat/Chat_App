import { TitleCasePipe } from '@angular/common';
import { ChatService } from './../../services/chat.service';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  imports: [TitleCasePipe , MatIcon , FormsModule],
  templateUrl: './chat-window.component.html',
  styles: ``
})
export class ChatWindowComponent {
  chatService = inject(ChatService);
  message:string = '';

  sendMessage(){

  }
}
