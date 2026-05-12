import { Component, inject } from '@angular/core';
import { FeaturePokemonStore } from '../../store/feature-pokemon.store';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-feature-pokemon',
  imports: [MatCardModule],
  providers: [FeaturePokemonStore],
  templateUrl: './feature-pokemon.html',
  styleUrl: './feature-pokemon.scss',
})
export class FeaturePokemon {
  readonly store = inject(FeaturePokemonStore);

  onLogoError(event: Event) {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src = '/imageError.png';
    image.alt = 'Image not found';
  }
}
