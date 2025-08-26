export interface ISProduct {
    CategoryId: number;
    DivisionId: number;
    ProductId: number;
    PharmaFormId: number;
    PharmaForm: string;
    Brand: string;
    productShot?: any;
}

export interface ISponsorProducts {
    products: Array<ISProduct>;
}
