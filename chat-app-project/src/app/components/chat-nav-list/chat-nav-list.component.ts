import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {AsyncPipe, NgClass, NgForOf} from "@angular/common";
import {MatLine} from "@angular/material/core";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatDivider} from "@angular/material/divider";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ChatWindowComponent} from "../chat-window/chat-window.component";
import {ChatSearchComponent} from "../chat-search/chat-search.component";
import {Chat} from "../../models/Dtos/Chat";
import {map, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {selectChats, selectUserId} from "../../ngrx/auth/auth.selectors";
import {addChat, getChatsByUserId} from "../../ngrx/chat-management/chat-management.actions";
import {ChatFormComponent} from "../chat-form/chat-form.component";
import {HttpClient} from "@angular/common/http";
import {ChatManagementService} from "../../services/chat-management/chat-management.service";
import {AddChatRequest} from "../../models/chat-management/requests/addChatRequest";

@Component({
  selector: 'app-chat-nav-list',
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatButton,
    MatDrawer,
    MatNavList,
    MatIcon,
    MatListItem,
    NgForOf,
    MatLine,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatLabel,
    MatDivider,
    MatIconButton,
    MatSuffix,
    MatInput,
    MatFormField,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatPrefix,
    ChatWindowComponent,
    ChatSearchComponent,
    AsyncPipe,
    NgClass,
    ChatFormComponent,
    MatFabButton
  ],
  templateUrl: './chat-nav-list.component.html',
  styleUrl: './chat-nav-list.component.css'
})
export class ChatNavListComponent {
  showChatForm = false;
  chats$: Observable<Chat[]>;
  filteredChats$: Observable<Chat[]>;

  userId$: Observable<string>;
  activeChatId: string | null = null;

  constructor(private store: Store<AppState>) {
    this.userId$ = this.store.select(selectUserId);

    this.userId$.subscribe(id => {
      if (id) {
        this.store.dispatch(getChatsByUserId({ userId: id }));
      }
    });

    this.chats$ = this.store.select(selectChats);
    this.filteredChats$ = this.chats$;
  }

  @Output() chatSelectedChatNavListComponent = new EventEmitter<Chat>();

  loadChat(chat: Chat) {
    console.log('ChatNavListComponent loadChatById', chat);
    this.activeChatId = chat.id;
    this.chatSelectedChatNavListComponent.emit(chat);
  }

  isActive(chat: Chat): boolean {
    return this.activeChatId === chat.id;
  }

  toggleChatForm() {
    this.showChatForm = !this.showChatForm;
  }

  onChatCreated(chatData: AddChatRequest) {
    console.log(chatData)
    this.store.dispatch(addChat({addChatRequest: chatData}));

    this.toggleChatForm();
  }

  onSearch(query: string) {
    console.log('ChatNavListComponent', query)
    this.filteredChats$ = this.chats$.pipe(
      map(chats =>{
        console.log('loaded', chats)
        return chats.filter(chat => chat.title.toLowerCase().includes(query.toLowerCase()))
      }
      )
    );
  }
}
