import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PokemonCard, PokemonSetDetail } from '../model/feature-pokemon-cards.model';

@Injectable({
  providedIn: 'root',
})
export class FeaturePokemonCardsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.tcgdex.net/v2/en';

  getSet(setId: string) {
    return this.http.get<PokemonSetDetail>(`${this.apiUrl}/sets/${setId}`);
  }

  getCard(cardId: string) {
    return this.http.get<PokemonCard>(`${this.apiUrl}/cards/${cardId}`);
  }

  updateCard(cardId: string, cardStatus: 'want' | 'own') {
    // TODO: Implement update card endpoint
    console.log('Updating card', cardId, 'with status', cardStatus);
  }
}
