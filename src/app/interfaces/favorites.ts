export interface ProductInfo {
    brand: string;
    categoryId: number;
    categoryName: string;
    divisionId: number;
    divisionName: string;
    pharmaFormId: number;
    pharmaFormName: string;
    productId: number;
    sponsorName?: string;
    countryCode?: any;
}

export interface KeyObject {
    countryKey: string;
    products?: Array<ProductInfo>;
}

