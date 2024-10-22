import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CookieService} from "../../services/cookies/cookie.service";
import {
  addChat,
  addChatFailure,
  addChatSuccess,
  detachUser,
  detachUserFailure,
  detachUserSuccess,
  getChatsByUserId,
  getChatsByUserIdFailure,
  getChatsByUserIdSuccess,
  leaveChatSuccess,
  removeChat,
  removeChatFailure,
  removeChatSuccess,
  updateChat, updateChatFailure,
  updateChatSuccess
} from "./chat-management.actions";
import {catchError, map, mergeMap, of, tap} from "rxjs";
import {ChatManagementService} from "../../services/chat-management/chat-management.service";

@Injectable()
export class ChatManagementEffects {

  $getChatsByUserId = createEffect(() => this.actions$.pipe(
    ofType(getChatsByUserId),
    //tap(action => console.log('getChatsByUserId action', action)),
    mergeMap((action) => this.chatManagementService.getChatsByUserId(action.userId).pipe(
      map(chats => {
        return getChatsByUserIdSuccess({chats});
      }),
      catchError(error => {
        return of(getChatsByUserIdFailure({error}));
      })
    ))
  ))

  addChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addChat),
      mergeMap(({ addChatRequest }) =>
        this.chatManagementService.addChat(addChatRequest).pipe(
          map(response => addChatSuccess({ response })),
          catchError(error => of(addChatFailure({ error })))
        )
      )
    )
  );

  updateChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateChat),
      mergeMap(({ updateChatRequest }) =>
        this.chatManagementService.updateChat(updateChatRequest).pipe(
          map(response => updateChatSuccess({ response })),
          catchError(error => of(updateChatFailure({ error })))
        )
      )
    )
  );

  removeChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeChat),
      mergeMap(({ request }) =>
        this.chatManagementService.removeChat(request).pipe(
          map(response => removeChatSuccess({ response })),
          catchError(error => of(removeChatFailure({ error })))
        )
      )
    )
  );

  detachUserChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(detachUser),
      mergeMap(({ request }) =>
        this.chatManagementService.detachUserFromChat(request).pipe(
          map(response => {
            if (request.DetachedByUserId === request.UserToDetachId) {
              return leaveChatSuccess({ response });
            } else {
              return detachUserSuccess({ response });
            }
          }),
          catchError(error => of(detachUserFailure({ error })))
        )
      )
    )
  );


  constructor(
    private actions$: Actions,
    private chatManagementService: ChatManagementService,
    private cookieService: CookieService) {
  }
}
