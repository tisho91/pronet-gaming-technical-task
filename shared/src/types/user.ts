export interface BaseUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface UserDBEntity extends BaseUser {
  id: string;
}
