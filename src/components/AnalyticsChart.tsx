
import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsChartProps } from '@/types/charts';
import { 
  AnalyticsChart as BaseAnalyticsChart,
  LineChartComponent,
  AreaChartComponent,
  DoubleLineChart 
} from './charts';

// Re-export for backward compatibility
export { LineChartComponent, AreaChartComponent, DoubleLineChart };

const AnalyticsChart: FC<AnalyticsChartProps> = (props) => {
  return <BaseAnalyticsChart {...props} />;
};

export default AnalyticsChart;
