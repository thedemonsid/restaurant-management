import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Table } from "@/types/index";

interface TableOverviewProps {
  tables: Table[];
}

export function TableOverview({ tables }: TableOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`rounded-lg border p-4 ${
                table.status === "occupied"
                  ? "border-green-500 bg-green-50"
                  : table.status === "reserved"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200"
              }`}
            >
              <p className="font-medium">T{table.id}</p>
              <p className="text-sm text-muted-foreground">{table.seats}p</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
