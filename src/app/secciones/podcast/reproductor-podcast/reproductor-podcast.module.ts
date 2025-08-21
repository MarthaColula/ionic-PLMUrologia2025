import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReproductorPodcastPageRoutingModule } from './reproductor-podcast-routing.module';

import { ReproductorPodcastPage } from './reproductor-podcast.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReproductorPodcastPageRoutingModule,
    ComponentesModule
  ],
  declarations: [ReproductorPodcastPage]
})
export class ReproductorPodcastPageModule {}
