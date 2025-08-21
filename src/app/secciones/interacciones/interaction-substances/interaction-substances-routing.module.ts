import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractionSubstancesPage } from './interaction-substances.page';

const routes: Routes = [
  {
    path: '',
    component: InteractionSubstancesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteractionSubstancesPageRoutingModule {}
