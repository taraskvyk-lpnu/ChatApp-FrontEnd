import { Injectable } from '@angular/core';
import { environmentDev } from "../../environmets/environment.dev";
import {HttpClient} from "@angular/common/http";
import {Chat} from "../../models/Dtos/Chat";
import {AddChatRequest} from "../../models/chat-management/requests/addChatRequest";
import {ResponseDto} from "../../models/chat-management/responses/ResponseDto";
import {UpdateChatRequest} from "../../models/chat-management/requests/updateChatRequest";
import {RemoveChatRequest} from "../../models/chat-management/requests/removeChatRequest";
import {AttachUserRequest} from "../../models/chat-management/requests/AttachUserRequest";
import {DetachUserRequest} from "../../models/chat-management/requests/detachUserRequest";
import {RemoveChatResponse} from "../../models/chat-management/responses/RemoveChatResponse";

@Injectable({
  providedIn: 'root'
})
export class ChatManagementService {

  chatManagementUrl: string = environmentDev.gatewayUrl + '/api/chats';

  constructor(private httpClient: HttpClient) { }

  getChatsByUserId(userId: string){
    console.log(this.chatManagementUrl + `/user/${userId}`);
    return this.httpClient.get<Chat[]>(this.chatManagementUrl + `/user/${userId}`);
  }

  getChats(userId: string){
    return this.httpClient.get<Chat[]>(this.chatManagementUrl);
  }

  addChat(addChatRequest: AddChatRequest) {
    return this.httpClient.post<ResponseDto>(this.chatManagementUrl, addChatRequest);
  }

  updateChat(updateChatRequest: UpdateChatRequest) {
    return this.httpClient.put<ResponseDto>(this.chatManagementUrl, updateChatRequest);
  }

  removeChat(removeChatRequest: RemoveChatRequest) {
    console.log(removeChatRequest);
    return this.httpClient.delete<RemoveChatResponse>(`${this.chatManagementUrl}/${removeChatRequest.chatId}?userId=${removeChatRequest.userId}`);
  }

  attachUserToChat(attachRequest: AttachUserRequest) {
    return this.httpClient.post<ResponseDto>(this.chatManagementUrl + `/attach-user`, attachRequest);
  }

  detachUserFromChat(detachRequest: DetachUserRequest) {
    return this.httpClient.post<ResponseDto>(this.chatManagementUrl + `/detach-user`, detachRequest);
  }
}
