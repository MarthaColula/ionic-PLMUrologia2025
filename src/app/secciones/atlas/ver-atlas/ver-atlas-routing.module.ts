import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerAtlasPage } from './ver-atlas.page';

const routes: Routes = [
  {
    path: '',
    component: VerAtlasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerAtlasPageRoutingModule {}
