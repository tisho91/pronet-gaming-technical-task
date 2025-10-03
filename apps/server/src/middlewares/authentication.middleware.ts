import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../services/authentication.service';
import { AuthRequest } from '../types';

export function authenticationMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
    next();
  } catch {
    res.sendStatus(403);
  }
}
