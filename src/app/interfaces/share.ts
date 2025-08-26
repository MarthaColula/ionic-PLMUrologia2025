export interface IShareByApp {
    message: string;
    subject?: string;
    image?: string;
    url?: string;
    file?: string;
}

export interface IShareWithOptions {
    message?: string;
    subject?: string;
    files?: string[];
    url?: string;
    chooserTitle?: string;
}

export interface IShareApplication {
    app: EnumApplication;
}

export enum EnumApplication  {
    facebook = 'facebook',
    whatsapp = 'whatsapp',
    twitter = 'twitter',
    email = 'email'
}
