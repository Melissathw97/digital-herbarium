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
  latitude?: number;
  longitude?: number;
  elevation?: number;
  fileName?: string;
  imagePath: string;
  imageUrl?: string;
  imgExists?: boolean;
  flippedImgExists?: boolean;
  vernacularName: string;
  actionType: ActionType;
  status: Status;
  confidenceLevel: number;
  creatorFirstName?: string;
  creatorLastName?: string;
  isPublished: boolean;
  organization?: PlantOrganization;
  remarks: string;
  additionalNotes: string;
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
  latitude?: number;
  longitude?: number;
  elevation?: number;
  confidence_level: number;
  image_path: string;
  image_url: string;
  collected_at: string;
  created_at: string;
  species_name: string;
  status: string;
  family_name: string;
  creator_first_name: string;
  creator_last_name: string;
  creator_email: string;
  is_published: boolean;
  organizations?: PlantOrganization;
  remarks: string;
  additional_notes: string;
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
  HERBARIUM = "Herbarium",
}

export enum Status {
  APPROVED = "Approved",
  REJECTED = "Rejected",
  PENDING_APPROVAL = "Pending Approval",
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
  elevation?: string;
  latitude?: string;
  longitude?: string;
  additionalNotes: string;
  vernacularName: string;
}

export interface PlantOCRPayload extends PlantPayload {
  image: File;
}

export interface PlantAiDetectionPayload extends PlantPayload {
  image?: File;
  confidenceLevel: number;
}

export interface PlantImageToBase64Api {
  base64: string;
  filename: string;
  size: number;
  type: string;
}

export interface PlantAiDetectionResult {
  final_result: {
    family: string;
    species: string;
    confidence: number;
  }[];
}

export interface PlantUpdatePayload extends PlantPayload {
  id: string;
  actionType: ActionType;
  confidenceLevel?: number;
  status?: string;
  remarks?: string;
}

export interface PlantOrganization {
  id: string;
  name: string;
}

export interface FileResponse {
  inserted_ids: string[];
  message: string;
  success: boolean;
  successful_inserts: number;
  total_processed: number;
}

export interface AiResult {
  family: string;
  species: string;
  confidenceLevel: number;
}
