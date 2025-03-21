
import { FC } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DonutChartProps } from '@/types/charts';
import { Card, CardContent } from '@/components/ui/card';

const DonutCharts: FC<DonutChartProps> = ({ data, colors, title }) => {
  return (
    <div className="h-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Create the DonutChartsCollection component for use in Dashboard
export const DonutChartsCollection: FC<{ data: Array<{ title: string; percentage: number; color: string }> }> = ({ data }) => {
  // Transform data for the DonutCharts component
  const transformedData = data.map(item => ({ name: item.title, value: item.percentage }));
  const colors = data.map(item => item.color);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="h-64">
            <DonutCharts data={transformedData} colors={colors} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xl font-bold">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutCharts;
