import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-pokemon-set-skeleton',
  imports: [],
  templateUrl: './pokemon-set-skeleton.html',
  styleUrl: './pokemon-set-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSetSkeleton {}
