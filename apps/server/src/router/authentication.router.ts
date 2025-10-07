import express, { NextFunction, Request, Response } from 'express';
import { LoginUser, RegisterUser } from '@pronet/shared';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';
import { authenticationService } from '../services/authentication.service';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { AuthRequest } from '../types';
import { userService } from '../services/user.service';

export const authenticationRouter = express.Router();

authenticationRouter.get('/', authenticationMiddleware, async (req: AuthRequest, res, next) => {
  const { email, id, name, favoriteCharacters } = await userService.findUserByEmail(
    req.user?.email || ''
  );
  try {
    return res.status(200).json({ email, id, name, favoriteCharacters });
  } catch (error) {
    next(error);
  }
});

authenticationRouter.post(
  '/register',
  validateMiddleware(registerUserSchema),
  async (req: Request<{}, {}, RegisterUser>, res: Response, next) => {
    try {
      const newUser = await authenticationService.register(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      next(error);
    }
  }
);
authenticationRouter.post(
  '/login',
  validateMiddleware(loginUserSchema),
  async (req: Request<{}, {}, LoginUser>, res: Response, next: NextFunction) => {
    try {
      const newUser = await authenticationService.login(req.body);
      res.status(201).send(newUser);
    } catch (error) {
      next(error);
    }
  }
);
authenticationRouter.delete('/logout', authenticationMiddleware, async (req: AuthRequest, res) => {
  await authenticationService.logout(req.user);
  res.status(200).send({});
});
