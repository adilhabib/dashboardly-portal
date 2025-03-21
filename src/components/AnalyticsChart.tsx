
import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalyticsChartProps } from '@/types/charts';

const AnalyticsChart: FC<AnalyticsChartProps> = ({ 
  data, 
  xKey, 
  yKey, 
  color = "#3b82f6", 
  yFormatter 
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={xKey} 
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tickFormatter={yFormatter}
        />
        <Tooltip 
          formatter={yFormatter ? yFormatter : undefined}
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }} 
        />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const { LineChartComponent, AreaChartComponent, DoubleLineChart } = require('./AnalyticsChart');
export default AnalyticsChart;
