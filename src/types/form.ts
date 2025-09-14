export interface Option {
  label: string;
  value: string;
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
  elevation?: number;
  latitude?: number;
  longitude?: number;
  vernacularName: string;
  additionalNotes: string;
}
