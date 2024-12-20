import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Table, MenuItem } from "@/types/index";
import { Minus, Percent, Plus, Search } from "lucide-react";

// Mock data
const tables: Table[] = [
  { id: 1, seats: 4, status: "occupied" },
  { id: 2, seats: 2, status: "available" },
  { id: 3, seats: 6, status: "reserved" },
  { id: 4, seats: 4, status: "occupied" },
  { id: 5, seats: 2, status: "occupied" },
  { id: 6, seats: 8, status: "available" },
];

const menuItems: MenuItem[] = [
  { name: "Margherita Pizza", price: 12.99 },
  { name: "Pepperoni Pizza", price: 14.99 },
  { name: "Caesar Salad", price: 8.99 },
  { name: "Spaghetti Carbonara", price: 13.99 },
  { name: "Grilled Salmon", price: 18.99 },
  { name: "Chicken Alfredo", price: 15.99 },
  { name: "Vegetable Stir Fry", price: 11.99 },
  { name: "Cheeseburger", price: 10.99 },
  { name: "Fish and Chips", price: 14.99 },
  { name: "Mushroom Risotto", price: 16.99 },
];

export default function Tables() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [order, setOrder] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(0);

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

  const discountedTotal = totalOrderPrice * (1 - discount / 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tables</h1>
        <p className="text-muted-foreground">
          Manage your restaurant tables and orders
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Table {table.id}
              </CardTitle>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  table.status === "occupied"
                    ? "bg-green-100 text-green-800"
                    : table.status === "reserved"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {table.status}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{table.seats} seats</div>
              <p className="text-xs text-muted-foreground">
                {table.status === "occupied"
                  ? "Currently in use"
                  : table.status === "reserved"
                  ? "Reserved"
                  : "Available for seating"}
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setSelectedTable(table)}
                  >
                    Manage Table
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Manage Table {selectedTable?.id}</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select defaultValue={selectedTable?.status}>
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
                        Seats
                      </Label>
                      <Input
                        id="seats"
                        defaultValue={selectedTable?.seats}
                        className="col-span-3"
                      />
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
                    <div className="mt-4">
                      <h4 className="font-medium">Current Order</h4>
                      {Object.entries(order).map(([itemName, quantity]) => (
                        <div
                          key={itemName}
                          className="flex justify-between items-center py-1"
                        >
                          <span>
                            {itemName} (x{quantity})
                          </span>
                          <div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveItem(itemName)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="ml-2"
                              onClick={() =>
                                handleAddItem(
                                  menuItems.find(
                                    (item) => item.name === itemName
                                  )!
                                )
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 mt-4">
                        <Percent className="w-4 h-4 text-gray-500" />
                        <Input
                          type="number"
                          placeholder="Discount %"
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                      <div className="font-bold mt-2">
                        Subtotal: ${totalOrderPrice.toFixed(2)}
                      </div>
                      {discount > 0 && (
                        <div className="font-bold text-green-600">
                          Discount: -$
                          {(totalOrderPrice - discountedTotal).toFixed(2)}
                        </div>
                      )}
                      <div className="font-bold text-xl mt-2">
                        Total: ${discountedTotal.toFixed(2)}
                      </div>
                      <Button className="w-full mt-4">Submit Order</Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
