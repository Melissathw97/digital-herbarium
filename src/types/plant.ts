export interface Plant {
  id: string;
  family: string;
  species: string;
  barcode: string;
  prefix: string;
  number: string;
  collector: string;
  date: string;
  state: string;
  district: string;
  location: string;
  fileName?: string;
  imagePath: string;
  imgExists?: boolean;
  flippedImgExists?: boolean;
  vernacularName: string;
  actionType: ActionType;
  confidenceLevel: number;
  creatorFirstName?: string;
  creatorLastName?: string;
}

export interface PlantApi {
  id: string;
  action_type: string;
  vernacular?: string;
  prefix: string;
  barcode: string;
  number: number;
  collector: string;
  state: string;
  district: string;
  location: string;
  confidence_level: number;
  image_path: string;
  collected_at: string;
  created_at: string;
  species_name: string;
  family_name: string;
  creator_first_name: string;
  creator_last_name: string;
  creator_email: string;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export enum ActionType {
  OCR = "OCR",
  AI_DETECTION = "AI Detection",
}

export interface PlantPayload {
  family: string;
  species: string;
  barcode: string;
  prefix: string;
  number: string;
  collector: string;
  date: Date;
  state: string;
  district: string;
  location: string;
  vernacularName: string;
}

export interface PlantOCRPayload extends PlantPayload {
  image: File;
}

export interface PlantAiDetectionPayload {
  image?: File;
  family: string;
  species: string;
  confidenceLevel: number;
}

export interface PlantImageToBase64Api {
  base64: string;
  filename: string;
  size: number;
  type: string;
}

export interface PlantUpdatePayload extends PlantPayload {
  id: string;
  actionType: ActionType;
  confidenceLevel?: number;
}
