import { Component, inject } from '@angular/core';
import { FeaturePokemonStore } from '../../store/feature-pokemon.store';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { PokemonSerieses, SeriesBrief } from '../../model/feature-pokemon.model';

@Component({
  selector: 'lib-feature-pokemon',
  imports: [MatCardModule, MatChipsModule],
  providers: [FeaturePokemonStore],
  templateUrl: './feature-pokemon.html',
  styleUrl: './feature-pokemon.scss',
})
export class FeaturePokemon {
  readonly store = inject(FeaturePokemonStore);
  readonly serieses = PokemonSerieses;

  isSeriesSelected(series: SeriesBrief) {
    return this.store.filter().selectedSeries.some((selectedSeries) => selectedSeries.id === series.id);
  }

  onSeriesSelected(series: SeriesBrief) {
    console.log(series);
    this.store.updateSelectedSeries(series);
  }

  onLogoError(event: Event) {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src = '/imageError.png';
    image.alt = 'Image not found';
  }
}
