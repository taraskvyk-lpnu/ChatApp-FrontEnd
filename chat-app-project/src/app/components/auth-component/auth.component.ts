import {Component, OnInit} from '@angular/core';
import { RegisterRequest } from "../../models/auth/RegisterRequest";
import {AuthService} from "../../services/auth/auth.service";
import {MatFormField} from "@angular/material/form-field";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {LoginRequest} from "../../models/auth/LoginRequest";
import {NgIf} from "@angular/common";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatTextColumn} from "@angular/material/table";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.state";
import {login} from "../../ngrx/auth/auth.actions";
import {Router} from "@angular/router";
import {filter, take} from "rxjs";
import {selectLoginSuccess} from "../../ngrx/auth/auth.selectors";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatFormField,
    MatCard,
    FormsModule,
    MatInput,
    MatButton,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatTabGroup,
    MatTab,
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatTextColumn,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  isLogin = false;

  registerRequest: RegisterRequest = {
    name: '',
    email: '',
    role: 'User',
    phoneNumber: '',
    password: ''
  };

  loginRequest: LoginRequest = {
    email: '',
    password: ''
  }

  constructor(
    private store:  Store<AppState>,
    private auth : AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  register(): void {
    this.auth.register(this.registerRequest).subscribe(
      response =>
      console.log(response));
  }

  async login(): Promise<void> {
    this.store.dispatch(login({loginRequest: this.loginRequest}));

    const loginSuccess = await this.store.select(selectLoginSuccess)
      .pipe(
        filter(success => success),
        take(1)
      ).toPromise();

    if (loginSuccess) {
      await this.router.navigate(['/chats']);
      this.resetLoginForm();
    }
  }

  resetRegisterForm (){
    this.registerRequest = {
      name: '',
      email: '',
      role: 'User',
      phoneNumber: '',
      password: ''
    }
  }

  resetLoginForm () {
    this.loginRequest = {
      email: '',
      password: ''
    }
  }

  showLogin() {
    this.isLogin = true;
  }

  showRegister() {
    this.isLogin = false;
  }
}
