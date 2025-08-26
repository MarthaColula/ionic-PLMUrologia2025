export interface IInfoAtlasInput {
    Title: string;
    Description: string;
    LandImg: string;
    PortImg: string;
    Thumbnail: string;
    Link: string;
}

export interface IInfoDataInput {
    Order?: number;
    CompanyClientId?: number;
    ElectronicId?: number;
    ElectronicTitle: string;
    ElectronicDescription: string;
    EnfoTypeId?: number;
    InfoTypeId?: number;
    InfDescription: string;
    FileName: string;
    Link: string;
}

export interface ElectronicInfo {
    BaseUrl: string;
    CompanyClientId: number;
    ElectronicDescription: string;
    ElectronicId: number;
    ElectronicTitle: string;
    FileName: string;
    HTMLFileName: string;
    InfDescription: string;
    InfoTypeId: number;
    Link: string;
    Order: number;
    PublishedDate: string;
    ResolutionBaseUrl: string;
}

export interface IJsonCriteriaInfografiasInfo {
    listInfografias: Array<IInfoDataInput>;
}

export interface IJsonCriteriaAbstractsInfo {
    listAbstracts: Array<IInfoDataInput>;
}

export interface IJsonCriteriaProgramasInfo {
    listProgramas: Array<IInfoDataInput>;
}

export interface IJsonCriteriaInfoPacientes {
    listInfoPacientes: Array<IInfoDataInput>;
}
