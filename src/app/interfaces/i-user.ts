export interface IUserDetail {
  creationTime: number;
  info: IUserInfo;
  followers: IFollowers;
}

export interface IUserInfo extends IUser{
  uid: string;
  userGlobalId: string;
  email: string;
}

export interface IUser {
  photoURL: string;
  displayName: string;
}

export interface IFollowers {
  [key: string]: string;
}
