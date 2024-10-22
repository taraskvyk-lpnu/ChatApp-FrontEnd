import {Component, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-chat-search',
  standalone: true,
  imports: [
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatSuffix,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './chat-search.component.html',
  styleUrl: './chat-search.component.css'
})
export class ChatSearchComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    console.log("ChatSearchComponent", query);

    this.search.emit(query);
  }
}
