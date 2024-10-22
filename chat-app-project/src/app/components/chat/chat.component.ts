import {Component, ViewChild} from '@angular/core';
import {ChatSearchComponent} from "../chat-search/chat-search.component";
import {ChatWindowComponent} from "../chat-window/chat-window.component";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatLabel} from "@angular/material/form-field";
import {NgClass, NgForOf} from "@angular/common";
import {ChatNavListComponent} from "../chat-nav-list/chat-nav-list.component";
import {Chat} from "../../models/Dtos/Chat";
import {ChatHeaderComponent} from "../chat-header/chat-header.component";
import {ChatFormComponent} from "../chat-form/chat-form.component";
import {AddChatRequest} from "../../models/chat-management/requests/addChatRequest";
import {addChat, updateChat} from "../../ngrx/chat-management/chat-management.actions";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {UpdateChatRequest} from "../../models/chat-management/requests/updateChatRequest";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatSearchComponent,
    ChatWindowComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatDrawer,
    MatDrawerContainer,
    MatIcon,
    MatLabel,
    NgForOf,
    ChatNavListComponent,
    ChatHeaderComponent,
    ChatFormComponent,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  showChatForm = false;
  isEditing = false;
  showFiller = false;
  isBlur = false;

  selectedChat: Chat | null = null;
  /*selectedChat: Chat = {
    id: '21',
    userIds: ['1', '2'],
    title: 'Chat',
    creatorId: '1'
  };*/

  constructor(private store: Store<AppState>){

  }

  onChatSelected(chat: Chat) {
    this.selectedChat = chat;
  }

  toggleBlur(event: boolean) {
    this.isBlur = event;
  }

  toggleDrawer() {
    console.log(this.drawer);
    this.drawer.toggle();
    this.showFiller = !this.showFiller;
  }

  toggleChatForm() {
    this.showChatForm = !this.showChatForm;
    this.isEditing = false;
  }

  enableChatEditing(isEditing: boolean){
    this.showChatForm = isEditing;
    this.isEditing = isEditing;
  }

  onChatCreated(chatData: AddChatRequest) {
    console.log(chatData)
    this.store.dispatch(addChat({addChatRequest: chatData}));

    this.toggleChatForm();
  }

  onChatUpdated(updateChatRequest: UpdateChatRequest) {
    this.store.dispatch(updateChat({updateChatRequest: updateChatRequest}));
    this.toggleChatForm();
  }
}
