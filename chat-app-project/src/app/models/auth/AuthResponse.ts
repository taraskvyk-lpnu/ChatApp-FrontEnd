import {User} from "../Dtos/User";

export interface AuthResponse {
  isSuccess: boolean,
  message: string,
  token: string,
  user: User
}
