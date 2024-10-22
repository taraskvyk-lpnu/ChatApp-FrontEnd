import {createSelector} from "@ngrx/store";
import {AppState} from "../../app.state";
import {state} from "@angular/animations";

export const selectActiveChatState = (state: AppState) => state.activeChat;

export const selectActiveChat = createSelector(
  selectActiveChatState,
  state => state.chat
)

export const selectActiveChatId = createSelector(
  selectActiveChatState,
  state => state.chat.id
)
