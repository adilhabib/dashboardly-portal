
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import BarChart from '@/components/BarChart';

interface FinancialChartProps {
  chartData: Array<{
    name: string;
    income: number;
    expense: number;
  }>;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ chartData }) => {
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader>
        <CardTitle>Financial Performance</CardTitle>
        <CardDescription>Income vs Expenses Overview</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <BarChart
          data={chartData}
          categoryKey="name"
          series={[
            { valueKey: 'income', label: 'Income', color: '#4ade80' },
            { valueKey: 'expense', label: 'Expenses', color: '#f87171' }
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
