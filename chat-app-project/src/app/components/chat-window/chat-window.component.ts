import {Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {AsyncPipe, DatePipe, NgClass, NgForOf} from "@angular/common";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {Message} from "../../models/message";
import {Chat} from "../../models/Dtos/Chat";
import {CookieService} from "../../services/cookies/cookie.service";
import {from, Observable, Subscription, switchMap, take} from "rxjs";
import {selectUserId} from "../../ngrx/auth/auth.selectors";
import {MatIcon} from "@angular/material/icon";
import {SendMessageComponent} from "../send-message/send-message.component";
import {SignalRService} from "../../services/signalR/signal-r.service";
import { environmentDev } from "../../environmets/environment.dev";
import {setActiveChat} from "../../ngrx/active-chat/active-chat.actions";
import {AuthService} from "../../services/auth/auth.service";
import {MessageActionsComponent} from "../message-actions/message-actions.component";

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardFooter,
    MatFormField,
    MatCardContent,
    ReactiveFormsModule,
    MatButton,
    MatInput,
    NgForOf,
    NgClass,
    AsyncPipe,
    MatIcon,
    MatPrefix,
    MatSuffix,
    SendMessageComponent,
    MessageActionsComponent,
    DatePipe
  ],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  messages: Message[] = [];
  private currentChatId: string | null = null;
  selectedMessage: any = null;
  userId$: Observable<string>;
  chatHubUrl: string = environmentDev.gatewayUrl + '/chathub';
  private messagesSubscription!: Subscription;

  @Input() selectedChatChatWindow: Chat | null = null;

  @ViewChild('messageList') private messageListRef: ElementRef | undefined;

  constructor(private store: Store<AppState>,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private signalRService: SignalRService) {

    this.userId$ = this.store.select(selectUserId);

    this.authService.loggedOut$.subscribe(() => {
      this.clearMessageList();
    })
  }

  ngOnChanges() {
    if (this.selectedChatChatWindow) {
      this.disconnectFormPreviousChat();

      this.currentChatId = this.selectedChatChatWindow.id;

      this.connectToSelectedChat();
      this.store.dispatch(setActiveChat({ chat: this.selectedChatChatWindow }));
    }
  }

  private connectToSelectedChat(){
    console.log('Connecting by SignalR to new chat');

    this.signalRService.startConnection(this.chatHubUrl)
      .then(() => {
        this.signalRService.joinChat(this.selectedChatChatWindow!.id)
          .then(() => {
            console.log('Loading messages');
            this.loadMessages();
          });
      })
      .catch(err => {
        console.error('Error while connecting by SignalR:', err);
      });
  }

  private disconnectFormPreviousChat(): void {
    if (this.currentChatId) {
      this.signalRService.leaveChat(this.currentChatId)
        .then(() => {
          console.log(`Disconnected from chat ${this.currentChatId}`);
        })
        .catch(err => {
          console.error(`Error while leaving chat ${this.currentChatId}:`, err);
        });
    }
  }

  private clearMessageList(): void {
    this.messages = [];
  }

  loadMessages() {
    this.messagesSubscription = this.signalRService.messages$.subscribe(messages => {
      this.messages = messages;
      this.cdRef.detectChanges();
      this.scrollToBottom();
    });
  }

  async onUpdateMessage(updatedMessage: Message) {
    this.userId$.pipe(
      take(1),
      switchMap(userId => {
        if (userId) {
          return from(this.signalRService.updateMessage(updatedMessage.chatId, userId, updatedMessage));
        } else {
          throw new Error('User ID not available');
        }
      })
    ).subscribe({
      next: () => console.log('Message updated successfully'),
      error: (error) => console.error('Error updating message:', error)
    });
  }

  onDeleteMessage(messageToDelete: Message) {
    this.userId$.pipe(
      take(1),
      switchMap(userId => {
        if (userId) {
          return from(this.signalRService.deleteMessage(messageToDelete.chatId, userId, messageToDelete));
        } else {
          throw new Error('User ID not available');
        }
      })
    ).subscribe({
      next: () => console.log('Message deleted successfully'),
      error: (error) => console.error('Error deleting message:', error)
    });
  }

  private scrollToBottom(): void {
    if (this.messageListRef) {
      const messageList = this.messageListRef.nativeElement as HTMLElement;
      const lastMessage = messageList.lastElementChild;

      setTimeout(() => {
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1);
    }
  }
}
