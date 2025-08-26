export interface  IChildNodesInput {
    message: string;
    index: number;
    step: number;
    background?: string;
    textColor?: string;
    comment: any;
    decision: boolean;
}

export interface  IChildNodesOptsInput {
    data: IChildNodesInput;
    flgOpt: boolean;
}

export interface  IChildNodesOptsOutput {
    next: number;
    message: string
}
