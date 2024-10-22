import { createReducer, on } from '@ngrx/store';
import { setActiveChat } from './active-chat.actions';
import {ActiveChatState} from "../../app.state";

export const initialActiveChatState: ActiveChatState = {
  chat: {
    id: '',
    title: '',
    creatorId: '',
    userIds: []
  },
};

export const activeChatReducer = createReducer(
  initialActiveChatState,
  on(setActiveChat, (state, { chat }) => ({
    ...state,
    chat: chat,
  }))
);
