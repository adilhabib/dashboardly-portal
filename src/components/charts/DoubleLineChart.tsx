
import { FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DoubleLineChartProps {
  data: Array<{ name: string; value1: number; value2: number }>;
  title: string;
  color1?: string;
  color2?: string;
}

const DoubleLineChart: FC<DoubleLineChartProps> = ({ 
  data, 
  title,
  color1 = "#3b82f6",
  color2 = "#10b981"
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value1" 
                stroke={color1} 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Current Period"
              />
              <Line 
                type="monotone" 
                dataKey="value2" 
                stroke={color2} 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Previous Period"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoubleLineChart;
