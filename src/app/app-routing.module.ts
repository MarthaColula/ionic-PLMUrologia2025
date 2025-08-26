import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
  {
    path: 'home',
    loadChildren: () => import('./secciones/home/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'buscador',
    loadChildren: () => import('./secciones/buscador-productos/buscador/buscador.module').then( m => m.BuscadorPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./secciones/buscador-productos/favoritos/favoritos.module').then(m => m.FavoritosPageModule)
  },
  {
    path: 'ippa/:categoryId/:divisionId/:pharmaFormId/:productId',
    loadChildren: () => import('./secciones/buscador-productos/ippa/ippa.module').then( m => m.IppaPageModule)
  },
  {
    path: 'lista-cie',
    loadChildren: () => import('./secciones/buscador-productos/lista-cie/lista-cie.module').then( m => m.ListaCiePageModule)
  },
  {
    path: 'lista-laboratorios',
    loadChildren: () => import('./secciones/buscador-productos/lista-laboratorios/lista-laboratorios.module').then( m => m.ListaLaboratoriosPageModule)
  },
  {
    path: 'lista-productos',
    loadChildren: () => import('./secciones/buscador-productos/lista-productos/lista-productos.module').then( m => m.ListaProductosPageModule)
  },
  {
    path: 'lista-sustancias',
    loadChildren: () => import('./secciones/buscador-productos/lista-sustancias/lista-sustancias.module').then( m => m.ListaSustanciasPageModule)
  },
  {
    path: 'interacciones-medicamentosas',
    loadChildren: () => import('./secciones/interacciones/interacciones-medicamentosas/interacciones-medicamentosas.module').then( m => m.InteraccionesMedicamentosasPageModule)
  },
  {
    path: 'interaction-icd',
    loadChildren: () => import('./secciones/interacciones/interaction-icd/interaction-icd.module').then( m => m.InteractionIcdPageModule)
  },
  {
    path: 'interaction-labs',
    loadChildren: () => import('./secciones/interacciones/interaction-labs/interaction-labs.module').then( m => m.InteractionLabsPageModule)
  },
  {
    path: 'interaction-products',
    loadChildren: () => import('./secciones/interacciones/interaction-products/interaction-products.module').then( m => m.InteractionProductsPageModule)
  },
  {
    path: 'interaction-results',
    loadChildren: () => import('./secciones/interacciones/interaction-results/interaction-results.module').then( m => m.InteractionResultsPageModule)
  },
  {
    path: 'interaction-search-engine',
    loadChildren: () => import('./secciones/interacciones/interaction-search-engine/interaction-search-engine.module').then( m => m.InteractionSearchEnginePageModule)
  },
  {
    path: 'interaction-substances',
    loadChildren: () => import('./secciones/interacciones/interaction-substances/interaction-substances.module').then( m => m.InteractionSubstancesPageModule)
  },
  {
    path: 'interactions',
    loadChildren: () => import('./secciones/interacciones/interactions/interactions.module').then( m => m.InteractionsPageModule)
  },
  {
    path: 'modal-info',
    loadChildren: () => import('./secciones/interacciones/modal-info/modal-info.module').then( m => m.ModalInfoPageModule)
  },
  {
    path: 'abstracts',
    loadChildren: () => import('./secciones/contenido-actualizado/abstracts/abstracts.module').then( m => m.AbstractsPageModule)
  },
  {
    path: 'resumen-abstract',
    loadChildren: () => import('./secciones/contenido-actualizado/resumen-abstract/resumen-abstract.module').then( m => m.ResumenAbstractPageModule)
  },
  {
    path: 'atlas',
    loadChildren: () => import('./secciones/atlas/atlas/atlas.module').then( m => m.AtlasPageModule)
  },
  {
    path: 'cci',
    loadChildren: () => import('./secciones/cci/cci/cci.module').then( m => m.CciPageModule)
  },
  {
    path: 'ver-cci',
    loadChildren: () => import('./secciones/cci/ver-cci/ver-cci.module').then( m => m.VerCciPageModule)
  },
  {
    path: 'calculadoras',
    loadChildren: () => import('./secciones/calculadoras/calculadoras/calculadoras.module').then( m => m.CalculadorasPageModule)
  },
  {
    path: 'calculator-overview',
    loadChildren: () => import('./secciones/calculadoras/calculator-overview/calculator-overview.module').then(m => m.CalculatorOverviewPageModule)
  },
  {
    path: 'contenido-actualizado',
    loadChildren: () => import('./secciones/contenido-actualizado/contenido-actualizado/contenido-actualizado.module').then( m => m.ContenidoActualizadoPageModule)
  },
  {
    path: 'pubmed',
    loadChildren: () => import('./secciones/contenido-actualizado/pubmed/pubmed.module').then( m => m.PubmedPageModule)
  },
  {
    path: 'podcast',
    loadChildren: () => import('./secciones/podcast/podcast/podcast.module').then( m => m.PodcastPageModule)
  },
  {
    path: 'reproductor-podcast',
    loadChildren: () => import('./secciones/podcast/reproductor-podcast/reproductor-podcast.module').then( m => m.ReproductorPodcastPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./secciones/configuracion/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'configuracion-notificaciones',
    loadChildren: () => import('./secciones/configuracion/configuracion-notificaciones/configuracion-notificaciones.module').then( m => m.ConfiguracionNotificacionesPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./secciones/configuracion/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: 'creditos',
    loadChildren: () => import('./secciones/configuracion/creditos/creditos.module').then( m => m.CreditosPageModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./secciones/configuracion/cuenta/cuenta.module').then( m => m.CuentaPageModule)
  },
  {
    path: 'notificaciones-push',
    loadChildren: () => import('./secciones/configuracion/notificaciones-push/notificaciones-push.module').then( m => m.NotificacionesPushPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./secciones/configuracion/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./secciones/configuracion/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'sugerencias',
    loadChildren: () => import('./secciones/configuracion/sugerencias/sugerencias.module').then( m => m.SugerenciasPageModule)
  },
  {
    path: 'respuesta-correcta',
    loadChildren: () => import('./secciones/cci/respuesta-correcta/respuesta-correcta.module').then( m => m.RespuestaCorrectaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
