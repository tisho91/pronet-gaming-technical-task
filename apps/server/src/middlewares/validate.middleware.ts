import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import { ApiError } from '../utils/apiError';

export const validateMiddleware =
  (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      next(
        new ApiError({
          message: JSON.parse(error.message).map((err: any) => err.message),
          code: 400,
        })
      );
    }
  };
