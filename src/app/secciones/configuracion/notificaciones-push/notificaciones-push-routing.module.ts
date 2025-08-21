import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionesPushPage } from './notificaciones-push.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionesPushPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificacionesPushPageRoutingModule {}
