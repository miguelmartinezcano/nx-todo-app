import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PokemonCard, PokemonSetDetail } from '../model/feature-pokemon-cards.model';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeaturePokemonCardsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.tcgdex.net/v2/en';
  private readonly backendUrl = 'http://localhost:3333/api';

  getSet(setId: string) {
    return this.http.get<PokemonSetDetail>(`${this.apiUrl}/sets/${setId}`);
  }

  getCard(cardId: string) {
    return this.http.get<PokemonCard>(`${this.apiUrl}/cards/${cardId}`);
  }

  updateCard(cardId: string, cardStatus: 'want' | 'own'): Observable<void> {
    return this.http
      .put<ApiResponse<{ cardId: string; status: 'want' | 'own' }>>(
        `${this.backendUrl}/cards/${cardId}/status`,
        { status: cardStatus },
      )
      .pipe(map(() => void 0));
  }
}
