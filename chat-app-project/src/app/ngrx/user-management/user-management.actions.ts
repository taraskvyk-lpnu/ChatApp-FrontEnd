import {createAction, props} from "@ngrx/store";

const getUserById = createAction("[USER] Get User By Id", props<{userId : string}>());
const getUserByFilter = createAction("[USER] Get User By Id", props<{filter : string}>());
