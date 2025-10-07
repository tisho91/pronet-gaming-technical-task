import { LoginUser, RegisterUser } from '@pronet/shared';
import { userService } from './user.service';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthRequest } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key';
const ACCESS_TOKEN_EXPIRE = 60 * 60; // 1 hour
const REFRESH_TOKEN_EXPIRE = 60 * 60 * 24 * 3; // 3 days

export class AuthenticationService {
  public async register(userData: RegisterUser) {
    const { id, email, name, favoriteCharacters } = await userService.addUser(userData);
    const tokens = this.generateTokens({ id, email });
    // TODO keep the refresh token in the "db"
    return {
      id,
      email,
      name,
      favoriteCharacters,
      ...tokens,
    };
  }

  public async login(userData: LoginUser) {
    const user = await userService.findUserByEmail(userData.email);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== userData.password) {
      throw new Error('Wrong password');
    }
    const tokens = this.generateTokens({ id: user.id, email: user.email });
    // TODO keep the refresh token in the "db"
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      favoriteCharacters: user.favoriteCharacters,
      ...tokens,
    };
  }

  public async logout(user: AuthRequest['user']) {
    //   TODO delete the refresh token
  }

  private generateTokens(payload: { id: string; email: string }) {
    const accessOptions: SignOptions = {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    };

    const refreshOptions: SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRE,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, accessOptions);

    const refreshToken = jwt.sign(payload, JWT_SECRET, refreshOptions);

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const authenticationService = new AuthenticationService();
