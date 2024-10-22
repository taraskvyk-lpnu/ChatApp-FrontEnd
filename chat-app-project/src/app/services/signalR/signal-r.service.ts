import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { Message } from '../../models/message';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: HubConnection | undefined;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor() {
  }

  public async startConnection(url: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      console.log('Already connected');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onreconnected(() => {
      console.log('Reconnected to SignalR Hub');
    });

    this.hubConnection.onreconnecting(() => {
      console.log('Reconnecting...');
    });

    this.hubConnection.onclose(() => {
      console.log('Connection closed');
    });

    try {
      await this.hubConnection.start();
      console.log('Connection started');
      this.registerOnServerEvents();
    } catch (error) {
      console.error('Error while starting connection: ', error);
    }
  }

  private registerOnServerEvents(): void {
    if (this.hubConnection) {

      this.hubConnection.on('ReceiveMessages', (chatId: string, messages: Message[]) => {
       this.messagesSubject.next(messages);
      });

      this.hubConnection.on('ReceiveMessage', (chatId: string, message: Message) => {
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, message]);
      });

      this.hubConnection.on('MessageUpdated', (chatId: string, updatedMessage: Message) => {
        this.handleMessageUpdate(chatId, updatedMessage);
      });

      this.hubConnection.on('MessageDeleted', (chatId: string, messageId: string) => {
        this.handleMessageDelete(chatId, messageId);
      });
    }
  }

  private handleMessageUpdate(chatId: string, updatedMessage: Message): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map(message =>
      message.id === updatedMessage.id ? updatedMessage : message
    );
    this.messagesSubject.next(updatedMessages);
  }

  private handleMessageDelete(chatId: string, messageId: string): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.filter(message => message.id !== messageId);
    this.messagesSubject.next(updatedMessages);
  }


  public async joinChat(chatId: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      console.error('Cannot join chat. Connection is not established.');
      return;
    }

    try {
      await this.hubConnection.invoke('JoinChat', chatId);
      console.log(`Joined chat ${chatId}`);
    } catch (error) {
      console.error('Error while joining chat: ', error);
    }
  }

  public async sendMessage(chatId: string, message: Message): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      console.error('Cannot send message. Connection is not established.');
      return;
    }

    try {
      await this.hubConnection.invoke('SendMessage', { chatId: chatId, message: message });
      console.log(`Message sent to chat ${chatId}`);
    } catch (error) {
      console.error('Error while sending message: ', error);
    }
  }

  public async updateMessage(chatId: string, userId: string, message: Message): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      console.error('Cannot update message. Connection is not established.');
      return;
    }

    try {
      await this.hubConnection.invoke('UpdateMessage', { ChatId: chatId, UserId: userId, Message: message });
      console.log(`Message updated in chat ${chatId}`);
    } catch (error) {
      console.error('Error while updating message: ', error);
    }
  }

  public async deleteMessage(chatId: string, userId: string, message: Message): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      console.error('Cannot update message. Connection is not established.');
      return;
    }

    try {
      await this.hubConnection.invoke('DeleteMessage', { ChatId: chatId, UserId: userId, MessageId: message.id });
      console.log(`Message deleted in chat ${chatId}`);
    } catch (error) {
      console.error('Error while updating message: ', error);
    }
  }

  public async leaveChat(chatId: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      console.error('Cannot leave chat. Connection is not established.');
      return;
    }

    try {
      await this.hubConnection.invoke('LeaveChat', chatId);
      console.log(`Left chat ${chatId}`);
    } catch (error) {
      console.error('Error while leaving chat: ', error);
    }
  }

  public stopConnection(): void {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.stop()
        .then(() => console.log('Connection stopped'))
        .catch(err => console.error('Error while stopping connection: ', err));
    }
  }
}
