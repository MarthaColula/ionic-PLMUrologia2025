export interface INavigation {
    destination: number[];
    start: number[];
}

export interface IGoogleMaps {
    map: {
        lat: number;
        lng: number;
    };
    directionsService: {
        origin?: {
            lat: number;
            lng: number;
        },
        destination?: {
            lat: number;
            lng: number;
        }
    };
}

export interface ILocalMenuJsonInfo {
    countryKey: string;
    distributionList: any[];
}
