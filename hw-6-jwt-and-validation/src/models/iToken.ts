import {IUser} from "./iUser";

export interface IToken {
  user: Pick<IUser, '_id'>;
  refreshToken: string;
}
