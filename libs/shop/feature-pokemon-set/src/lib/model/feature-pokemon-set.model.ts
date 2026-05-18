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
  setStatus: setStatus
}

export interface setStatus {
  want: number;
  own: number;
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

export const PokemonSerieses = [
  {
    id: 'base',
    name: 'Base',
  },
  {
    id: 'bw',
    name: 'Black/White',
  },
  {
    id: 'col',
    name: 'Colosseum',
  },
  {
    id: 'dp',
    name: 'Diamond/Pearl',
  },
  {
    id: 'ecard',
    name: 'E-Card',
  },
  {
    id: 'ex',
    name: 'Ex',
  },
  {
    id: 'gym',
    name: 'Gym',
  },
  {
    id: 'hgss',
    name: 'HeartGold/SoulSilver',
  },
  {
    id: 'lc',
    name: 'Legendary Collection',
  },
  {
    id: 'me',
    name: 'Mega Evolution',
  },
  {
    id: 'misc',
    name: 'Misc',
  },
  {
    id: 'neo',
    name: 'Neo',
  },
  {
    id: 'pl',
    name: 'Platinum',
  },
  {
    id: 'pop',
    name: 'POP Series',
  },
  {
    id: 'sm',
    name: 'Sun/Moon',
  },
  {
    id: 'sv',
    name: 'Scarlet/Violet',
  },
  {
    id: 'swsh',
    name: 'Sword/Shield',
  },
  {
    id: 'tcgp',
    name: 'TCG Promos',
  },
  {
    id: 'xy',
    name: 'X/Y',
  },
] as const;
