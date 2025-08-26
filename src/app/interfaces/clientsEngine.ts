import { Source, Target } from './catalogs';

export interface ISaveMobileLocationAppClient {
    codePrefix: string;
    firstName: string;
    lastName: string;
    slastName: string;
    email: string;
    profession: number | null;
    otherProfession: string | null;
    professionLicense: string;
    speciality: number | null;
    otherSpeciality: number | string;
    specialityLicense: string;
    subspeciality: string | null;
    subspecialityLicense: string;
    country: number;
    state: number;
    latitude: number | null;
    longitude: number | null;
    phone: string;
    locationId: number;
    suburbId: number;
    zipCodeId: number;
    source: Source | string;
    targetOutput: Target | string;
}

export interface IUpdateMobileLocationAppClient {
   codeString: string;
   firstName: string;
   lastName: string;
   slastName: string;
   email: string;
   profession: number | null;
   otherProfession: string | null;
   professionLicense: string | null;
   speciality: number | null;
   otherSpeciality: string;
   specialityLicense: string | null;
   subspeciality: string | null;
   subspecialityLicense: string | 12;
   country: number | string;
   state: number | string;
   latitude: number | null;
   longitude: number | null;
   phone: string;
   source: Source | string;
   locationId: number;
   suburbId: number;
   targetOutput: Target | string;
   zipCodeId: number;
}
