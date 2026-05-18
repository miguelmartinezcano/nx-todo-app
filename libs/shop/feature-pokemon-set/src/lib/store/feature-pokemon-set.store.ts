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
import {
  PokemonSerieses,
  PokemonSet,
  SeriesBrief,
} from '../model/feature-pokemon-set.model';
import { FeaturePokemonSetService } from '../service/feature-pokemon-set.service';
import { inject, computed } from '@angular/core';
import { of, pipe, switchMap, tap, delay } from 'rxjs';
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
    };
  };
};

const initialState: PokemonState = {
  status: 'idle' as ResourceStatus,
  filter: { query: '', selectedSeries: [], page: { index: 0, size: 50 } },
};

export const FeaturePokemonSetStore = signalStore(
  { providedIn: 'root' },
  withDevtools('PokemonSetStore'),
  withState(initialState),
  withEntities<PokemonSet>(),
  withProps(() => ({
    featurePokemonService: inject(FeaturePokemonSetService),
    calculateSeries: (set: PokemonSet): SeriesBrief => {
      const id = set.logo?.split('/en/')[1]?.split('/')[0] ?? 'misc';
      const series = PokemonSerieses.find((s) => s.id === id) ??
        PokemonSerieses.find((s) => s.id === 'misc') ?? {
          id: 'misc',
          name: 'Misc',
        };
      return {
        id,
        name: series.name,
      };
    },
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
                  next: (sets) => {
                    const updatedSets = sets.map((set) => ({
                      ...set,
                      series: store.calculateSeries(set),
                      setStatus: {
                        want: 0,
                        own: 0,
                      },
                    }));
                    patchState(store, setEntities(updatedSets), {
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
      ),
    ),
    updateSelectedSeries: (series: SeriesBrief) => {
      const selectedSeries = store
        .filter()
        .selectedSeries.some(
          (selectedSeries) => selectedSeries.id === series.id,
        )
        ? store
            .filter()
            .selectedSeries.filter(
              (selectedSeries) => selectedSeries.id !== series.id,
            )
        : [...store.filter().selectedSeries, series];

      patchState(store, {
        filter: {
          ...store.filter(),
          selectedSeries,
          page: { index: 0, size: store.filter().page.size },
        },
      });
    },
    updateQuery: (query: string) => {
      patchState(store, {
        filter: {
          ...store.filter(),
          query,
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
    adjustSetStatus: (
      setId: string,
      delta: { want?: number; own?: number },
    ) => {
      const current = store.entityMap()[setId];
      if (!current) return;
      patchState(
        store,
        updateEntity({
          id: setId,
          changes: {
            setStatus: {
              want: Math.max(0, current.setStatus.want + (delta.want ?? 0)),
              own: Math.max(0, current.setStatus.own + (delta.own ?? 0)),
            },
          },
        }),
      );
    },
  })),
  withComputed((store) => ({
    filteredSeries: computed(() => {
      const entities = store.entities();
      const selectedSeries = store.filter().selectedSeries;
      const query = store.filter().query.trim().toLowerCase();

      return entities.filter(
        (entity) =>
          (query === '' || entity.name.toLowerCase().includes(query)) &&
          (selectedSeries.length === 0 ||
            selectedSeries.some((series) => entity.series.id === series.id)),
      );
    }),
  })),
  withComputed((store) => ({
    pagedSets: computed(() => {
      const start = store.filter().page.index * store.filter().page.size;
      const end = start + store.filter().page.size;

      return store.filteredSeries().slice(start, end);
    }),
  })),
  withHooks((store) => ({
    onInit() {
      store.loadPokemonSet();
    },
  })),
);
