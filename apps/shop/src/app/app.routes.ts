import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@org/shop/feature-products').then((m) => m.featureProductsRoutes),
  },
  {
    path: 'pokemon/:setId',
    loadChildren: () =>
      import('@org/feature-pokemon-cards').then(
        (m) => m.featurePokemonCardsRoutes,
      ),
  },
  {
    path: 'pokemon',
    loadChildren: () =>
      import('@org/feature-pokemon-set').then((m) => m.featurePokemonSetRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@org/shop/feature-product-detail').then(
        (m) => m.featureProductDetailRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
