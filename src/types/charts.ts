
// Interfaces for chart components

export interface DateFilterProps {
  dateRange: { from: Date; to: Date };
  onChange: (dates: { from: Date; to: Date }) => void;
}

export interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  subtitle?: string;
  trend: number;
  trendText: string;
}

export interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  title?: string;
}

export interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  valueKey: string;
  categoryKey: string;
  color: string;
  title?: string;
}

export interface ReviewCardProps {
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
  foodName: string;
  replied: boolean;
}

export interface AnalyticsChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  yFormatter?: (value: number) => string;
}
