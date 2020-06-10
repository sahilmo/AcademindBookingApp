import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PlacePage } from "./place.page";

const routes: Routes = [
  { path: '', redirectTo: 'tabs' ,pathMatch:'full'},
  {
    path: 'tabs',
    component: PlacePage,
    children: [
      {
        path: 'discover',
        loadChildren: () =>
          import("./discover/discover.module").then(
            (m) => m.DiscoverPageModule
          ),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import("./offers/offers.module").then((m) => m.OffersPageModule),
      },
      {
        path:'',
        redirectTo:'discover',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacePageRoutingModule {}
