// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  countriesAvailable: [
    'MEX',
    'COL',
    'PER',
    'CHI',
    'ECU',
    'CAD',
    'USA',
    'Default',
  ],
  
  restPharmaUtilities: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestPharmaUtilitiesEngine'
  },
  restPLMClients: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestPLMClientsEngine'
  },
  restMetadata: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestMetadataEngine'
  },
  restPLMTracking: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestPLMTrackingEngine'
  },
  RestPLMInteractions: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestPLMInteractions'
  },
  restPLMPharmaSearch: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestPLMPharmaSearchEngine'
  },
  restRestPLMAssetsEngine: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    port: '',
    path: 'plmservices',
    //path: 'devplmservices',
    endPointName: 'RestPLMAssetsEngine'
  },
  sharedResources: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    pathName: 'plmservices/Tools/Colombia/applications',
    otherResource: '',
    pubmed: 'pubmed/substancesList.json'
  },
  autoComplete: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    pathName: 'plmservices/Tools/Colombia/saluddelamujer/autocomplete',
    buscador: 'autocomplete.json'
  },
  sponsorProducts: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    pathName: 'plmservices/Tools/Colombia/saluddelamujer/products',
    json: 'adiumProducts.json'
  },
  /*atlas: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    pathName: 'plmservices/Tools/Colombia/saluddelamujer/atlas',
    json: 'atlasListprod.json'
     //https://www.plmconnection.com/plmservices/Tools/Colombia/saluddelamujer/atlas/atlasListprod.json
  },*/
   atlas: {
    protocol: 'https',
    server: 's3.amazonaws.com/plmconnection.tools',
    pathName: 'plmservices/Tools/Colombia/saluddelamujer/atlas',
    json: 'atlasListprod.json'
    
    //https://s3.us-east-1.amazonaws.com/plmconnection.tools/plmservices/Tools/Colombia/saluddelamujer/atlas/atlasList.json
  },
  applicationInfo: {
    name: 'PLM Salud de la mujer',
    version: '1.0.0',
    prefix: 'MCOLADIUSALMUJ1',
    prefixId: 1046,
    editionId: 402,
    countryId: 4,
    countryKey: 'COL',
    availableCountries: [],
    isbn: '',
    distribution: '',
    distributionId: 1,
    branch: '',
    branchId: 1,
    interactionsEdition: 402,
    loaderSponsor: true,
    businessUnitId: 1
  },
  commentInfo: {
    commentTypeId: 14
  },
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },
  appTools: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    pathName: 'plmservices/Tools',
    folderName: 'saluddelamujer' 
  },
 
  staticBannerURL: 'https://www.plmconnection.com/plmservices/Tools/Colombia/saluddelamujer/staticBanner/',
  clinicalCase: 'https://www.plmconnection.com/plmservices/Tools/Colombia/saluddelamujer/clinicalcases/images/',
  authorsPhotos: 'https://www.plmconnection.com/plmservices/Tools/Colombia/saluddelamujer/clinicalcases/photos/',
  pushNotificationSponsorIcons: 'https://www.plmconnection.com/plmservices/Tools/pushNotifications/icons/',
};
