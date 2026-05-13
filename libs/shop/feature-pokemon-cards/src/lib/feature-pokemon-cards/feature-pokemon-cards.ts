import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { PokemonSetSkeleton } from '@org/shop/shared-ui';
import { FeaturePokemonCardsStore } from '../store/feature-pokemon-cards.store';

@Component({
  selector: 'lib-feature-pokemon-cards',
  imports: [
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatInputModule,
    PokemonSetSkeleton,
  ],
  providers: [FeaturePokemonCardsStore],
  templateUrl: './feature-pokemon-cards.html',
  styleUrl: './feature-pokemon-cards.scss',
})
export class FeaturePokemonCards implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(FeaturePokemonCardsStore);

  ngOnInit() {
    const setId = this.route.snapshot.paramMap.get('setId');
    if (setId) {
      this.store.loadCardsForSet(setId);
    }
  }

  isTypeSelected(type: string) {
    return this.store.filter().selectedTypes.includes(type);
  }

  isCategorySelected(category: string) {
    return this.store.filter().selectedCategories.includes(category);
  }

  isRaritySelected(rarity: string) {
    return this.store.filter().selectedRarities.includes(rarity);
  }

  onTypeSelected(type: string) {
    this.store.toggleType(type);
  }

  onCategorySelected(category: string) {
    this.store.toggleCategory(category);
  }

  onRaritySelected(rarity: string) {
    this.store.toggleRarity(rarity);
  }

  onQueryChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.updateQuery(input.value);
  }

  onPageChange(event: PageEvent) {
    this.store.updatePagination(event.pageIndex, event.pageSize);
  }

  onLogoError(event: Event) {
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = '/imageError.png';
    image.alt = 'Image not found';
  }
}
