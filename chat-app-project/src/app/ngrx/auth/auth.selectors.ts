import {AppState, AuthState, ActiveChatState, ChatRoomsState} from "../../app.state";
import {createSelector} from "@ngrx/store";
import {User} from "../../models/Dtos/User";

export const selectAuthState = (state: AppState) => state.auth;

export const selectUser = createSelector(
  selectAuthState,
  (authState: AuthState) => authState.user
);

export const selectUserId = createSelector(
  selectUser,
  (user: User) => {
    console.log(user);
    return user?.id
  }
);

export const selectChatState = (state: AppState) => state.chats;

export const selectChats = createSelector(
  selectChatState,
  (chatState: ChatRoomsState) => chatState.chats
);

export const selectLoginSuccess = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoginSuccess
);
