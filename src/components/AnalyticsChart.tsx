
import { FC } from 'react';
import { MoreHorizontal, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AnalyticsChartProps {
  title: string;
  data: any[];
  showDownload?: boolean;
}

export const LineChartComponent: FC<AnalyticsChartProps> = ({ title, data, showDownload }) => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {showDownload && (
          <button className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700 transition-colors">
            <Download size={16} />
            <span>Save Report</span>
          </button>
        )}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }} 
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const AreaChartComponent: FC<AnalyticsChartProps> = ({ title, data }) => {
  return (
    <div className="chart-container h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipis.</p>
        </div>
        <div className="flex">
          <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
        </div>
      </div>
      
      <div className="mt-2 flex items-center">
        <div className="text-lg font-semibold">456</div>
        <div className="ml-2 text-xs text-gray-500">Order last week</div>
      </div>
      
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }} 
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#colorValue)" 
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DoubleLineChart: FC<AnalyticsChartProps> = ({ title, data }) => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-gray-600">2020</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-xs text-gray-600">2021</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }} 
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#60a5fa" 
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, stroke: '#60a5fa', strokeWidth: 2, fill: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="value2" 
              stroke="#f87171" 
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, stroke: '#f87171', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
