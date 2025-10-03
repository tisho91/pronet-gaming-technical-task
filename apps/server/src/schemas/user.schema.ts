import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerUserSchema = z.object({
  ...loginUserSchema.shape,
  name: z.string().min(6, 'Name must be at least 6 characters'),
});
