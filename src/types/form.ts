export interface Option {
  label: string;
  value: string;
}

export interface PlantAiData {
  image?: File;
  family: Option;
  species: string;
  confidenceLevel: number;
}

export interface FormValues {
  family: Option;
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
  vernacularName: string;
  additionalNotes: string;
}

export interface AiFormValues {
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
  vernacularName: string;
  additionalNotes: string;
}
