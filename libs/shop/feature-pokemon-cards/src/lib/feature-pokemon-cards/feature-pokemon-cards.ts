import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PokemonSetSkeleton } from '@org/shop/shared-ui';
import { FeaturePokemonCardsStore } from '../store/feature-pokemon-cards.store';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-feature-pokemon-cards',
  imports: [
    RouterLink,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    PokemonSetSkeleton,
    MatButtonModule,
  ],
  providers: [FeaturePokemonCardsStore],
  templateUrl: './feature-pokemon-cards.html',
  styleUrl: './feature-pokemon-cards.scss',
})
export class FeaturePokemonCards implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(FeaturePokemonCardsStore);
  readonly ownedCards = signal<Set<string>>(new Set());
  readonly wantedCards = signal<Set<string>>(new Set());
  readonly quantities = signal<Record<string, number>>({});

  isOwned(cardId: string) {
    return this.ownedCards().has(cardId);
  }

  isWanted(cardId: string) {
    return this.wantedCards().has(cardId);
  }

  toggleWant(cardId: string) {
    const next = new Set(this.wantedCards());
    if (next.has(cardId)) {
      next.delete(cardId);
    } else {
      next.add(cardId);
    }
    this.wantedCards.set(next);
  }

  getQuantity(cardId: string) {
    return this.quantities()[cardId] ?? 0;
  }

  onQuantityChange(cardId: string, event: Event) {
    const value = Number((event.target as HTMLInputElement).value) || 0;
    this.quantities.update((q) => ({ ...q, [cardId]: value }));
  }

  toggleOwn(cardId: string) {
    const next = new Set(this.ownedCards());
    if (next.has(cardId)) {
      next.delete(cardId);
      this.quantities.update((q) => ({ ...q, [cardId]: 0 }));
    } else {
      next.add(cardId);
    }
    this.ownedCards.set(next);
  }

  toggleStatus(cardStatus: 'want' | 'own') {
    this.store.toggleStatus(cardStatus);
  }

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
