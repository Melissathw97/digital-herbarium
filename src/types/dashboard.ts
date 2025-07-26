export interface Summary {
    total: number;
    totalOcr: number;
    totalAi: number;
    averageConfidence: number;
}

export interface FamilyApi {
    family_id: string;
    family_name: string;
    total_collections: number;
}

export interface Family {
    name: string;
    total: number;
}

export interface StateApi {
    state_name: string;
    total_collections: number;
}

export interface State {
    name: string;
    total: number;
}

export interface Month {
    month: number;
    "OCR": number;
    "AI Detection": number;
}