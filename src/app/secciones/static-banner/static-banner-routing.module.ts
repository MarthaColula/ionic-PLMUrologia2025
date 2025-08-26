import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaticBannerPage } from './static-banner.page';

const routes: Routes = [
  {
    path: '',
    component: StaticBannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticBannerPageRoutingModule {}
