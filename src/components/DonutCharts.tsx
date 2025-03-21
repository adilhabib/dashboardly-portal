
import { FC } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DonutChartProps } from '@/types/charts';

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

export default DonutCharts;
