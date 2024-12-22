import { useEffect, useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Table, MenuItem, OrderItem } from "@/types/index";
import OrderSummary from "@/components/tables/OrderSummary";

interface TableManagerProps {
  table: Table;
  tables: Table[];
  setTables: (tables: Table[]) => void;
}

const TableManager: React.FC<TableManagerProps> = ({
  table,
  tables,
  setTables,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function fetchMenuItems() {
      const menuItems = await window.restaurant.menu.getItems();
      if (menuItems.length === 0) {
        console.error("No menu items found");
        return;
      }
      setMenuItems(menuItems);
    }
    fetchMenuItems();
  }, []);
  const handleOrderSubmit = () => {
    const updatedTables = tables.map((t) =>
      t.name === table.name
        ? { ...t, order: [], status: "available" as Table["status"] }
        : t
    );
    
    setTables(updatedTables);
  };
  const handleAddItem = (item: MenuItem) => {
    const updatedTables = tables.map((t) => {
      if (t.name === table.name) {
        const existingOrderItem = t.order.find(
          (orderItem) => orderItem.menuItem.id === item.id
        );
        let newOrder;
        if (existingOrderItem) {
          newOrder = t.order.map((orderItem) =>
            orderItem.menuItem.id === item.id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          );
        } else {
          newOrder = [...t.order, { menuItem: item, quantity: 1 }];
        }
        return { ...t, order: newOrder };
      }
      return t;
    });
    setTables(updatedTables);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedTables = tables.map((t) => {
      if (t.name === table.name) {
        const newOrder = t.order
          .map((orderItem) =>
            orderItem.menuItem.id === itemId
              ? { ...orderItem, quantity: orderItem.quantity - 1 }
              : orderItem
          )
          .filter((orderItem) => orderItem.quantity > 0);
        return { ...t, order: newOrder };
      }
      return t;
    });
    setTables(updatedTables);
  };
  const handleStatusChange = (value: Table["status"]) => {
    const updatedTables = tables.map((t) =>
      t.name === table.name ? { ...t, status: value } : t
    );
    setTables(updatedTables);
  };
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrderPrice = table.order.reduce(
    (total, orderItem) => total + orderItem.menuItem.price * orderItem.quantity,
    0
  );

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <SheetTitle>
          Manage Table{" "}
          <span className="text-red-600 shadow-sm text-xl ml-3 bg-green-300 p-2 rounded-lg">
            {table.name}
          </span>
        </SheetTitle>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select
            defaultValue={table.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="seats" className="text-right">
            4 Seats
          </Label>
          <Input id="seats" defaultValue={4} className="col-span-3" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-[200px] overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2"
            >
              <span>
                {item.name} - ${item.price.toFixed(2)}
              </span>
              <Button size="sm" onClick={() => handleAddItem(item)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {table.order.length > 0 && (
        <OrderSummary
          order={table.order}
          tableName={table.name}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          totalOrderPrice={totalOrderPrice}
          handleOrderSubmit={handleOrderSubmit}
        />
      )}
    </SheetContent>
  );
};

export default TableManager;
