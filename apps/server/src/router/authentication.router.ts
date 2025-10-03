import express, { Request, Response } from 'express';
import { BaseUser, LoginUser } from '@pronet/shared';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';
import { authenticationService } from '../services/authentication.service';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { AuthRequest } from '../types';

export const authenticationRouter = express.Router();

authenticationRouter.post(
  '/register',
  validateMiddleware(registerUserSchema),
  async (req: Request<{}, {}, BaseUser>, res: Response) => {
    const newUser = await authenticationService.register(req.body);
    res.status(201).send(newUser);
  }
);
authenticationRouter.post(
  '/login',
  validateMiddleware(loginUserSchema),
  async (req: Request<{}, {}, LoginUser>, res: Response) => {
    const newUser = await authenticationService.login(req.body);
    res.status(201).send(newUser);
  }
);
authenticationRouter.post('/logout', authenticationMiddleware, async (req: AuthRequest, res) => {
  await authenticationService.logout(req.user);
  res.status(200).send({});
});
