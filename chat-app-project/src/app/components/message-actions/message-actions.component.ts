import {Component, Output, Input, EventEmitter} from '@angular/core';
import {Message} from "../../models/message";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-message-actions',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    NgIf,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './message-actions.component.html',
  styleUrl: './message-actions.component.css'
})
export class MessageActionsComponent {
  @Input() message!: Message;
  @Input() isCurrentUser!: boolean;
  @Output() updateMessage = new EventEmitter<Message>();
  @Output() deleteMessage = new EventEmitter<Message>();

  isEditing = false;
  editedText = '';

  startEditing(): void {
    this.isEditing = true;
    this.editedText = this.message.text;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedText = '';
  }

  saveEdit(): void {
    if (this.editedText.trim() !== '') {
      const updatedMessage = { ...this.message, text: this.editedText.trim() };
      this.updateMessage.emit(updatedMessage);
      this.isEditing = false;
    }
  }

  onDelete(): void {
    this.deleteMessage.emit(this.message);
  }
}
