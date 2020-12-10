import { IUser } from './i-user';

export interface IMessage {
  author: IUser;
  date: Date;
  text: string;
}
