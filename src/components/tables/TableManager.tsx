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
import { Table, MenuItem } from "@/types/index";
import OrderSummary from "@/components/tables/OrderSummary";

interface TableManagerProps {
  table: Table;
}

const TableManager: React.FC<TableManagerProps> = ({ table }) => {
  const [order, setOrder] = useState<{ [key: string]: number }>({});
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
  });
  const handleAddItem = (item: MenuItem) => {
    setOrder((prev) => ({ ...prev, [item.name]: (prev[item.name] || 0) + 1 }));
  };

  const handleRemoveItem = (itemName: string) => {
    setOrder((prev) => {
      const newOrder = { ...prev };
      if (newOrder[itemName] > 1) {
        newOrder[itemName]--;
      } else {
        delete newOrder[itemName];
      }
      return newOrder;
    });
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrderPrice = Object.entries(order).reduce(
    (total, [itemName, quantity]) => {
      const item = menuItems.find((i) => i.name === itemName);
      return total + (item ? item.price * quantity : 0);
    },
    0
  );

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <SheetTitle>Manage Table {table.name}</SheetTitle>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select defaultValue={table.status}>
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
              key={item.name}
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
      {Object.keys(order).length > 0 && (
        <OrderSummary
          order={order}
          menuItems={menuItems}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          totalOrderPrice={totalOrderPrice}
        />
      )}
    </SheetContent>
  );
};

export default TableManager;
