import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";

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
  const [highlightedIndex, setHighlightedIndex] = useState(1);
  const highlightedItemRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);
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
  useEffect(() => {
    if (table.order.length > 0 && table.status !== "occupied") {
      handleStatusChange("occupied");
    }
    if (table.order.length === 0 && table.status === "occupied") {
      handleStatusChange("available");
    }
  }, [table.order]);
  const handleOrderSubmit = async ({
    amountPaid,
    paymentMethod,
  }: {
    amountPaid: number;
    paymentMethod: string;
  }) => {
    const createdOrder = await window.restaurant.order.addOrder(
      {
        tableName: table.name,
        isParcel: 0,
        amountPaid: amountPaid,
        paymentMethod: paymentMethod,
      },
      table.order.map((orderItem) => ({
        menu_item_id: orderItem.menuItem.id,
        quantity: orderItem.quantity,
      }))
    );
    alert(`Order submitted successfully! ${createdOrder}`);
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

  const filteredMenuById = menuItems.filter((item) => {
    // want to check if the search term is number
    // if it is number then we will search by id
    // then we will add the condition to check if the id  is in the search term

    if (!isNaN(Number(searchTerm))) {
      return item.id.toString().includes(searchTerm);
    }
  });
  const filteredMenuByName = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filterMenuItemsByPrice = menuItems.filter((item) =>
    item.price.toString().includes(searchTerm)
  );
  const filteredMenuItems = Array.from(
    new Set([
      ...filteredMenuById,
      ...filteredMenuByName,
      ...filterMenuItemsByPrice,
    ])
  ).sort((a, b) => a.id - b.id);

  const totalOrderPrice = table.order.reduce(
    (total, orderItem) => total + orderItem.menuItem.price * orderItem.quantity,
    0
  );
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredMenuItems.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(filteredMenuItems[highlightedIndex]);
    }
  };
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(0);
            }}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="h-[200px] overflow-y-auto">
          {filteredMenuItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex justify-between items-center py-2",
                // item.id can be any number so we cant gurantee it will match with highlightedIndex
                highlightedIndex === filteredMenuItems.indexOf(item)
                  ? "bg-green-100 rounded-sm px-2"
                  : ""
              )}
              ref={index === highlightedIndex ? highlightedItemRef : null}
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
      {Object.keys(table.order).length > 0 && (
        <OrderSummary
          order={table.order}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          totalOrderPrice={totalOrderPrice}
          tableName={table.name}
          handleOrderSubmit={handleOrderSubmit}
        />
      )}
    </SheetContent>
  );
};

export default TableManager;
