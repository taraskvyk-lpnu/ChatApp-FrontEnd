import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {login, loginFailure, loginSuccess} from "./auth.actions";
import {catchError, map, mergeMap, of, tap} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {CookieService} from "../../services/cookies/cookie.service";

@Injectable()
export class AuthEffects {

  $login = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) => this.authService.login(action.loginRequest).pipe(
        map(loginResponse => {
            return loginSuccess({response: loginResponse});
          }
        ),
        catchError(error => {
          console.log(error);
          return of(loginFailure(error))
        })
      ))
    ))

  $loginSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ response }) => {
          this.cookieService.setCookie('access_token', response.token, 3);
          this.cookieService.setCookie('user_id', response.user.id, 3);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private cookieService: CookieService) {
  }
}
