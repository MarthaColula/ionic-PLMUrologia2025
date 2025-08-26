import { SearchType, TrackingSource, Source, InfoEntities } from './catalogs';

export interface IInfoTracking {
    BranchId?: number | null;
    CodeString: string;
    Date?: Date | string;
    ElectronicId?: number | null;
    EntityId: InfoEntities | number;
    EventId?: number | null;
    Label: string;
    LabelValue: string;
    SearchAddressIP: string | null;
    SearchLatitude: string;
    SearchLongitude: string;
    SearchText: string | null;
    SearchTypeId: SearchType | number;
    SourceId: Source | number;
}

export interface ITrackingInfo {
    ActiveSubstanceId?: number;
    AgrochemicalUseId?: number;
    AttributeGroupId?: number;
    BrandId?: number;
    CategoryId?: number;
    ClientId?: number;
    CodeString: string;
    CropId?: number;
    Date?: Date | string;
    DivisionId?: number;
    EditionId: number;
    EntityId: number;
    ICDId?: number;
    PharmaFormId?: number;
    PillBookId?: number;
    PresentationId?: number;
    ProductId?: number;
    SearchAddressIP: string;
    SearchLatitude: string;
    SearchLongitude: string;
    SearchText: string;
    SearchTypeId: SearchType;
    SeedId?: number;
    SicknessId?: number;
    SourceId: TrackingSource | number ;
    SymtomId?: number;
    TherapeuticId?: number;
}

export interface IPushTrackingInfo {
    CodeString: string;
    PushDate?: Date | string;
    PushNotificationId: number;
    PushStatusId: number;
    PushTrackId?: number;
    UserPushId?: number;
}
