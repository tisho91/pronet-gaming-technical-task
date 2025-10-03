import { UserService } from './user.service';
import { BaseUser } from '@pronet/shared';

const mockFsExistsSync = jest.fn(() => true);
const mockFsReadFile = jest.fn(() => Promise.resolve('[]'));
const mockFsWriteFile = jest.fn(async (path, data, encoding) => {});

jest.mock('fs', () => ({
  existsSync: () => mockFsExistsSync(),
  promises: {
    readFile: () => mockFsReadFile(),
    writeFile: (path: any, data: any, encoding: any) => mockFsWriteFile(path, data, encoding),
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
      favoriteCharacters: [],
    });
  });

  it('should throw error if the user already exists', async () => {
    mockFsReadFile.mockResolvedValueOnce(JSON.stringify([mockUser]));
    await expect(userService.addUser(mockUser)).rejects.toEqual({
      message: 'User already exists',
      code: 500,
    });
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
    await expect(userService.findUserByEmail('notfound@mail.com')).rejects.toEqual({
      message: 'User not found',
      code: 404,
    });
  });

  it('should throw error if there is db connection problem', async () => {
    mockFsReadFile.mockRejectedValue('err');
    await expect(userService.findUserByEmail('test')).rejects.toEqual({
      message: 'Error reading users DB: err',
      code: 500,
    });
  });

  it('should add character to favorite characters list', async () => {
    mockFsReadFile.mockResolvedValueOnce(
      JSON.stringify([
        {
          ...mockUser,
          favoriteCharacters: [],
          id: '123',
        },
      ])
    );
    await userService.updateFavoriteCharacterList({
      action: 'add',
      userId: '123',
      characterId: 'charId',
    });
    expect(mockFsWriteFile).toHaveBeenCalled();

    const writtenData = JSON.parse(mockFsWriteFile.mock.calls[0][1]);
    expect(writtenData[0].favoriteCharacters).toEqual(['charId']);
  });

  it('should remove character from favorite characters list', async () => {
    mockFsReadFile.mockResolvedValueOnce(
      JSON.stringify([
        {
          ...mockUser,
          favoriteCharacters: ['charId1', 'charId2'],
          id: '123',
        },
      ])
    );
    await userService.updateFavoriteCharacterList({
      action: 'remove',
      userId: '123',
      characterId: 'charId1',
    });
    expect(mockFsWriteFile).toHaveBeenCalled();

    const writtenData = JSON.parse(mockFsWriteFile.mock.calls[0][1]);
    expect(writtenData[0].favoriteCharacters).toEqual(['charId2']);
  });
});
