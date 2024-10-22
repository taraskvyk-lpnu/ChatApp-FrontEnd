import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {selectAuthState} from "../../ngrx/auth/auth.selectors";
import {AuthService} from "../../services/auth/auth.service";
import {environmentDev} from "../../environmets/environment.dev";
import {User} from "../../models/Dtos/User";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbar,
    MatButton
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isLoggedIn : boolean = false;


  constructor(private store: Store<AppState>,
              private authService: AuthService) {
    this.store.select(selectAuthState).subscribe(authState =>{
      this.isLoggedIn = !!(authState.token!);
    })
  }

  LogOut() {
    this.authService.logout();
  }
}
