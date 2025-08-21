import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { PopmenuComponent } from './popmenu/popmenu.component';
import { InteractionFooterComponent } from './interaction-footer/interaction-footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    HeaderComponent,
    NavigationHeaderComponent,
    PopmenuComponent,
    InteractionFooterComponent,
    FooterComponent
  ],
  exports: [
    HeaderComponent,
    NavigationHeaderComponent,
    PopmenuComponent,
    InteractionFooterComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ComponentesModule { }
