import { getListingCountGroupedByDistrict } from '@/actions/dashboard';
import { DistrictDistributionChart } from './DistrictDistributionChart';
import { MapPinOff } from 'lucide-react';
import { type DistrictDistributionChartData } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function DashboardChartContainer() {
  const response = await getListingCountGroupedByDistrict();
  let chartData: DistrictDistributionChartData = [];

  if (response.success && response.data!.length > 0) {
    chartData = response.data!.map((item, i) => ({
      district: item.district,
      count: item.count,
      fill: `var(--chart-${(i % 5) + 1})`,
    }));
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>İlçe Yoğunluğu</CardTitle>
        <CardDescription>İlçelere göre ilan sayısı</CardDescription>
      </CardHeader>
      <CardContent>
        {response.success ? (
          <DistrictDistributionChart chartData={chartData} />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 opacity-50 py-10">
            <div className="p-4 rounded-full bg-muted">
              <MapPinOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {response.error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
