import express from 'express';
import { authenticationRouter } from './authentication.router';

export const router = express.Router();

router.use('/api/user', authenticationRouter);
