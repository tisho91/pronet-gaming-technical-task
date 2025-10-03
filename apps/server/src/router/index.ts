import express from 'express';
import { authenticationRouter } from './authentication.router';
import { charactersRouter } from './characters.router';

export const router = express.Router();

router.use('/api/user', authenticationRouter);
router.use('/api/characters', charactersRouter);
