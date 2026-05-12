import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PokemonSet } from '../model/feature-pokemon.model';

@Injectable({
  providedIn: 'root',
})

export class FeaturePokemonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://api.tcgdex.net/v2/en/sets';

  getPokemonSets() {
    return this.http.get<PokemonSet[]>(
      `${this.apiUrl}`
    );
  }
}
