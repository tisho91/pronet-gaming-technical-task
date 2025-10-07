import express from 'express';
import { authenticationMiddleware } from '../middlewares/authentication.middleware';
import { userService } from '../services/user.service';
import { AuthRequest } from '../types';
import { getLastPage } from '../utils';

export const charactersRouter = express.Router();

charactersRouter.get('/', async (req, res) => {
  const { page, pageSize } = req.query;
  const url = `https://anapioficeandfire.com/api/characters?page=${page}&pageSize=${pageSize}`;
  const apiResponse = await fetch(url, {
    method: 'GET',
  });
  const characters = await apiResponse.json();
  // TODO - make it outside of the route
  const modifiedCharacters = characters.map((character: any) => {
    const id = character.url.split('/').reverse()[0];
    return {
      ...character,
      id,
    };
  });
  res.status(200).json({
    lastPage: getLastPage(apiResponse.headers),
    data: modifiedCharacters,
  });
});

charactersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://anapioficeandfire.com/api/characters/${id}`;
  const apiResponse = await fetch(url, {
    method: 'GET',
  });
  const character = await apiResponse.json();
  res.status(200).send(character);
});

charactersRouter.post('/:id/favorite', authenticationMiddleware, async (req: AuthRequest, res) => {
  const { id: characterId } = req.params;
  const userId = req.user?.id || '';
  await userService.updateFavoriteCharacterList({ userId, characterId, action: 'add' });
  res.status(200).send();
});

charactersRouter.delete(
  '/:id/favorite',
  authenticationMiddleware,
  async (req: AuthRequest, res) => {
    const { id: characterId } = req.params;
    const userId = req.user?.id || '';
    await userService.updateFavoriteCharacterList({ userId, characterId, action: 'remove' });
    res.status(200).send();
  }
);
