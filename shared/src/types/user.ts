export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginUser {
  name: string;
}

export interface UserDBEntity extends RegisterUser {
  id: string;
  favoriteCharacters: string[];
}
