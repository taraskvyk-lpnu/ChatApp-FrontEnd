import { createAction, props } from '@ngrx/store';
import { Chat } from '../../models/Dtos/Chat';

export const setActiveChat = createAction(
  '[Chat] Set Active Chat',
  props<{ chat: Chat }>()
);
