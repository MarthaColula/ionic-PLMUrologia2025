import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractionProductsPage } from './interaction-products.page';

const routes: Routes = [
  {
    path: '',
    component: InteractionProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteractionProductsPageRoutingModule {}
