import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteractionSearchEnginePage } from './interaction-search-engine.page';

const routes: Routes = [
  {
    path: '',
    component: InteractionSearchEnginePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteractionSearchEnginePageRoutingModule {}
