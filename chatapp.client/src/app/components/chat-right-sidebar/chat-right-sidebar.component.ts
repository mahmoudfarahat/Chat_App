import { TitleCasePipe } from '@angular/common';
import { ChatService } from './../../services/chat.service';
import { Component , inject } from '@angular/core';

@Component({
  selector: 'app-chat-right-sidebar',
  imports: [TitleCasePipe],
  templateUrl: './chat-right-sidebar.component.html',
  styles: ``
})
export class ChatRightSidebarComponent {

  chatService = inject(ChatService);


}
