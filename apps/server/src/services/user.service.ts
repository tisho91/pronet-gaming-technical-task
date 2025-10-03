import { BaseUser, UserDBEntity } from '@pronet/shared';
import fs from 'fs';
import path from 'path';
import { generateUniqueId } from '../utils';

const USERS_DB_PATH = path.resolve(__dirname, '../../users.json');

export class UserService {
  private users: UserDBEntity[] = [];
  private usersLoaded = false;

  public async addUser(user: BaseUser): Promise<UserDBEntity> {
    await this.ensureLoaded();
    if (!this.checkIfUserExists(user)) {
      // TODO hash the password using bcrypt or something else
      const registeredUser = {
        ...user,
        id: generateUniqueId(),
      };
      this.users.push(registeredUser);
      await this.writeUsersToDB();
      return registeredUser;
    } else {
      throw new Error('User already exists');
    }
  }

  public async findUserByEmail(email: string): Promise<UserDBEntity> {
    await this.ensureLoaded();
    const foundUser = this.users.find((user) => user.email === email);
    if (!foundUser) {
      throw new Error('User not found');
    }
    return foundUser;
  }

  private checkIfUserExists(userToCheck: BaseUser): boolean {
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
      throw new Error(`Error reading users DB: ${err}`);
    }
  }

  private async writeUsersToDB(): Promise<void> {
    await this.ensureLoaded();
    try {
      await fs.promises.writeFile(USERS_DB_PATH, JSON.stringify(this.users, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing users DB:', err);
    }
  }
}

export const userService = new UserService();
