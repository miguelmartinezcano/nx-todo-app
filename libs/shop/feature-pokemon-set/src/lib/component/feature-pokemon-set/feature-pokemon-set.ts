import { Component, inject } from '@angular/core';
import { FeaturePokemonSetStore } from '../../store/feature-pokemon-set.store';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  PokemonSerieses,
  SeriesBrief,
} from '../../model/feature-pokemon-set.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { PokemonSetSkeleton } from '@org/shop/shared-ui';

@Component({
  selector: 'lib-feature-pokemon-set',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatInputModule,
    PokemonSetSkeleton,
  ],
  providers: [FeaturePokemonSetStore],
  templateUrl: './feature-pokemon-set.html',
  styleUrl: './feature-pokemon-set.scss',
})
export class FeaturePokemonSet {
  readonly store = inject(FeaturePokemonSetStore);
  readonly serieses = PokemonSerieses;

  isSeriesSelected(series: SeriesBrief) {
    return this.store
      .filter()
      .selectedSeries.some((selectedSeries) => selectedSeries.id === series.id);
  }

  onSeriesSelected(series: SeriesBrief) {
    this.store.updateSelectedSeries(series);
  }

  onPageChange(event: PageEvent) {
    this.store.updatePagination(event.pageIndex, event.pageSize);
  }

  onQueryChange(event: Event) {
    const input = event.target as HTMLInputElement;

    this.store.updateQuery(input.value);
  }

  onLogoError(event: Event) {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src = '/imageError.png';
    image.alt = 'Image not found';
  }
}
