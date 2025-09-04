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
    //path: 'plmservices',
    path: 'devplmservices',
    endPointName: 'RestPharmaUtilitiesEngine'
  },
  restPLMClients: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    //path: 'plmservices',
    path: 'devplmservices',
    endPointName: 'RestPLMClientsEngine'
  },
  restMetadata: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    //path: 'plmservices',
    path: 'devplmservices',
    endPointName: 'RestMetadataEngine'
  },
  restPLMTracking: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    //path: 'plmservices',
    path: 'devplmservices',
    endPointName: 'RestPLMTrackingEngine'
  },
  RestPLMInteractions: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    //path: 'plmservices',
    path: 'devplmservices',
    endPointName: 'RestPLMInteractions'
  },
  restPLMPharmaSearch: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    //port: '',
    //path: 'plmservices',
    path: 'devplmservices',
    endPointName: 'RestPLMPharmaSearchEngine'
  },
  restRestPLMAssetsEngine: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    port: '',
    //path: 'plmservices',
    path: 'devplmservices',
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
    server: 's3.amazonaws.com/plmconnection.tools',
    pathName: 'plmservices/Tools/Mexico/urologia/products',
    json: 'sponsorProducts_2025.json'
    //https://s3.us-east-1.amazonaws.com/plmconnection.tools/plmservices/Tools/Mexico/urologia/products/sponsorProducts_2025.json
  },
  atlas: {
    protocol: 'https',
    server: 's3.amazonaws.com/plmconnection.tools',
    pathName: 'plmservices/Tools/Colombia/saluddelamujer/atlas',
    json: 'atlasListprod.json'
  },
  applicationInfo: {
    name: 'PLM Urología',
    version: '1.0.0',
    /*prefix: 'MMEXASPENURO25',
    prefixId: 1120,
    countryId: 1,
    countryKey: 'MEX', */
    prefix: 'MCOLADIUSALMUJ1',
    prefixId: 1046,
    countryId: 4,
    countryKey: 'COL',

    editionId: 402,
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

  appTools: {
    protocol: 'https',
    server: 'www.plmconnection.com',
    pathName: 'plmservices/Tools',
    folderName: 'saluddelamujer'
  },

  staticBannerURL: 'https://www.plmconnection.com/plmservices/Tools/Mexico/saluddelamujer/staticBanner/',
  clinicalCase: 'https://www.plmconnection.com/plmservices/Tools/Mexico/saluddelamujer/clinicalcases/images/',
  authorsPhotos: 'https://www.plmconnection.com/plmservices/Tools/Colombia/saluddelamujer/clinicalcases/photos/',
  pushNotificationSponsorIcons: 'https://www.plmconnection.com/plmservices/Tools/pushNotifications/icons/',
};
