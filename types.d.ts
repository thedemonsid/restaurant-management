import type { MenuItem } from "./src/electron/database/types.ts";

declare global {
  interface Window {
    electron: any;
    restaurant: {
      menu: {
        getItems: () => Promise<MenuItem[]>;
        addItem: (
          item: Omit<MenuItem, "id" | "created_at" | "is_available">
        ) => Promise<void>;
        getCategories: () => Promise<{ id: number; name: string }[]>;
      };
    };
  }
}
export {};
