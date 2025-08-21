import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContenidoActualizadoPage } from './contenido-actualizado.page';

const routes: Routes = [
  {
    path: '',
    component: ContenidoActualizadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContenidoActualizadoPageRoutingModule {}
