export interface ISCJsonMenu {
    menu: Array<ISCMenuData>;
}

export interface ISCMenuData {
    displayName: string;
    url: string;
    visible: boolean;
}

export interface ISCJsonAlgorithmInfo {
    Algorithms: Array<ISCAlgorithmData>;
}

export interface ISCAlgorithmData {
    DisplayName?: string;
    AlgorithmSteps: any[];
    ExpertComments?: string[];
    Abbreviations?: string[];
    Resources?: string[];
}
