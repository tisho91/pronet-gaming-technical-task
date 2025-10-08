import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { ATTACH_TOKEN_INTERCEPTOR } from '../interceptors/attach-auth-token-interceptor';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  constructor(private http: HttpClient) {}

  getCharacters({ page, pageSize }: { page: number; pageSize: number }) {
    return this.http.get(`/api/characters?page=${page}&pageSize=${pageSize}`);
  }

  setCharacterFavorite({ characterId, favorite }: { characterId: string; favorite: boolean }) {
    const context = new HttpContext().set(ATTACH_TOKEN_INTERCEPTOR, true);
    if (favorite) {
      return this.http.post(
        `/api/characters/${characterId}/favorite`,
        {},
        {
          context,
        },
      );
    } else {
      return this.http.delete(`/api/characters/${characterId}/favorite`, { context });
    }
  }
}
