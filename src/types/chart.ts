export interface ChartDataItem {
  type: string;
  number: number;
}

export interface ChartDataWithColor extends ChartDataItem {
  fill: string;
}