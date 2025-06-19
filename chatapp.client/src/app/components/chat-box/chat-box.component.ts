import { AuthService } from './../../services/auth.service';
import { AfterViewChecked, Component, ElementRef, inject, ViewChild, viewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-chat-box',
  imports: [MatProgressSpinner , DatePipe ,MatIcon],
  templateUrl: './chat-box.component.html',
  styles: [`
    .chat-box {
      scroll-behavior: smooth;
      overflow:hidden;
      padding:10px;
      background-color:#f5f5f5;
      display:flex;
      flex-direction:column;
      box-shadow:0 0 10px rgba(0,0,0,0.1);
      height:70vh;
      border-radius: 5px;
      overflow-y:scroll
    }
          .chat-box::-webkit-scrollbar {
            width:5px;
            transition: width .3s
          }

      .chat-box:hover::-webkit-scrollbar {
        width:5px
      }

      .chat-box::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 10px;
      }

        .chat-box:hover::-webkit-scrollbar-thumb {
        background: gray;
        border-radius: 10px;
      }
      .chat-box::-webkit-scrollbar-thumb:hover {
        background: #888;
      }


      .chat-icon{
        width:40px;
        height:40px;
        font-size:48px
      }


    `]
})
export class ChatBoxComponent implements AfterViewChecked {

@ViewChild('chatBox', {read:ElementRef}) public chatBox?: ElementRef;

chatService = inject(ChatService);
authService= inject(AuthService);
private pageNumber = 2;

loadMoreMessages(){
  this.pageNumber++;
  this.chatService.loadMessages(this.pageNumber)
  this.scrollTop();
}

ngAfterViewChecked(): void {
  if(this.chatService.autoScrollEnabled())
  {
    this.scrollToBottom();
  }
}

scrollToBottom() {
    this.chatService.autoScrollEnabled.set(true);
    this.chatBox!.nativeElement.scrollTo({
      top:this.chatBox!.nativeElement.scrollHeight,
      behavior: 'smooth'
    })
}

scrollTop(){
     this.chatService.autoScrollEnabled.set(false);
    this.chatBox!.nativeElement.scrollTo({
      top:0,
      behavior: 'smooth'
    })
}
}
