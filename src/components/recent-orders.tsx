import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/index";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div
            key={`${order.tableId}-${order.time}`}
            className="flex items-center justify-between"
          >
            <div>
              <p className="font-medium">Table {order.tableId}</p>
              {order.items.map((item) => (
                <p key={item.name} className="text-sm text-muted-foreground">
                  {item.quantity}x {item.name}
                </p>
              ))}
            </div>
            <div className="text-right">
              <Badge
                variant={
                  order.status === "new"
                    ? "default"
                    : order.status === "in-progress"
                    ? "secondary"
                    : "outline"
                }
              >
                {order.status}
              </Badge>
              <p className="mt-1 text-sm text-muted-foreground">{order.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
