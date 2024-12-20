export type TableStatus = "occupied" | "available" | "reserved";

export interface Table {
  id: number;
  seats: number;
  status: TableStatus;
}

export interface MenuItem {
  name: string;
  price: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  tableId: number;
  items: OrderItem[];
  status: "new" | "in-progress" | "ready";
  time: string;
  discount: number;
}

export interface DashboardStats {
  totalRevenue: number;
  activeTables: number;
  totalTables: number;
  pendingOrders: number;
  totalCustomers: number;
}
