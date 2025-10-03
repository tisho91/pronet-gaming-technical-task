import { UserService } from './user.service';
import { BaseUser } from '@pronet/shared';

const mockFsExistsSync = jest.fn(() => true);
const mockFsReadFile = jest.fn(() => Promise.resolve('[]'));
const mockFsWriteFile = jest.fn().mockResolvedValue(undefined);

jest.mock('fs', () => ({
  existsSync: () => mockFsExistsSync(),
  promises: {
    readFile: () => mockFsReadFile(),
    writeFile: () => mockFsWriteFile(),
  },
}));
jest.mock('../utils', () => ({
  generateUniqueId: jest.fn().mockReturnValue('unique-id-123'),
}));

const mockUser: BaseUser = {
  name: 'John Doe',
  email: 'test@mail.com',
  password: '123456',
};

describe('User Service', () => {
  let userService: UserService;
  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  it('should add user to the db if not existing', async () => {
    const result = await userService.addUser(mockUser);
    expect(result).toEqual({
      ...mockUser,
      id: 'unique-id-123',
    });
  });

  it('should throw error if the user already exists', async () => {
    mockFsReadFile.mockResolvedValueOnce(JSON.stringify([mockUser]));
    await expect(userService.addUser(mockUser)).rejects.toThrow('User already exists');
  });

  it('should return the user if found in the database', async () => {
    mockFsReadFile.mockResolvedValueOnce(
      JSON.stringify([
        {
          email: 'test@me.co',
          randomData: 'random-data',
        },
      ])
    );
    const result = await userService.findUserByEmail('test@me.co');
    expect(result).toEqual({
      email: 'test@me.co',
      randomData: 'random-data',
    });
  });

  it('should throw error if the user is not found', async () => {
    mockFsReadFile.mockResolvedValueOnce(JSON.stringify([mockUser]));
    await expect(userService.findUserByEmail('notfound@mail.com')).rejects.toThrow(
      'User not found'
    );
  });

  it('should throw error if there is db connection problem', async () => {
    mockFsReadFile.mockRejectedValue('err');
    await expect(userService.findUserByEmail('test')).rejects.toThrow(
      'Error reading users DB: err'
    );
  });
});
