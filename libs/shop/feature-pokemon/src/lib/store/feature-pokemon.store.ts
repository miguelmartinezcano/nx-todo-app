import { signalStore, withState, withMethods, withHooks, withProps, withComputed, patchState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { PokemonSerieses, PokemonSet, SeriesBrief } from '../model/feature-pokemon.model';
import { FeaturePokemonService } from '../service/feature-pokemon.service';
import { inject, computed } from '@angular/core';
import { of, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ResourceStatus } from '@angular/core';

type PokemonState = {
  status: ResourceStatus;
  filter: { 
    query: string; 
    order: 'asc' | 'desc' 
    selectedSeries: SeriesBrief[];
  };
};

const initialState: PokemonState = {
  status: 'idle' as ResourceStatus,
  filter: { query: '', order: 'asc', selectedSeries: [] },
};

export const FeaturePokemonStore = signalStore(
    withDevtools('PokemonSetStore'),
    withState(initialState),
    withEntities<PokemonSet>(),
    withProps(() => ({
        featurePokemonService: inject(FeaturePokemonService),
        calculateSeries: (set: PokemonSet): SeriesBrief => {
            const id = set.logo?.split('/en/')[1]?.split('/')[0] ?? 'misc';
            const series = PokemonSerieses.find((series) => series.id === id) ?? PokemonSerieses.find((series) => series.id === 'misc')!;
            return {
                id,
                name: series.name
            }
        }
    })),
    withMethods((store) => ({
        loadPokemonSet: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { status: 'loading' as ResourceStatus })),
                switchMap(() =>
                    of(null).pipe(
                        // delay(2000),
                        switchMap(() =>
                            store.featurePokemonService.getPokemonSets().pipe(
                                tapResponse({
                                    next: (sets) => {
                                        const updatedSets = sets.map((set) => ({
                                            ...set,
                                            series: store.calculateSeries(set)
                                        }));
                                        patchState(store, setEntities(updatedSets), { status: 'success' as ResourceStatus });
                                    },
                                    error: () => patchState(store, { status: 'error' as ResourceStatus }),
                                })
                            )
                        )
                    )
                )
            )
        ),
        updateSelectedSeries: (series: SeriesBrief) => {
            const selectedSeries = store.filter().selectedSeries.some((selectedSeries) => selectedSeries.id === series.id)
                ? store.filter().selectedSeries.filter((selectedSeries) => selectedSeries.id !== series.id)
                : [...store.filter().selectedSeries, series];

            patchState(store, { filter: { ...store.filter(), selectedSeries } });
        }
    })),
    withComputed((store) => ({
        filteredSeries: computed(() => {
            const entities = store.entities();
            const selectedSeries = store.filter().selectedSeries;
            
            if (selectedSeries.length === 0) {
                return entities;
            }
            
            return entities.filter(entity => 
                selectedSeries.some(series => entity.series.id === series.id)
            );
        })
    })),
    withHooks((store) => ({
        onInit() {
            store.loadPokemonSet();
        }
    }))
);