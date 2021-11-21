import {Document} from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: RoleType;
}

export enum RoleType {
  ADMIN = "admin",
  USER = "user",
}
