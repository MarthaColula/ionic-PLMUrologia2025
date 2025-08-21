import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbstractsPage } from './abstracts.page';

const routes: Routes = [
  {
    path: '',
    component: AbstractsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbstractsPageRoutingModule {}
