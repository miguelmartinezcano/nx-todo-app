import { signalStore, withState, withMethods, withHooks, withProps, patchState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PokemonSet } from '../model/feature-pokemon.model';
import { FeaturePokemonService } from '../service/feature-pokemon.service';
import { inject } from '@angular/core';
import { delay, of, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ResourceStatus } from '@angular/core';

type PokemonState = {
  status: ResourceStatus;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: PokemonState = {
  status: 'idle' as ResourceStatus,
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
                tap(() => patchState(store, { status: 'loading' as ResourceStatus })),
                switchMap(() =>
                    of(null).pipe(
                        delay(2000),
                        switchMap(() =>
                            store.featurePokemonService.getPokemonSets().pipe(
                                tapResponse({
                                    next: (set) => patchState(store, setEntities(set), { status: 'success' as ResourceStatus }),
                                    error: () => patchState(store, { status: 'error' as ResourceStatus }),
                                })
                            )
                        )
                    )
                )
            )
        )
    })),
    withDevtools('PokemonSetStore'),
    withHooks((store) => ({
        onInit() {
            store.loadPokemonSet();
        }
    }))
);