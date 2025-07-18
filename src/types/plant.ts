export interface Plant {
  id: string;
  family: string;
  genus: string;
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
}

export enum ActionType {
  OCR = "OCR",
  AI_DETECTION = "Ai Detection",
}
