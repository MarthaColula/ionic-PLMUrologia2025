import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerAtlasPageRoutingModule } from './ver-atlas-routing.module';

import { VerAtlasPage } from './ver-atlas.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom-13';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerAtlasPageRoutingModule,
    ComponentesModule,
    PdfViewerModule,
    PinchZoomModule,
  ],
  declarations: [VerAtlasPage]
})
export class VerAtlasPageModule {}
