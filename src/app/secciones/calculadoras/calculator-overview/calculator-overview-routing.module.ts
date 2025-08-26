import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalculatorOverviewPage } from './calculator-overview.page';

const routes: Routes = [
  {
    path: '',
    component: CalculatorOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculatorOverviewPageRoutingModule {}
