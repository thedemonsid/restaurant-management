export type TableStatus = "occupied" | "available" | "reserved";

export interface Table {
  name: String;
  status: TableStatus;
  order: OrderItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

// export interface Order {
//   items: OrderItem[];
// }
export interface DashboardStats {
  totalRevenue: number;
  activeTables: number;
  totalTables: number;
  pendingOrders: number;
  totalCustomers: number;
}
