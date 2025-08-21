import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractionLabsPage } from './interaction-labs.page';

const routes: Routes = [
  {
    path: '',
    component: InteractionLabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteractionLabsPageRoutingModule {}
