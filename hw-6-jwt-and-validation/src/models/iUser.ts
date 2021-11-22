import {Document} from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role?: RoleType;
  name?: string;
}

export enum RoleType {
  ADMIN = "admin",
  USER = "user",
}
