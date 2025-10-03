import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';

export const validateMiddleware =
  (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        errors: JSON.parse(error.message).map((err: any) => ({
          message: err.message,
        })),
      });
    }
  };
