export enum SearchType {
    parametrizado = 1,
    texto
}

export enum Source {
    Portal_PLM_2010 = 1,
    CONEXIFARMA = 26,
    DISPOSITIVO_MOVIL = 27,
    CLIENTE_SERVIDOR = 29,
    MEDICAMENTOSPLM_COM_CO = 30,
    ASESORES_BAYER = 31,
    DIRECTORIO_MEDICO = 32,
    DIRECTORIO_VETERINARIO = 33,
    MEDICAMENTOSPLM_COM = 34,
    ACCESOS_CORTESIA_MAYOLI = 35,
    COLEGIO_MEDICO_DOMINICANO = 36,
    COLEGIO_MEDICO_COSTA_RICA = 37,
    CLUB_FARMA = 38,
    FRAGUA = 40,
    ACCESOS_CORTESIA_SANDOZ = 41,
    COLEGIO_MEDICO_PERU = 42,
    EXPEDIENTE_CLINICO_ELECTRONICO_MEXICO = 43,
    ACCESOS_PRAXYS_COLOMBIA = 44
}

export enum TrackingSource {
    portal = 1,
    Servicio_móbil,
    Servicio_Web,
    Cliente_Servidor,
    Servidor_Servidor
}

export enum Entities {
    Indicaciones = 1,
    Laboratorios = 2,
    Medicamentos = 3,
    SustanciasActivas = 4,
    Terapeutico = 5,
    MedicamentosMonoingredientesporATCySustancia = 6,
    MedicamentosMonoingredientesporLaboratorioySustancia = 7,
    MedicamentosMonoingredientesporSustancia = 8,
    MedicamentosMultiingredientesporATCySustancia = 9,
    MedicamentosMultiingredientesporLaboratorioySustancia = 10,
    MedicamentosMultiingredientesporSustancia = 11,
    MedicamentosporATC = 12,
    MedicamentosporIndicacion = 13,
    MedicamentosporLaboratorio = 14,
    MedicamentosporLaboratorioeIndicacion = 15,
    MedicamentosporLaboratorioySustancia = 16,
    MedicamentosporSustancia = 17,
    LaboratoriosporIndicacion = 18,
    LaboratoriosporSustancia = 19,
    SustanciasporATC = 20,
    SustanciasporLaboratorio = 21,
    SustanciasporMedicamento = 22,
    SustanciasporMedicamentoySustancia = 23,
    IndicacionesporMedicamento = 24,
    TerapeuticoporMedicamento = 25,
    Contenido = 26,
    ContenidoporAtributo = 27,
    Sintomas = 28,
    MedicamentosporSintoma = 29,
    BusquedaTexto = 30,
    Prescripcion = 31,
    Busquedanoencontrada = 32,
    IndicacionesporLaboratorio = 33,
    PresentacionesporProducto = 34,
    Especies = 35,
    MedicamentosporEspecie = 36,
    ICD = 37,
    MedicamentosporICD = 38,
    ICDporMedicamentos = 39,
    Semillas = 49,
    Categorias = 50,
    UsosAgroquimicos = 51,
    Productos = 52,
    Cultivos = 53,
    Productosporsemilla = 54,
    Sustanciaporproducto = 55,
    Productosporcategoria = 56,
    Productosporusoagroquimico = 57,
    Productosporcultivos = 58,
    Productosporsustancias = 59,
    ProductosporcategoriayLaboratorio = 60,
    ClienteGuia = 61,
    ProductoGuia = 62,
    MarcaGuia = 63,
    Enciclopedias = 64,
    Enfermedades = 65,
    PalabrasClave = 66,
    Enciclopediasportipo = 67,
    EnciclopediasporICD = 68,
    EnciclopediasporPalabraClave = 69,
    EnciclopediasporEnfermedad = 70,
    EnciclopediasporProducto = 71,
    EnciclopediasporTextoyporTipo = 72,
    ProductosporEnciclopedia = 73,
    EnfermedadesporEnciclopedia = 74,
    EnfermedadesporICD = 75,
    IM_Prescripcion = 76,
    IM_Modulo = 77,
    MarcasporClienteGuia = 78,
    ClientesporProductoGuia = 79,
    ProductosporClienteGuia = 80,
    ClientesporMarcaGuia = 81,
    Interacciones = 82,
    InteraccionesPorSustanciaActiva = 83,
    InteraccionesPorGrupoFarmacologico = 84,
    CategoriasGuia = 85,
    CategoriasporCategoriaPadreGuia = 86,
    ProductosporCategoriaGuia = 87,
    ClientesporCategoriaGuia = 88,
    CategoriasporClienteGuia = 89,
    CategoriasporCategoriaPadreyClienteGuia = 90,
    ProductosporCategoriayporClienteGuia = 91,
    MarcasAnalisisClinicos = 92,
    CompaniasAnalisisClinicos = 93,
    CompaniasporMarcaAnalisisClinicos = 94,
    CompaniasporCiudadAnalisisClinicos = 95,
    ProductosporindiceAnalisisClinicos = 96,
    ProductosporSeccionAnalisisClinicos = 97,
    SeccionesporindiceAnalisisClinicos = 98,
    SeccionesporSeccionPadreAnalisisClinicos = 99,
    ProductosporCompaniaAnalisisClinicos = 100,
    PillBooks = 101,
    PillBooksporSustancia = 102,
    PillBooksporATC = 103,
    PillBooksporICD = 104,
    PillBooksporMedicamento = 105,
    CompaniasporCiudadporSeccionAnalisisClinicos = 106,
    CompaniasporSeccionAlimentario = 107,
    CompaniasporSeccionporCiudadAlimentario = 108,
    ProductosporCompaniaAlimentario = 109,
    ProductosporindiceAlimentario = 110,
    ProductosporSeccionAlimentario = 111,
    SeccionesporSeccionPadreAlimentario = 112,
    ClienteAnuncianteGuia = 113,
    ClienteInternacionalGuia = 114,
    ClienteSucursalGuia = 115,
    Informacionpormedicamento = 116

}

