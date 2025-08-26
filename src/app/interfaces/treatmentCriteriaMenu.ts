
export interface IMenuData {
    displayName: string;
    url: string;
    visible: boolean;
}

export interface IJsonCriteriaMenu {
    sectionName?: string,
    treatmentCriteria: Array<IMenuData>;
}

export interface IAbstractInput {
    title: string;
    content: string;
    algorithms?: [];
}

export interface IJsonCriteriaAbstractInfo {
    Abstract: Array<IAbstractInput>;
    Name: string;
    Resources: Array<string>;
}

export interface IAlgorithmData {
    Instructions?: any;
    Node?: any;
    Title?: string;
    Subtitle?: string;
}
