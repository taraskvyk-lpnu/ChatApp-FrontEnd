import {User} from "./models/Dtos/User";
import {Message} from "./models/message";
import {Chat} from "./models/Dtos/Chat";

export interface AppState {
  auth: AuthState;
  chats: ChatRoomsState;
  activeChat: ActiveChatState;
}

export interface AuthState {
  user: User;
  token: string;
  role: string;
  isLoginSuccess: boolean;
}

export interface ChatRoomsState {
  chats: Chat[];
}

export interface ActiveChatState   {
  chat: Chat;
  //messages: Message[];
}

export interface MessagesState {
  [roomId: string]: Message[];
}