export enum InfoEntities {
    Abstracts = 1,
    Banners = 2,
    Calculator = 3,
    Event = 4,
    News = 5,
    LinksInterest = 6,
    Schemes = 7,
    ScientificArticles = 8,
    Questionnaires = 9,
    Pharmacy = 10,
    WorkoutRoutines = 11,
    Diets = 12,
    NewsHarvard = 13,
    Atlas = 14,
    Distributors = 15,
    Hospitals = 16,
    Doctors = 17,
    Videos = 18,
    ClinicalPracticeGuides = 19,
    InformationForPatient = 20,
    AttachmentPrograms = 22,
    Guides = 21,
    Attribute = 27,
    Promotions = 46,
    ProductMonographs = 47,
    InstructionalVideos = 48,
    ProductInstructions = 49,
    FoodPlan = 50,
    Monitoring = 51,
    MedicalEncyclopedia = 52,
    CofeprisInformation = 53,
    PointsSale = 54,
    Magazine = 55,
    Manuals = 56,
    Prices = 57,
    PubMed = 58,
    MedicalClient = 59,
    Treatments = 60,
    Representatives = 61,
    Laboratories = 62,
    SponsorNews = 63,
    Algorithm = 64,
    Advisors = 65,
    VideosInfotipsBayerPorcinos = 66,
    DiseaseSolutions = 67,
    VideosBayer = 68,
    SkinResearchEucerin = 69,
    EucerinPathologies = 70,
    MedicalArticles = 71,
    EucerinSkinCare = 72,
    SponsorInformation = 73,
    BiogentecProducts = 74,
    SponsorEvents = 75,
    MedicalReferences = 76,
    WebCast = 77,
    Infographics = 78,
    Illustrations = 79,
    EvidenceMedicine = 80,
    Podcast= 118,
    Section = 119,
    CasosClinicosInteractivos  = 120
}

export enum CompanyClientTypes {
    GENERICO,
    FARMACIA,
    LABORATORIO,
    HOSPITAL_PRIVADO,
    HOSPITAL_PUBLICO,
    DISTRIBUIDOR,
    HOSPITAL,
    PUNTO_DE_VENTA,
    LABORATORIO_CLINICO
}

export enum EventsCategory {
    CULTURALES = 1,
    DEPORTIVOS = 2,
    ENTRETENIMIENTO = 3,
    MUSICALES = 4,
    EXPOSICIONES = 5,
    SALUD = 6,
    NACIONALES = 7,
    INTERNACIONALES = 8
}

export enum Target {
    Cliente_Servidor = 1,
    Web = 2,
    Android = 3,
    BlackBerry = 4,
    iOS_iPhone = 5,
    iOS_iPad = 6,
    Servidor_Servidor = 7,
    Windows_Phone = 8,
    Servicio_Web = 9
}

