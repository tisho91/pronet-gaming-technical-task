import { RegisterUser, UserDBEntity } from '@pronet/shared';
import fs from 'fs';
import path from 'path';
import { generateUniqueId } from '../utils';
import { ApiError } from '../utils/apiError';

const USERS_DB_PATH = path.resolve(__dirname, '../../users.json');

export class UserService {
  private users: UserDBEntity[] = [];
  private usersLoaded = false;

  public async addUser(user: RegisterUser): Promise<UserDBEntity> {
    await this.ensureLoaded();
    if (!this.checkIfUserExists(user)) {
      // TODO hash the password using bcrypt or something else
      const registeredUser = {
        ...user,
        id: generateUniqueId(),
        favoriteCharacters: [],
      };
      this.users.push(registeredUser);
      await this.writeUsersToDB();
      return registeredUser;
    } else {
      throw new ApiError({
        code: 500,
        message: 'User already exists',
      });
    }
  }

  public async findUserByEmail(email: string): Promise<UserDBEntity> {
    await this.ensureLoaded();
    const foundUser = this.users.find((user) => user.email === email);
    if (!foundUser) {
      throw new ApiError({
        code: 404,
        message: 'User not found',
      });
    }
    return foundUser;
  }

  public async updateFavoriteCharacterList({
    userId,
    characterId,
    action,
  }: {
    userId: string;
    characterId: string;
    action: 'add' | 'remove';
  }) {
    if (!userId) {
      throw new ApiError({
        code: 404,
        message: 'User not found',
      });
    }
    await this.ensureLoaded();
    const user: UserDBEntity = await this.findUserById(userId);
    const updatedUser = {
      ...user,
      favoriteCharacters:
        action === 'add'
          ? [...new Set([...user.favoriteCharacters, characterId])]
          : user.favoriteCharacters.filter((character) => character !== characterId),
    };
    await this.updateUser(updatedUser);
  }

  private async findUserById(id: string): Promise<UserDBEntity> {
    await this.ensureLoaded();
    const foundUser = this.users.find((user) => user.id === id);
    if (!foundUser) {
      throw new ApiError({
        code: 404,
        message: 'User not found',
      });
    }
    return foundUser;
  }

  private checkIfUserExists(userToCheck: RegisterUser): boolean {
    return this.users.some((user) => user.email === userToCheck.email);
  }

  private async ensureLoaded(): Promise<void> {
    if (!this.usersLoaded) {
      await this.readUsersFromDB();
    }
  }

  private async readUsersFromDB(): Promise<void> {
    try {
      if (fs.existsSync(USERS_DB_PATH)) {
        const data = await fs.promises.readFile(USERS_DB_PATH, 'utf-8');

        this.users = data ? JSON.parse(data) : [];
      } else {
        await fs.promises.writeFile(USERS_DB_PATH, JSON.stringify(this.users, null, 2));
      }
      this.usersLoaded = true;
    } catch (err) {
      throw new ApiError({
        code: 500,
        message: `Error reading users DB: ${err}`,
      });
    }
  }

  private async writeUsersToDB(): Promise<void> {
    await this.ensureLoaded();
    try {
      await fs.promises.writeFile(USERS_DB_PATH, JSON.stringify(this.users, null, 2), 'utf8');
    } catch (err) {
      throw new ApiError({
        code: 500,
        message: `Error writing users DB: ${err}`,
      });
    }
  }

  private async updateUser(user: UserDBEntity): Promise<void> {
    await this.ensureLoaded();
    this.users = this.users.map((entry) => (user.id === entry.id ? user : entry));
    await this.writeUsersToDB();
  }
}

export const userService = new UserService();
