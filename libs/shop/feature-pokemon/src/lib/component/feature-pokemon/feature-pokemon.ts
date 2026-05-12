import { Component, inject } from '@angular/core';
import { FeaturePokemonStore } from '../../store/feature-pokemon.store';

@Component({
  selector: 'lib-feature-pokemon',
  imports: [],
  providers: [FeaturePokemonStore],
  templateUrl: './feature-pokemon.html',
  styleUrl: './feature-pokemon.scss',
})
export class FeaturePokemon {
  readonly store = inject(FeaturePokemonStore);
}
