export interface ICurrentPosition {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | any;
    heading: number | null;
    speed: number | null;
    timestamp: number;
}
