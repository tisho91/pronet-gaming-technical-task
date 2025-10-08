import { TestBed } from '@angular/core/testing';

import { CharactersService } from './characters-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ATTACH_TOKEN_INTERCEPTOR } from '../interceptors/attach-auth-token-interceptor';

const mockCharactersResponse = {
  data: [{ id: 1 }, { id: 2 }],
  lastPage: 1,
};

describe('CharactersService', () => {
  let service: CharactersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CharactersService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CharactersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Call the correct endpoints', () => {
    it('GET /characters', () => {
      service.getCharacters({ page: 1, pageSize: 2 }).subscribe((response) => {
        expect(response).toEqual(mockCharactersResponse);
      });
      const req = httpMock.expectOne('/api/characters?page=1&pageSize=2');
      expect(req.request.method).toBe('GET');
      req.flush(mockCharactersResponse);
    });

    it('POST /favorite', () => {
      const payload = {
        characterId: '1',
        favorite: true,
      };
      service.setCharacterFavorite(payload).subscribe();
      const req = httpMock.expectOne('/api/characters/1/favorite');
      expect(req.request.method).toBe('POST');
      expect(req.request.context.get(ATTACH_TOKEN_INTERCEPTOR)).toBeTrue();
    });

    it('DELETE /favorite', () => {
      const payload = {
        characterId: '1',
        favorite: false,
      };
      service.setCharacterFavorite(payload).subscribe();
      const req = httpMock.expectOne('/api/characters/1/favorite');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.context.get(ATTACH_TOKEN_INTERCEPTOR)).toBeTrue();
    });
  });
});
