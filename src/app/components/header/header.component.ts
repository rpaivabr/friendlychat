import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [AsyncPipe],
})
export class HeaderComponent {
  chatService = inject(ChatService);
  user$ = this.chatService.user$;
}
