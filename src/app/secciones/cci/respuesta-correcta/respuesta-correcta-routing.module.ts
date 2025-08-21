import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RespuestaCorrectaPage } from './respuesta-correcta.page';

const routes: Routes = [
  {
    path: '',
    component: RespuestaCorrectaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RespuestaCorrectaPageRoutingModule {}
