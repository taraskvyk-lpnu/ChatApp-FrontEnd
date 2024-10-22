import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { environmentDev } from "../../environmets/environment.dev";
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "../../models/auth/RegisterRequest";
import {AuthResponse} from "../../models/auth/AuthResponse";
import {LoginRequest} from "../../models/auth/LoginRequest";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {logout} from "../../ngrx/auth/auth.actions";
import {clearChats} from "../../ngrx/chat-management/chat-management.actions";
import {CookieService} from "../cookies/cookie.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedOutSubject = new BehaviorSubject<void>(undefined);
  public loggedOut$: Observable<void> = this.loggedOutSubject.asObservable();

  authUrl = environmentDev.authUrl;
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private store: Store<AppState>,
              private router: Router) { }

  register(request: RegisterRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + '/register', request);
  }

  login(request: LoginRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + '/login', request);
  }

  async logout(): Promise<void>{
    this.store.dispatch(logout());
    this.store.dispatch(clearChats());
    this.cookieService.removeCookie('access_token');
    this.cookieService.removeCookie('user_id');
    this.loggedOutSubject.next();
    await this.router.navigate(['/auth']);
  }

  isLoggedIn(){
    return this.http.get<AuthResponse>(this.authUrl + '/isLoggedIn');
  }

  setTokenToCookies(token: string): void {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getHours() + 3);

    document.cookie = `token=${token}; expires=${expiryDate.toUTCString()}; path=/; Secure; HttpOnly; SameSite=Strict`;
  }

  getTokenFromCookies(): string | null {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
}
