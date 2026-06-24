import { signalStore, withState } from '@ngrx/signals';

export const FeatureRegisterStore = signalStore(
  { providedIn: 'root' },
  withState({}),
);
