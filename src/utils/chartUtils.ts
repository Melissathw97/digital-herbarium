import { ChartConfig } from "@/components/ui/chart";
import { ChartDataItem, ChartDataWithColor } from "@/types/chart";

// Color palette
export const EXTENDED_LIME_PALETTE: string[] = [
  "#ecfccb", // lime-100
  "#d9f991", // lime-300
  "#a3e635", // lime-500
  "#65a30d", // lime-700 (your primary)
  "#3f6212", // lime-900
  "#facc15", // yellow-400 (analagous accent)
  "#a78bfa", // violet-400 (complementary accent)
  "#06b6d4", // cyan-500 (cool complementary accent)
  "#166534", // green-700 (deeper complementary tone)
  "#4d7c0f", // lime-800
  "#fcd34d", // amber-400 (a hint of warmth)
  "#7c3aed", // violet-600 (strong complementary accent)
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#4ade80", // lime-400
];

// Color generation
export const addLimeColors = (data: ChartDataItem[]): ChartDataWithColor[] => {
  return data.map((item, index) => {
    let fill: string;

    if (index < EXTENDED_LIME_PALETTE.length) {
      fill = EXTENDED_LIME_PALETTE[index];
    } else {
      // Generate amber-inspired colors (hue 35-55, warm tones)
      const baseHue = 45;
      const hue = baseHue + (index * 20) / data.length - 10;
      const saturation = 70 + (index % 3) * 10;
      const lightness = 35 + (index % 4) * 15;
      fill = `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
    }

    return { ...item, fill };
  });
};

// Chart config generation
export const generateChartConfig = (
  data: ChartDataWithColor[]
): ChartConfig => {
  const config: ChartConfig = {
    number: {
      label: "Number",
    },
  };

  // Add each data item to the config
  data.forEach((item) => {
    config[item.type] = {
      label: capitalizeFirst(item.type),
      color: item.fill,
    };
  });

  return config;
};

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLatestMonth = (data: any[]) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  // Get the latest year (first item since it's sorted)
  const latestYear = data[0];

  // Get the latest month from that year (first item since it's sorted)
  const latestMonth = latestYear.months[0];

  return {
    year: latestYear.year,
    month: latestMonth.month,
  };
};

export const formatMonthYear = (monthNum: string, year: string) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[parseInt(monthNum) - 1]} ${year}`;
};
