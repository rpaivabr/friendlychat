import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  chatService = inject(ChatService);
  user$ = this.chatService.user$;
}
