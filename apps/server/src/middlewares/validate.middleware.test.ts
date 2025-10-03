import express, { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { registerUserSchema } from '../schemas/user.schema';
import { validateMiddleware } from './validate.middleware';
import { ApiError } from '../utils/apiError';

describe('validate middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/test', validateMiddleware(registerUserSchema), (req: Request, res: Response) => {
      res.status(200).json({ success: true });
    });
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err instanceof ApiError ? err.code : 500;
      const message = err instanceof ApiError ? err.message : 'Unknown error';
      res.status(status).json({ message });
    });
  });

  it('should call next() when body is valid', async () => {
    const res = await request(app)
      .post('/test')
      .send({ name: 'Tihomir', email: 'test@mail.com', password: '123456' })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it('should return 400 when body is invalid', async () => {
    const res = await request(app).post('/test').send({ name: 'x' }).expect(400);
    expect(res.status).toEqual(400);
  });
});
