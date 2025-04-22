
// Interfaces for chart components

export interface DateFilterProps {
  startDate: string;
  endDate: string;
}

export interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  iconBgColor: string;
  changeDirection: string;
  description?: string;
  subtitle?: string;
  trend?: number;
  trendText?: string;
}

export interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  title?: string;
}

export interface BarChartProps {
  data: any[];
  categoryKey: string;
  title?: string;
  frequency?: string;
  series: Array<{
    valueKey: string;
    label: string;
    color: string;
  }>;
}

export interface ReviewCardProps {
  id?: number;
  customerName: string;
  name?: string;
  rating: number;
  comment: string;
  date: Date;
  daysSince?: number;
  foodName: string;
  replied: boolean;
  image?: string;
  foodImage?: string;
}

export interface AnalyticsChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  yFormatter?: (value: number) => string;
  title?: string;
}
