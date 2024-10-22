import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideStore} from "@ngrx/store";
import {AppState} from "./app.state";
import { provideEffects } from '@ngrx/effects';
import {authReducer} from "./ngrx/auth/auth.reducer";
import {AuthEffects} from "./ngrx/auth/auth.effects";
import {authInterceptorFn} from "./ngrx/auth/interceptor/auth-interceptor.service";
import {chatManagementReducer} from "./ngrx/chat-management/chat-management.reducers";
import {ChatManagementEffects} from "./ngrx/chat-management/chat-management.effects";
import {activeChatReducer} from "./ngrx/active-chat/active-chat.reducers";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
    provideAnimationsAsync(),
    provideStore<AppState>({ auth : authReducer, chats: chatManagementReducer, activeChat: activeChatReducer }),
    provideEffects([AuthEffects, ChatManagementEffects])]
};
