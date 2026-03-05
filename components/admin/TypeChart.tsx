"use client";

import { Label, Pie, PieChart } from "recharts";
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

const chartConfig = {
  value: { label: "İlan Sayısı" },
  sale: {
    label: "Satılık",
    color: "hsl(var(--chart-1))",
  },
  rent: {
    label: "Kiralık",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface TypeChartProps {
  data: { type: string; label: string; value: number; fill: string }[];
}

export function TypeChart({ data }: TypeChartProps) {
  const totalListings = data[0].value + data[1].value;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portföy Dağılımı</CardTitle>
        <CardDescription>Aktif Satılık ve Kiralık Oranı</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          {totalListings > 0 ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="type"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalListings.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Toplam Aktif
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
              <div className="h-32 w-32 rounded-full border-8 border-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs font-medium">
                  Veri Yok
                </span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Henüz aktif ilan eklenmemiş.
              </p>
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
