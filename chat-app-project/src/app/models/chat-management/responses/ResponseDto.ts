import {Chat} from "../../Dtos/Chat";

export interface ResponseDto  {
  isSuccess: boolean;
  data: Chat,
  Message: string;
}
