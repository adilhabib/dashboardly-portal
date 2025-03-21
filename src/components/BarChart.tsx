
import { FC } from 'react';
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChartProps } from '@/types/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BarChart: FC<BarChartProps> = ({ 
  data, 
  valueKey, 
  categoryKey, 
  color,
  title
}) => {
  return (
    <div className="h-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={categoryKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={valueKey} fill={color} />
        </RechartBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
