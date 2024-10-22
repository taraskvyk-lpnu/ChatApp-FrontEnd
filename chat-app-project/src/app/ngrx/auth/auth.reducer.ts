import {ActionReducerMap, createReducer, on} from "@ngrx/store";
import {login, loginFailure, loginSuccess, logout} from "./auth.actions";
import {AppState, AuthState} from "../../app.state";

export const initialAuthState : AuthState = {
  token: '',
  user: {
    id: '',
    name: '',
    email: '',
    phoneNumber: ''
  },
  role: '',
  isLoginSuccess: false
};

export const authReducer = createReducer(
  initialAuthState,
  on(login, (state, {loginRequest}) => {
    console.log(state);
    return state;
  }),
  on(loginSuccess, (state, { response }) => {
    console.log({
      ...state,
      token: response.token,
      user: response.user,
      isLoginSuccess: true
    });

    return {
      ...state,
      token: response.token,
      user: response.user,
      isLoginSuccess: true
    };
  }),
  on(loginFailure, (state, {error}) => {
    console.error(error);
    return state;
  }),
  on(logout, (state) => ({
    ...initialAuthState
  }))
);
