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
    selectedSeries: SeriesBrief[];
    page: {
        index: number;
        size: number;
    }
  };
};

const initialState: PokemonState = {
  status: 'idle' as ResourceStatus,
  filter: { query: '', selectedSeries: [], page: { index: 0, size: 50 } },
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

            patchState(store, { filter: { ...store.filter(), selectedSeries, page: { index: 0, size: store.filter().page.size } } });
        },
        updateQuery: (query: string) => {
            patchState(store, { filter: { ...store.filter(), query, page: { index: 0, size: store.filter().page.size } } });
        },
        updatePagination: (pageIndex: number, pageSize: number) => {
            patchState(store, { filter: { ...store.filter(), page: { index: pageIndex, size: pageSize } } });
        }
    })),
    withComputed((store) => ({
        filteredSeries: computed(() => {
            const entities = store.entities();
            const selectedSeries = store.filter().selectedSeries;
            const query = store.filter().query.trim().toLowerCase();
            
            return entities.filter(entity =>
                (query === '' || entity.name.toLowerCase().includes(query)) &&
                (selectedSeries.length === 0 || selectedSeries.some(series => entity.series.id === series.id))
            );
        })
    })),
    withComputed((store) => ({
        pagedSets: computed(() => {
            const start = store.filter().page.index * store.filter().page.size;
            const end = start + store.filter().page.size;

            return store.filteredSeries().slice(start, end);
        })
    })),
    withHooks((store) => ({
        onInit() {
            store.loadPokemonSet();
        }
    }))
);