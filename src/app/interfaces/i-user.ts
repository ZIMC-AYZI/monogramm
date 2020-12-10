export interface IUserDetail {
  creationTime: Date;
  info: IUserInfo;
}

export interface IUserInfo extends IUser{
  uid: string;
  userGlobalId: string;
}

export interface IUser {
  photoURL: string;
  displayName: string;
}
