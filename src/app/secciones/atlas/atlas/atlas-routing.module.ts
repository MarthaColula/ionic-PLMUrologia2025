import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtlasPage } from './atlas.page';

const routes: Routes = [
  {
    path: '',
    component: AtlasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtlasPageRoutingModule {}
