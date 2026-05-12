export interface PokemonSet {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  cardCount: CardCountObject;
  series: SeriesBrief;
  tcgOnline?: string;
  releaseDate: string;
  legal: LegalObject;
  boosters?: Booster[];
  cards: CardBrief[];
}

export interface CardCountObject {
  firstEd: number;
  holo: number;
  official: number;
  reverse: number;
  total: number;
}

export interface SeriesBrief {
  id: string;
  name: string;
}

export interface LegalObject {
  standard: string;
  expanded: string;
}

export interface Booster {
  id: string;
  name: string;
  logo?: string;
  artwork_front?: string;
  artwork_back?: string;
}

export interface CardBrief {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

