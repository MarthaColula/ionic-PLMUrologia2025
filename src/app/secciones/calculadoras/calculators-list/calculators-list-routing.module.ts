import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculatorsListPage } from './calculators-list.page';

const routes: Routes = [
  {
    path: '',
    component: CalculatorsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculatorsListPageRoutingModule {}
