import {createReducer, on} from "@ngrx/store";
import {ChatRoomsState} from "../../app.state";
import {
  addChatSuccess,
  clearChats, detachUserSuccess,
  getChatsByUserId,
  getChatsByUserIdFailure,
  getChatsByUserIdSuccess, leaveChatSuccess, removeChat, removeChatSuccess, updateChatSuccess
} from "./chat-management.actions";
import {ResponseDto} from "../../models/chat-management/responses/ResponseDto";

export const initialState : ChatRoomsState = {
    chats: []
};

export const chatManagementReducer = createReducer(
  initialState,
  on(getChatsByUserId, (state, {userId}) => {
    return state;
  }),
  on(getChatsByUserIdSuccess, (state, {chats}) =>{
    return {
      chats: chats
    }
  }),
  on(getChatsByUserIdFailure, (state, {error}) => {
    console.log(error);
    return state;
  }),
  on(addChatSuccess, (state, { response }) => ({
    ...state,
    chats: [...state.chats, response.data]
  })),

  on(updateChatSuccess, (state, { response }) => ({
    ...state,
    chats: state.chats.map(chat =>
      chat.id === response.data.id ? { ...chat, ...response.data } : chat
    )
  })),

  on(removeChatSuccess, (state, { response }) => ({
    ...state,
    chats: state.chats.filter(chat => chat.id != response.data)
  })),

  on(detachUserSuccess, (state, { response }) => ({
    ...state,
    chats: state.chats.map(chat =>
      chat.id === response.data.id
        ? {
          ...chat,
          userIds: chat.userIds.filter(userId => userId !== response.data.id)
        }
        : chat
    )
  })),

  on(leaveChatSuccess, (state, { response }) => ({
    ...state,
    chats: state.chats.filter(chat => chat.id != response.data.id)
  })),

  on(clearChats, state => ({
    chats: []
  }))
)
