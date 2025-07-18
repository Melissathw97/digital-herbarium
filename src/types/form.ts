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
  vernacularName: string;
}
