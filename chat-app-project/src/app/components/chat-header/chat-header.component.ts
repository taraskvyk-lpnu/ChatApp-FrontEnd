import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Chat} from "../../models/Dtos/Chat";
import {User} from "../../models/Dtos/User";
import {ReactiveFormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {selectUser} from "../../ngrx/auth/auth.selectors";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton, MatIconButton} from "@angular/material/button";
import {detachUser, removeChat} from "../../ngrx/chat-management/chat-management.actions";
import {MatIcon} from "@angular/material/icon";
import {ChatFormComponent} from "../chat-form/chat-form.component";

@Component({
  selector: 'app-chat-header',
  standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,
        MatInput,
        MatFormField,
        MatAutocompleteTrigger,
        MatAutocomplete,
        AsyncPipe,
        MatOption,
        NgForOf,
        MatButton,
        MatIconButton,
        MatIcon,
        ChatFormComponent
    ],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {
  showChatOptions = false;
  @Input() chat: Chat | null = null;
  @Input() isBlur: boolean = false;
  @Input() isEditingEnabled: boolean = false;
  @Output() editChatEnabled = new EventEmitter<boolean>();
  @Output() blurChanged = new EventEmitter<boolean>();
  user$: Observable<User> | undefined;

  constructor(
    private store: Store<AppState>) {
    this.user$ = this.store.select(selectUser);
    console.log(this.chat)
  }

  toggleChatOptions() {
    this.showChatOptions = !this.showChatOptions;
    this.blurChanged.emit(!this.isBlur);
  }

  toggleChatForm(){
    this.isEditingEnabled = !this.isEditingEnabled;
    this.editChatEnabled.emit(this.isEditingEnabled);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && !changes['chat'].firstChange) {
      this.showChatOptions = false;
      this.isBlur = false;
      this.blurChanged.emit(this.isBlur);
    }
  }

  onDeleteChat() {
    this.user$!.subscribe((user) => {
      this.store.dispatch(removeChat({ request: { chatId: this.chat?.id!, userId: user.id } }));
      this.toggleChatOptions();
      this.chat = null;
    });
  }

  onLeaveChat() {
    this.user$!.subscribe((user) => {
      this.store.dispatch(detachUser({ request: {
        chatId: this.chat?.id!,
          DetachedByUserId: user.id,
          UserToDetachId: user.id}
      }));

      this.toggleChatOptions();
      this.chat = null;
    });
  }
}
