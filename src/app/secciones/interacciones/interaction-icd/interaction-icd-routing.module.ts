import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractionIcdPage } from './interaction-icd.page';

const routes: Routes = [
  {
    path: '',
    component: InteractionIcdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteractionIcdPageRoutingModule {}
