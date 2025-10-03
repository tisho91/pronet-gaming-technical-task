import { authenticationService } from './authentication.service';
import { UserDBEntity } from '@pronet/shared';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('justatoken'),
}));

const mockUser: UserDBEntity = {
  name: 'John Doe',
  email: 'test@mail.com',
  id: '1234',
  password: '123456',
  favoriteCharacters: [],
};
const mockAddUser = jest.fn().mockResolvedValue(mockUser);

const mockFindUserByEmail = jest.fn().mockResolvedValue(mockUser);

jest.mock('./user.service', () => ({
  userService: {
    addUser: () => mockAddUser(),
    findUserByEmail: () => mockFindUserByEmail(),
  },
}));

const foundUser = {
  id: mockUser.id,
  name: mockUser.name,
  email: mockUser.email,
  accessToken: 'justatoken',
  refreshToken: 'justatoken',
};

describe('Authentication Service', () => {
  it('should create user on register if not exist', async () => {
    const newUser = await authenticationService.register(mockUser);
    expect(newUser).toEqual(foundUser);
  });

  it('should login the user if exist', async () => {
    const user = await authenticationService.login(mockUser);
    expect(user).toEqual(foundUser);
  });

  it('should throw error when trying to login and user does not exists', async () => {
    mockFindUserByEmail.mockReturnValueOnce(null);
    await expect(authenticationService.login(mockUser)).rejects.toThrow('User not found');
  });

  it('should throw error when trying to login with wrong password', async () => {
    await expect(
      authenticationService.login({
        ...mockUser,
        password: 'wrongpass',
      })
    ).rejects.toThrow('Wrong password');
  });
});
