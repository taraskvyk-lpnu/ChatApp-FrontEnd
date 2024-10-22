import {createAction, props} from "@ngrx/store";
import {LoginRequest} from "../../models/auth/LoginRequest";
import {AuthResponse} from "../../models/auth/AuthResponse";

export const login  = createAction("[Login] Login User",
  props<{ loginRequest: LoginRequest }>());

export const loginSuccess  = createAction("[Login] Login User Success",
  props<{ response: AuthResponse }>());

export const loginFailure = createAction("[Login] Login User Failure",
  props<{ error: any }>());

export const logout  = createAction("[Logout] Logout User");
export const logoutSuccess  = createAction("[Logout] Logout Success", props<{ response: AuthResponse }>());
export const logoutFailure = createAction("[Logout] Logout Failure", props<{ error: any }>());
