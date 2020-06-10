import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersPage } from './offers.page';

const routes: Routes = [
  {
    path: '',
    component: OffersPage
  },
  {
    path: 'new',
    loadChildren: () => import('./new-offers/new-offers.module').then( m => m.NewOffersPageModule)
  },
  {
    path: 'edit/:placeId',
    loadChildren: () => import('./edit-offers/edit-offers.module').then( m => m.EditOffersPageModule)
  },
  {
    path: ':placeId',
    loadChildren: () => import('./offer-bookings/offer-bookings.module').then( m => m.OfferBookingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersPageRoutingModule {}
