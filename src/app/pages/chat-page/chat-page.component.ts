import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-page',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  chatService = inject(ChatService);
  messages$ = this.chatService.loadMessages() as Observable<DocumentData[]>;
  user$ = this.chatService.user$;
  text = '';

  sendTextMessage() {
    this.chatService.saveTextMessage(this.text);
    this.text = '';
  }

  uploadImage(event: any) {
    const imgFile: File = event.target.files[0];
    if (!imgFile) {
      return;
    }
    this.chatService.saveImageMessage(imgFile);
  }
}
