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
export interface Parcel {
  id: number;
  recipient: string;
  order: OrderItem[];
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
  totalOrders?: number;
  totalTables?: number;
  totalParcels?: number;
  monthlyRevenue: number;
  dailyRevenue: number;

}
