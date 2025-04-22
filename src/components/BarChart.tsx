
import { FC } from 'react';
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
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

const BarChart: FC<BarChartProps> = ({ 
  data, 
  categoryKey, 
  title,
  frequency,
  series
}) => {
  // Prevent re-rendering by safely ensuring the data is valid
  const safeData = Array.isArray(data) ? data : [];
  
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {frequency && <div className="text-sm text-gray-500">Showing {frequency} data</div>}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <RechartBarChart
          data={safeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={categoryKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map((s, index) => (
            <Bar key={index} dataKey={s.valueKey} name={s.label} fill={s.color} />
          ))}
        </RechartBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
