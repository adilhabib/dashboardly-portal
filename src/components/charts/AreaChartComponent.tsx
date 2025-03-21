
import { FC } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AreaChartComponentProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  color?: string;
}

const AreaChartComponent: FC<AreaChartComponentProps> = ({ 
  data, 
  title,
  color = "#3b82f6"
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
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
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fill={color}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaChartComponent;
