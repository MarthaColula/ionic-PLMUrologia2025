export interface ProductInfo {
    Brand: string;
    CategotyId: number;
    CategoryName: string;
    DivisionId: number;
    DivisionName: string;
    PharmaFormId: number;
    PharmaForm: string;
    ProductId: number;
    CountryCode?: any;
}

export interface KeyObject {
    countryKey: string;
    products?: Array<ProductInfo>;
}
