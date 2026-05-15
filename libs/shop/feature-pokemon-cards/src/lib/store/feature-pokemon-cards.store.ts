import {
  signalStore,
  withState,
  withMethods,
  withHooks,
  withProps,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { setEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject, ResourceStatus } from '@angular/core';
import { forkJoin, map, of, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { PokemonCard } from '../model/feature-pokemon-cards.model';
import { FeaturePokemonCardsService } from '../service/feature-pokemon-cards.service';

type SetMeta = {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
};

type CardsState = {
  status: ResourceStatus;
  setMeta: SetMeta | null;
  filter: {
    query: string;
    selectedTypes: string[];
    selectedCategories: string[];
    selectedRarities: string[];
    selectedStatus: ('want' | 'own')[];
    page: { index: number; size: number };
  };
};

const initialState: CardsState = {
  status: 'idle' as ResourceStatus,
  setMeta: null,
  filter: {
    query: '',
    selectedTypes: [],
    selectedCategories: [],
    selectedRarities: [],
    selectedStatus: [],
    page: { index: 0, size: 50 },
  },
};

const toggle = <T>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

export const FeaturePokemonCardsStore = signalStore(
  withDevtools('PokemonCardsStore'),
  withState(initialState),
  withEntities<PokemonCard>(),
  withProps(() => ({
    cardsService: inject(FeaturePokemonCardsService),
  })),
  withMethods((store) => ({
    loadCardsForSet: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { status: 'loading' as ResourceStatus })),
        switchMap((setId) =>
          store.cardsService.getSet(setId).pipe(
            switchMap((set) => {
              patchState(store, {
                setMeta: {
                  id: set.id,
                  name: set.name,
                  logo: set.logo,
                  symbol: set.symbol,
                },
              });
              if (!set.cards || set.cards.length === 0) {
                return of([] as PokemonCard[]);
              }
              return forkJoin(
                set.cards.map((card) =>
                  store.cardsService.getCard(card.id).pipe(
                    map((cardData: PokemonCard) => ({
                      ...cardData,
                      cardStatus: {
                        wantStatus: false,
                        ownStatus: {
                          own: false,
                          quantity: 0,
                        },
                      },
                    })),
                  ),
                ),
              );
            }),
            tapResponse({
              next: (cards) => {
                patchState(store, setEntities(cards), {
                  status: 'success' as ResourceStatus,
                });
              },
              error: () =>
                patchState(store, { status: 'error' as ResourceStatus }),
            }),
          ),
        ),
      ),
    ),
    updateQuery: (query: string) => {
      patchState(store, {
        filter: {
          ...store.filter(),
          query,
          page: { index: 0, size: store.filter().page.size },
        },
      });
    },
    toggleType: (type: string) => {
      patchState(store, {
        filter: {
          ...store.filter(),
          selectedTypes: toggle(store.filter().selectedTypes, type),
          page: { index: 0, size: store.filter().page.size },
        },
      });
    },
    toggleCategory: (category: string) => {
      patchState(store, {
        filter: {
          ...store.filter(),
          selectedCategories: toggle(
            store.filter().selectedCategories,
            category,
          ),
          page: { index: 0, size: store.filter().page.size },
        },
      });
    },
    toggleRarity: (rarity: string) => {
      patchState(store, {
        filter: {
          ...store.filter(),
          selectedRarities: toggle(store.filter().selectedRarities, rarity),
          page: { index: 0, size: store.filter().page.size },
        },
      });
    },
    toggleStatus: (status: 'want' | 'own') => {
      patchState(store, {
        filter: {
          ...store.filter(),
          selectedStatus: toggle(store.filter().selectedStatus, status),
          page: { index: 0, size: store.filter().page.size },
        },
      });
    },
    updatePagination: (pageIndex: number, pageSize: number) => {
      patchState(store, {
        filter: {
          ...store.filter(),
          page: { index: pageIndex, size: pageSize },
        },
      });
    },
    toggleWant: rxMethod<string>(
      pipe(
        switchMap((cardId) => {
          const card = store.entityMap()[cardId];
          if (!card) return of(null);
          return store.cardsService.updateCard(cardId, 'want').pipe(
            tapResponse({
              next: () =>
                patchState(
                  store,
                  updateEntity({
                    id: cardId,
                    changes: {
                      cardStatus: {
                        ...card.cardStatus,
                        wantStatus: !card.cardStatus.wantStatus,
                      },
                    },
                  }),
                ),
              error: () => {
                /* keep state unchanged on failure */
              },
            }),
          );
        }),
      ),
    ),
    toggleOwn: rxMethod<string>(
      pipe(
        switchMap((cardId) => {
          const card = store.entityMap()[cardId];
          if (!card) return of(null);
          return store.cardsService.updateCard(cardId, 'own').pipe(
            tapResponse({
              next: () =>
                patchState(
                  store,
                  updateEntity({
                    id: cardId,
                    changes: {
                      cardStatus: {
                        ...card.cardStatus,
                        ownStatus: {
                          ...card.cardStatus.ownStatus,
                          own: !card.cardStatus.ownStatus.own,
                          quantity: card.cardStatus.ownStatus.own
                            ? 0
                            : card.cardStatus.ownStatus.quantity + 1,
                        },
                      },
                    },
                  }),
                ),
              error: () => {
                /* keep state unchanged on failure */
              },
            }),
          );
        }),
      ),
    ),
    updateQuantity: (cardId: string, quantity: number) => {
      const card = store.entityMap()[cardId];
      if (!card) return;
      patchState(
        store,
        updateEntity({
          id: cardId,
          changes: {
            cardStatus: {
              ...card.cardStatus,
              ownStatus: {
                ...card.cardStatus.ownStatus,
                quantity,
              },
            },
          },
        }),
      );
    },
  })),
  withComputed((store) => ({
    availableTypes: computed(() => {
      const set = new Set<string>();
      store.entities().forEach((card) =>
        (card.types ?? []).forEach((t) => set.add(t)),
      );
      return [...set].sort();
    }),
    availableCategories: computed(() => {
      const set = new Set<string>();
      store.entities().forEach((card) => {
        if (card.category) set.add(card.category);
      });
      return [...set].sort();
    }),
    availableRarities: computed(() => {
      const set = new Set<string>();
      store.entities().forEach((card) => {
        if (card.rarity) set.add(card.rarity);
      });
      return [...set].sort();
    }),
  })),
  withComputed((store) => ({
    filteredCards: computed(() => {
      const entities = store.entities();
      const query = store.filter().query.trim().toLowerCase();
      const types = store.filter().selectedTypes;
      const categories = store.filter().selectedCategories;
      const rarities = store.filter().selectedRarities;
      const status = store.filter().selectedStatus;

      return entities.filter(
        (card) =>
          (query === '' || card.name.toLowerCase().includes(query)) &&
          (types.length === 0 ||
            (card.types ?? []).some((t) => types.includes(t))) &&
          (categories.length === 0 ||
            (card.category ? categories.includes(card.category) : false)) &&
          (rarities.length === 0 ||
            (card.rarity ? rarities.includes(card.rarity) : false)) &&
          (status.length === 0 ||
            (status.includes('want') && card.cardStatus.wantStatus) ||
            (status.includes('own') && card.cardStatus.ownStatus.own)),
      );
    }),
  })),
  withComputed((store) => ({
    pagedCards: computed(() => {
      const start = store.filter().page.index * store.filter().page.size;
      const end = start + store.filter().page.size;
      return store.filteredCards().slice(start, end);
    }),
  })),
  withHooks((store) => ({
    onInit() {
      // setId is provided by component via loadCardsForSet on init
      void store;
    },
  })),
);
