export interface CardBrief {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

export interface PokemonSetDetail {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cards: CardBrief[];
}

export type CardStatus = {
  wantStatus: boolean;
  ownStatus: OwnStatus;
};

export type OwnStatus = {
  own: boolean;
  quantity: number;
};

export interface PokemonCard {
  id: string;
  localId: string;
  name: string;
  image?: string;
  category: string;
  rarity?: string;
  types?: string[];
  cardStatus: CardStatus;
}