export enum InformationType {
    Notas_Medicas = 1,
    Sitios_Web = 2,
    Abstracts = 3,
    Banners = 4,
    Atlas = 5,
    Articulos_Cientificos = 6,
    Refencias_Medicas = 7,
    Promociones = 8,
    Guias_de_Practica_Clinica = 9,
    Videos_Interes = 10,
    Dietas_Hombres = 11,
    Dietas_Mujeres = 12,
    Precios = 13,
    Manuales = 14,
    Revistas = 15,
    Informacion_Pacientes = 16,
    Guias = 17,
    Cuestionarios = 18,
    Programas = 19,
    Monografias_Productos = 20,
    Estudios_Clinicos = 21,
    Veterinarios = 22,
    Videos_Instructivos = 23,
    Plan_Alimentacion = 24,
    Rutinas_Ejercicios = 25,
    Soluciones_a_enfermedades = 26,
    Videos_Soluciones_Bayer_Bovinos = 27,
    Videos_Soluciones_Bayer_Porcinos = 28,
    Videos_Bayer = 29,
    Videos_Infotips_Bayer_Bovinos = 30,
    Videos_Infotips_Bayer_Porcinos = 31,
    Noticias_Patrocinador = 32,
    Videos_Bayer_Soluciones = 33,
    Videos_Recomendaciones_Bayer_Bovinos = 34,
    Videos_Recomendaciones_Bayer_Porcinos = 35,
    Bayvet_Pills = 36,
    Informacion_Corporativa_Bayer = 37,
    Videos_Infotips_Bayer_Bienestar_Animal = 38,
    Newsletters_Bayer = 39,
    Libros_Bienestar_Bovino_Bayer = 40,
    Curso_Educacion_Medica_Continua = 41,
    Rangos_Referencia_Sanguinea_Bayer = 42,
    Bioquimica_Sanguinea_Animales_Adultos_Bayer = 43,
    Guias_Gina = 44,
    Guias_Gold = 45,
    Eventos_Patrocinador = 46,
    Distribuidores = 47,
    Ilustraciones = 48,
    Infografias = 49,
    videos = 50,
    Medicina_basada_en_evidencia = 51,
    Videos_Bayer_Animales_de_Compania = 52,
    Videos_Bayer_Aves = 53,
    Videos_Bayer_Peces_y_camaron_ = 54,
    Videos_Eventos_Bayer = 55,
    Abstracts_Proveedor = 56,
    Articulos_Tanatologia = 57,
    Consensos = 58,
    Atencion_clinica = 59,
    Salud_publica = 60,
    Gestion_de_servicios = 61,
    Estudios_relacionados = 62,
    Editoriales_y_opinion = 63,
    Webinars = 64,
    Podcast = 65,
    Contenidos_de_Anemia = 66,
    Contenidos_de_Neurologia = 67,
    Contenidos_de_Probioticos = 68,
    Calculadora = 69,
    Algoritmo = 70,
    News_PLM = 71,
    Ayudas_Visuales = 76,
    Casos_clinicos_interactivos = 77,
    Articulos_Open_Acess = 78
}

export enum Section {
    INDICES = 1,
    MENUS = 2,
    NOVEDADES = 3,
    OPCIONES = 4,
    RESULTADOS = 5,
    VINCULOS_DE_INTERES = 6,
    BANNERS = 7,
    NOTICIAS = 8,
    PLMONLINE = 9,
    EDITORIAL = 10,
    SERVICIOS = 11,
    ATLAS = 12,
    ARTICULOS_CIENTIFICOS = 13,
    ESQUEMAS = 14,
    FARMACIAS = 15,
    REPRESENTANTES = 16,
    REFERENCIAS_MEDICAS = 17,
    BUSCADOR = 18,
    ABSTRACTS = 269,
    CALCULADORAS = 19,
    PROGRAMAS = 20,
    CONFIGURACION = 21,
    EVENTOS = 22,
    BUSCADOR_REGIONAL = 23,
    GUIAS_CLINICAS = 24,
    DIETAS = 25,
    DISTRIBUIDORES = 26,
    PRODUCTOS_PATROCINADORES = 27,
    MANUALES = 28,
    REVISTAS = 29,
    INFORMACION_PACIENTES = 30,
    GUIAS = 31,
    FAVORITOS = 32,
    SABIAS_QUE = 33,
    HERRAMIENTAS = 34,
    MEDICOS = 35,
    CUESTIONARIOS = 36,
    MONOGRAFIAS = 37,
    INTERACCIONES = 38,
    HOSPITALES = 39,
    ESTUDIOS_CLINICOS = 40,
    CONTENIDO_EDITORIAL = 41,
    VIDEOS = 42,
    PLANES_ALIMENTACION = 43,
    RUTINAS_EJERCICIOS = 44,
    INSTRUCTIVOS_PRODUCTOS = 45,
    PRODUCTOS = 130,
    PODCAST = 258,
}

export enum ResolutionKey {
    iOS_iPad = 160,
    Android = 240,
    iOS_iPhone = 320,
    WEB = 480
}

export enum Country {
    CAD = 3,
    COL = 4,
    ECU = 6,
    MEX = 11,
    PER = 14,
    WTI = 36,
    CHI = 38,
}

export enum PushStatus {
    Recibido = 1,
    Leido = 2,
    Eliminado = 3,
    Clic = 4
}


export interface Calculator {
    CompanyClientId: string;
    ElectronicTitle: string;
    ElectronicDescription: string;
    ElectronicId: string;
    FileName: string;
    HTMLFileName: string;
    InfoTypeId: string;
}

export interface SpecialtyCalculator {
    SpecialtyTitle: string;
    Value: number;
    Calculators: Array<Calculator>;
}

export interface IaboutCalculatorInfo {
    Title: string;
    ContentHtmlString: string;
    ConstentSafeHtml?: any;
}

export interface  Content {
    CompanyClientId: string;
    ElectronicId: string;
    ElectronicTitle: string;
    ElectronicDescription: string;
    FileName: string;
    HTMLFileName: string;
    InfoTypeId: string;
    BaseUrl: string;
}

export interface SpecialtyAlgorithm {
    Description: string;
    TherapeuticLineId: number;
    Contents: Array<Algorithm>;
}

export interface AboutDataInfo {
    Title: string;
    ContentHtmlString: string;
    ConstentSafeHtml?: any;
}

