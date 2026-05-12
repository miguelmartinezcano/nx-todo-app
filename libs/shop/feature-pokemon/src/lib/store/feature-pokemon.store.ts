import { signalStore, withState, withMethods, withHooks, withProps, patchState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PokemonSet } from '../model/feature-pokemon.model';
import { FeaturePokemonService } from '../service/feature-pokemon.service';
import { inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type PokemonState = {
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: PokemonState = {
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const FeaturePokemonStore = signalStore(
    withState(initialState),
    withEntities<PokemonSet>(),
    withProps(() => ({
        featurePokemonService: inject(FeaturePokemonService)
    })),
    withMethods((store) => ({
        loadPokemonSet: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() =>
                    store.featurePokemonService.getPokemonSets().pipe(
                        tapResponse({
                            next: (set) => patchState(store, setEntities(set), { isLoading: false }),
                            error: () => patchState(store, { isLoading: false }),
                        })
                    )
                )
            )
        )
    })),
    withHooks((store) => ({
        onInit() {
            store.loadPokemonSet();
        }
    })),
    withDevtools('PokemonSetStore')
);