
export interface ResultItem {
    ItemId: number;
    Ean: string;
    Brand: string;
    BrandLevel: string | null;
    Model: string;
    Title: string;
    Size: string;
    Season: string | null;
    Category: string | null;
    SpeedIndex: string | null;
    LoadIndex: string | null;
    IsXL: boolean | null;
    IsRFT: boolean | null;
    IsIce: boolean | null;
    IsSnow: boolean | null;
    LabelFuel: string | null;
    LabelWet: string | null;
    LabelDecibels: string | null;
    LabelNoise: string | null;
    ProductImageUrl: string | null;    
    LabelImageUrl: string | null;    
    BrandImageUrl: string | null;
    BestOfferId: number;    
    BestStoreName: string;
    BestStoreOfferUrl: string;
    BestStoreLogoUrl: string | null;
    BestPrice: number;
    OffersCount: number | null;

    Offers: Array<Offer>;
}

export interface Offer {
    OfferId: number;
    StoreName: string;
    StoreOfferUrl: string;
    StoreLogoUrl: string | null;
    Price: number;
}

export interface SearchFilter {
    category: string;
    w: string;
    h: string;
    d: string;
    pageNum: number | null;
    pageSize: number | null;
}

export interface AdditionalFilter{
    season: Array<string>;
    brandLevel: Array<string>;
    isChanged: boolean;
}

export class FeedItem {
    public source = "";
    public title = "";
    public content = "";
    public snippet = "";
    public date = "";
    public link = "";
    public guid = "";
    public imageUrl = "";

    public constructor(init?: Partial<FeedItem>) {
        Object.assign(this, init);    }
}


export interface AlertSetting {
    Id: number;
    UserId: string;
    UserEmail: string;
    TyreId: number;
    ProductTitle: string;
    Created: Date;
    NotifyAllChanges: boolean;
    StartPrice: number;
    DesiredPrice: number | null;
    DisableDate: Date | null;
    Status: string;
    AutodisablingDays: number | null;
}

export interface AlertNotification {
    Id: number;
    AlertSettingId: number;
    ProductTitle: string;
    StartPrice: number;
    DesiredPrice: number | null;
    CurrentBestPrice: number;
    CurrentBestOfferDirectUrl: string;
    CurrentBestOfferStoreName: string;
    BestOfferId: number;
    Date: Date;
}

export interface Click {
    OfferId: number;
    Position: number | null;
    Source: "App";
    UserId: string;
}