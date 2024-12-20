import { DollarSign, Users, Clock, UserCheck } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { RecentOrders } from "@/components/recent-orders";
import { TableOverview } from "@/components/table-overview";
import type { DashboardStats, Order, Table } from "@/types/index";

// Mock data
const stats: DashboardStats = {
  totalRevenue: 1234.56,
  activeTables: 8,
  totalTables: 12,
  pendingOrders: 6,
  totalCustomers: 42,
};

const recentOrders: Order[] = [
  {
    tableId: 4,
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Coke", quantity: 2, price: 2.99 },
    ],
    status: "in-progress",
    time: "12:30",
    discount: 0,
  },
  {
    tableId: 2,
    items: [
      { name: "Pasta Carbonara", quantity: 1, price: 14.99 },
      { name: "Wine", quantity: 1, price: 6.99 },
    ],
    status: "ready",
    time: "12:25",
    discount: 0,
  },
  {
    tableId: 7,
    items: [
      { name: "Caesar Salad", quantity: 2, price: 8.99 },
      { name: "Sprite", quantity: 1, price: 2.99 },
    ],
    status: "new",
    time: "12:20",
    discount: 0,
  },
];

const tables: Table[] = [
  { id: 1, seats: 4, status: "occupied" },
  { id: 2, seats: 2, status: "available" },
  { id: 3, seats: 6, status: "reserved" },
  { id: 4, seats: 4, status: "occupied" },
  { id: 5, seats: 2, status: "occupied" },
  { id: 6, seats: 8, status: "available" },
  { id: 7, seats: 4, status: "reserved" },
  { id: 8, seats: 4, status: "available" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your restaurant's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          subtitle="Today's earnings"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Tables"
          value={`${stats.activeTables}/${stats.totalTables}`}
          subtitle="Currently occupied"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          subtitle="Orders in progress"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="Served today"
          icon={<UserCheck className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentOrders orders={recentOrders} />
        <TableOverview tables={tables} />
      </div>
    </div>
  );
}
