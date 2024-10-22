import {createAction, props} from "@ngrx/store";
import {ResponseDto} from "../../models/chat-management/responses/ResponseDto";
import {Chat} from "../../models/Dtos/Chat";
import {AddChatRequest} from "../../models/chat-management/requests/addChatRequest";
import {RemoveChatRequest} from "../../models/chat-management/requests/removeChatRequest";
import {RemoveChatResponse} from "../../models/chat-management/responses/RemoveChatResponse";
import {DetachUserRequest} from "../../models/chat-management/requests/detachUserRequest";
import {UpdateChatRequest} from "../../models/chat-management/requests/updateChatRequest";

export const getChatsByUserId = createAction(
  "[Chat] GetChatsByUserId]", props<{userId : string}>());
export const getChatsByUserIdSuccess = createAction(
  "[Chat] GetChatsByUserId] Success", props<{chats : Chat[]}>());
export const getChatsByUserIdFailure = createAction(
  "[Chat] GetChatsByUserId] Failure", props<{error: any}>());

export const addChat = createAction('[Chat Management] Add Chat', props<{ addChatRequest: AddChatRequest }>());
export const addChatSuccess = createAction('[Chat Management] Add Chat Success', props<{ response: ResponseDto }>());
export const addChatFailure = createAction('[Chat Management] Add Chat Failure', props<{ error: any }>());

export const updateChat = createAction('[Chat Management] Update Chat', props<{ updateChatRequest: UpdateChatRequest }>());
export const updateChatSuccess = createAction('[Chat Management] Update Chat Success', props<{ response: ResponseDto }>());
export const updateChatFailure = createAction('[Chat Management] Update Chat Failure', props<{ error: any }>());

export const removeChat = createAction("[Chat] Remove Chat", props<{ request: RemoveChatRequest }>());
export const removeChatSuccess = createAction("[Chat] Remove Chat Success", props<{ response: RemoveChatResponse }>());
export const removeChatFailure = createAction('[Chat Management] Remove Chat Failure', props<{ error: any }>());


export const detachUser = createAction("[Chat] Detach User", props<{ request: DetachUserRequest }>());
export const detachUserSuccess = createAction("[Chat] Detach User Success", props<{ response: ResponseDto }>());
export const leaveChatSuccess = createAction("[Chat] Leave Chat Success", props<{ response: ResponseDto }>());
export const detachUserFailure = createAction('[Chat Management] Detach User Failure', props<{ error: any }>());


export const clearChats = createAction('[Chat] Clear Chats');
