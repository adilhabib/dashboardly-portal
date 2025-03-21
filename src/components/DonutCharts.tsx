
import { FC } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  percentage: number;
  color: string;
  size?: number;
  title: string;
}

const DonutChart: FC<DonutChartProps> = ({ percentage, color, size = 160, title }) => {
  const data = [
    { name: 'Value', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];
  
  const COLORS = [color, '#f1f5f9'];
  
  return (
    <div className="text-center">
      <div className="donut-chart-container" style={{ height: size, width: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.35}
              outerRadius={size * 0.45}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-chart-percentage">{percentage}%</div>
      </div>
      <h4 className="text-sm font-medium text-gray-700 mt-2">{title}</h4>
    </div>
  );
};

interface DonutChartsCollectionProps {
  data: {
    title: string;
    percentage: number;
    color: string;
  }[];
}

export const DonutChartsCollection: FC<DonutChartsCollectionProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Pie Chart</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span>Chart</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" checked />
            <span>Show Value</span>
          </label>
          <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
        </div>
      </div>
      
      <div className="flex items-center justify-around">
        {data.map((item, index) => (
          <DonutChart
            key={index}
            percentage={item.percentage}
            color={item.color}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
