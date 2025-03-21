
import { FC } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  title: string;
  data: any[];
  frequency: string;
}

const BarChartComponent: FC<BarChartProps> = ({ title, data, frequency }) => {
  return (
    <div className="chart-container h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300"
              value={frequency}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button>
            <MoreHorizontal size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
            barSize={20}
          >
            <XAxis 
              dataKey="name" 
              scale="point" 
              padding={{ left: 10, right: 10 }} 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              hide={true}
            />
            <Bar 
              dataKey="value1" 
              fill="#fca5a5" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="value2" 
              fill="#fcd34d" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
