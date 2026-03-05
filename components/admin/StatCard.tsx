import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  Icon,
  statistic,
  additionalInfo,
}: {
  title: string;
  Icon: LucideIcon;
  statistic: number;
  additionalInfo?: string;
}) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-semibold">{title}</CardTitle>
          <Icon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-2">{statistic}</p>
          {additionalInfo && (
            <p className="text-muted-foreground">{additionalInfo}</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
