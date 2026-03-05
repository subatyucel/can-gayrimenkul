"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MapPinOff } from "lucide-react"; // Boş durum için ikon

interface DistrictChartData {
  district: string;
  count: number;
  fill: string;
}

interface DistrictChartProps {
  data: DistrictChartData[];
}

const chartConfig = {
  count: { label: "İlan Sayısı", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

export function DistrictChart({ data }: DistrictChartProps) {
  const hasData = data && data.length > 0;

  return (
    <Card className="h-full flex flex-col">
      {" "}
      {/* h-full ve flex-col ile yüksekliği zorluyoruz */}
      <CardHeader>
        <CardTitle>İlçe Yoğunluğu</CardTitle>
        <CardDescription>En çok ilan bulunan ilk 5 bölge</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center min-h-62.5">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="w-full aspect-auto h-62.5"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 30, right: 30 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <YAxis
                dataKey="district"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                className="text-xs font-medium"
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" layout="vertical" radius={4} barSize={24}>
                <LabelList
                  dataKey="count"
                  position="right"
                  className="fill-foreground font-bold"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          /* BOŞ VERİ GÖRÜNÜMÜ */
          <div className="flex flex-col items-center justify-center space-y-3 opacity-50 py-10">
            <div className="p-4 rounded-full bg-muted">
              <MapPinOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Henüz bölge verisi yok
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
