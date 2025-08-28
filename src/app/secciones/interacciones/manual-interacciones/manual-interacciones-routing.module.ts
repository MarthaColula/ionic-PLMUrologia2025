import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualInteraccionesPage } from './manual-interacciones.page';

const routes: Routes = [
  {
    path: '',
    component: ManualInteraccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualInteraccionesPageRoutingModule {}
