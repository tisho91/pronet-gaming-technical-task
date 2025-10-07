import request from 'supertest';
import express from 'express';
import { authenticationRouter } from './authentication.router';
import { authenticationService } from '../services/authentication.service';

jest.mock('../services/authentication.service');

const app = express();
app.use(express.json());
app.use(authenticationRouter);

const mockUser = { id: '123', email: 'test@mail.com', name: 'TestUser', password: 'test123' };

jest.mock('../middlewares/authentication.middleware', () => ({
  authenticationMiddleware: (req: any, res: any, next: any) => {
    req.user = mockUser;
    next();
  },
}));

describe('Authentication Router', () => {
  it('should register a new user', async () => {
    (authenticationService.register as jest.Mock).mockResolvedValue({ ...mockUser, id: '1234' });

    const res = await request(app).post('/register').send(mockUser).expect(201);

    expect(res.body.id).toBe('1234');
    expect(authenticationService.register).toHaveBeenCalledWith(mockUser);
  });

  it('should login a user', async () => {
    (authenticationService.login as jest.Mock).mockResolvedValue({ token: 'abc', user: mockUser });

    const res = await request(app)
      .post('/login')
      .send({ email: mockUser.email, password: mockUser.password })
      .expect(201);

    expect(res.body.token).toBe('abc');
    expect(authenticationService.login).toHaveBeenCalled();
  });

  it('should logout a user', async () => {
    (authenticationService.logout as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .delete('/logout')
      .set('Authorization', 'Bearer faketoken')
      .expect(200);

    expect(authenticationService.logout).toHaveBeenCalled();
  });
});
