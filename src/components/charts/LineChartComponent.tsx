
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsChart from './AnalyticsChart';
import { AnalyticsChartProps } from '@/types/charts';

interface LineChartComponentProps extends Omit<AnalyticsChartProps, 'xKey' | 'yKey'> {
  title: string;
  xKey?: string;
  yKey?: string;
}

const LineChartComponent: FC<LineChartComponentProps> = ({ 
  data, 
  title,
  color,
  yFormatter,
  xKey = 'name',
  yKey = 'value'
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <AnalyticsChart
            data={data}
            xKey={xKey}
            yKey={yKey}
            color={color}
            yFormatter={yFormatter}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;
