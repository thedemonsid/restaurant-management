export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description?: string;
  is_available: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface DatabaseError extends Error {
  code?: string;
}
