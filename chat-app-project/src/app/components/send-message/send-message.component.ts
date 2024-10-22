import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCardFooter} from "@angular/material/card";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Message} from "../../models/message";
import {combineLatest, from, Observable, switchMap, take} from "rxjs";
import {Chat} from "../../models/Dtos/Chat";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {selectUser} from "../../ngrx/auth/auth.selectors";
import {selectActiveChatId} from "../../ngrx/active-chat/active-chat.selectors";
import {User} from "../../models/Dtos/User";
import {SignalRService} from "../../services/signalR/signal-r.service";

@Component({
  selector: 'app-send-message',
  standalone: true,
    imports: [
        MatButton,
        MatCardFooter,
        MatFormField,
        MatIcon,
        MatInput,
        MatSuffix,
        ReactiveFormsModule
    ],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.css'
})
export class SendMessageComponent {
  chatForm: FormGroup;
  user$: Observable<User>;
  chatId$: Observable<string>;
  message: Message = {
    id: '',
    chatId: '',
    text: '',
    senderId: '',
    userName: '',
    createdAt: ''
  };

  @Input() selectedChatChatWindow: Chat | null = null;

  constructor(private fb: FormBuilder,
              private store: Store<AppState>,
              private signalRService: SignalRService) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });

    this.user$ = this.store.select(selectUser);
    this.chatId$ = this.store.select(selectActiveChatId);
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const newMessage = this.chatForm.value.message;

      combineLatest([this.user$, this.chatId$]).pipe(
        take(1),
        switchMap(([user, chatId]) => {
          if (user && chatId) {
            this.message = {
              id: '00000000-0000-0000-0000-000000000000',
              chatId: chatId,
              text: newMessage,
              senderId: user.id,
              userName: user.name,
              createdAt: ''
            }
            console.log(this.message);
            return from(this.signalRService.sendMessage(this.message.chatId, this.message));
          } else {
            throw new Error('User ID or chat ID not available');
          }
        })
      ).subscribe({
        next: () => console.log('Message sent successfully'),
        error: (error) => console.error('Error sending message:', error)
      });

      this.chatForm.reset();
    }
  }
}
