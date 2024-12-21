export interface MenuItem {
  id: number;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  tableName?: string;
  isParcel: boolean;
  amountPaid: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
export interface DatabaseError extends Error {
  code?: string;
}
