import {Component, EventEmitter, Output, OnInit, OnDestroy, Input, SimpleChanges} from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { AddChatRequest } from "../../models/chat-management/requests/addChatRequest";
import { Store } from "@ngrx/store";
import { AppState } from "../../app.state";
import {Observable, of, Subscription} from "rxjs";
import { User } from "../../models/Dtos/User";
import { selectUser } from "../../ngrx/auth/auth.selectors";
import {MatChip} from "@angular/material/chips";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatOption} from "@angular/material/core";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {UserManagementService} from "../../services/user-management/user-management.service";
import {UpdateChatRequest} from "../../models/chat-management/requests/updateChatRequest";
import {Chat} from "../../models/Dtos/Chat";

@Component({
  selector: 'app-chat-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatChip,
    NgForOf,
    MatIcon,
    AsyncPipe,
    MatOption,
    MatAutocomplete,
    MatAutocompleteTrigger,
    NgIf
  ],
  templateUrl: './chat-form.component.html',
  styleUrl: './chat-form.component.css'
})
export class ChatFormComponent implements OnInit, OnDestroy {
  @Output() chatCreated = new EventEmitter<AddChatRequest>();
  @Output() chatUpdated = new EventEmitter<UpdateChatRequest>();
  @Input() chat: Chat | null = null;

  userSearchControl = new FormControl();
  chatForm: FormGroup;
  user$: Observable<User>;
  userId: string | undefined;
  private userSubscription: Subscription | undefined;
  isEditing: boolean = false;

  filteredUsers$: Observable<User[]> | undefined;
  selectedUsers: User[] = [];

  constructor(private fb: FormBuilder,
              private store: Store<AppState>,
              private usersService : UserManagementService) {
    this.chatForm = this.fb.group({
      title: ['', Validators.required],
      creatorName: ['', Validators.required],
      description: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      userIds: ['']
    });

    this.initForm();
    this.user$ = this.store.select(selectUser);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && this.chat) {
      console.log(this.chat)
      this.isEditing = true;
      this.initForm();
    }
  }

  initForm() {
    console.log(this.chat)
    this.chatForm = this.fb.group({
      title: [this.chat?.title || '', Validators.required],
      description: ['description'],
      userIds: [''],
    });

    console.log(this.chat)
    if (this.chat?.userIds && this.chat.userIds.length > 0) {
      this.usersService.findByUserIds(this.chat.userIds)
        .subscribe(users =>
        this.selectedUsers = users);
      console.log(this.selectedUsers)
    }
  }

  ngOnInit() {
    this.userSubscription = this.user$.subscribe(
      (user) => {
        if (user) {
          this.userId = user.id;
          this.chatForm.patchValue({ creatorName: user.name });
        }
      }
    );
  }

  selectUser(user: User) {
    if (!this.selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      this.selectedUsers.push(user);
    }

    this.userSearchControl.reset();
  }

  removeUser(user: User): void {
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onSearchSubmit(filter: string) {
    console.log(this.chat)
    console.log(filter)
    console.log(this.userSearchControl)


    this.filteredUsers$ = this.usersService.findByFilter(filter);
    this.filteredUsers$.subscribe(users => console.log(users));
  }

  onSubmit() {
    if (this.chatForm.valid && this.userId) {

      if(this.isEditing) {
        this.SubmitUpdateChat();
      }
      else{
        this.SubmitAddChat();
      }

      this.ResetForm();
    }
  }

  SubmitAddChat(){
    if (this.chatForm.valid && this.userId) {
      const formValue = this.chatForm.value;
      const userIds = this.selectedUsers.map(u => u.id.trim());

      const chatRequest: AddChatRequest = {
        creatorId: this.userId,
        title: formValue.title,
        userIds: userIds
      };

      this.chatCreated.emit(chatRequest);
    }
  }

  SubmitUpdateChat(){
    if (this.chatForm.valid && this.userId) {
      const formValue = this.chatForm.value;
      const userIds = this.selectedUsers.map(u => u.id.trim());

      const chatRequest: UpdateChatRequest = {
        chatId: this.chat!.id,
        userId: this.userId,
        title: formValue.title,
        userIds: userIds
      };

      this.chatUpdated.emit(chatRequest);
    }
  }

  ResetForm(){
    const formValue = this.chatForm.value;
    this.selectedUsers = [];
    formValue.description = '';
    this.isEditing = false;
    this.chatForm.reset();
    console.log(this.chatForm)
  }
}
