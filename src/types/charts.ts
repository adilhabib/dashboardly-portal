
// Interfaces for chart components

export interface DateFilterProps {
  from: Date;
  to: Date;
  onChange: (dates: { from: Date; to: Date }) => void;
}

export interface StatsCardProps {
  title: string;
  value: string;
  trend: number;
  trendText: string;
  subtitle?: string; // Using subtitle instead of description for compatibility
}

export interface DonutChartProps {
  chartData: Array<{ name: string; value: number }>;
  colors: string[];
  title?: string;
}

export interface BarChartProps {
  chartData: Array<{ name: string; value: number }>;
  dataKey: string;
  nameKey: string;
  color: string;
  title?: string;
}
