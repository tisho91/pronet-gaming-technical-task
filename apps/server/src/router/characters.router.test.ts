import express from 'express';
import { charactersRouter } from './characters.router';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use(charactersRouter);

const mockUser = { id: '123', email: 'test@mail.com', name: 'TestUser', password: 'test123' };
jest.mock('../middlewares/authentication.middleware', () => ({
  authenticationMiddleware: (req: any, res: any, next: any) => {
    req.user = mockUser;
    next();
  },
}));

const mockUpdateFavoriteCharacterList = jest.fn();

jest.mock('../services/user.service', () => ({
  userService: {
    updateFavoriteCharacterList: (...args: any[]) => mockUpdateFavoriteCharacterList(...args),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Character router', () => {
  it('should receive character list from external api', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          name: 'TestChar',
          url: 'http://characters/1',
        },
      ],
    });
    const res = await request(app).get('/').expect(200);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [{ id: '1', name: 'TestChar', url: 'http://characters/1' }],
      lastPage: null,
    });
  });

  it('should receive single character from server api', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '12',
      }),
    });
    const res = await request(app).get('/12').expect(200);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '12' });
  });

  it('should add a character to favorites', async () => {
    const res = await request(app).post('/12/favorite').expect(200);
    expect(res.status).toBe(200);
    expect(mockUpdateFavoriteCharacterList).toHaveBeenCalledWith({
      userId: '123',
      characterId: '12',
      action: 'add',
    });
  });

  it('should remove a character from favorites', async () => {
    const res = await request(app).delete('/12/favorite').expect(200);
    expect(res.status).toBe(200);
    expect(mockUpdateFavoriteCharacterList).toHaveBeenCalledWith({
      userId: '123',
      characterId: '12',
      action: 'remove',
    });
  });
});
