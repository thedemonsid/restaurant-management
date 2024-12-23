import { useEffect, useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import { Parcel, MenuItem } from "@/types/index";
import OrderSummary from "@/components/parcels/OrderSummary";

interface ParcelManagerProps {
  parcel: Parcel;
  parcels: Parcel[];
  setParcels: (parcels: Parcel[]) => void;
}

const ParcelManager: React.FC<ParcelManagerProps> = ({
  parcel,
  parcels,
  setParcels,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState(parcel.order);

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
  const handleOrderSubmit = async ({
    amountPaid,
    paymentMethod,
  }: {
    amountPaid: number;
    paymentMethod: string;
  }) => {
    const createdOrder = await window.restaurant.order.addOrder(
      {
        tableName:"",
        isParcel: 1,
        amountPaid: amountPaid,
        paymentMethod: paymentMethod,
      },
      parcel.order.map((orderItem) => ({
        menu_item_id: orderItem.menuItem.id,
        quantity: orderItem.quantity,
      }))
    );
    alert(`Order submitted successfully! ${createdOrder}`);
    const updatedParcels = parcels.map((t) =>
      t.recipient === parcel.recipient ? { ...t, order: [] } : t
    );

    setParcels(updatedParcels);
  };
  const handleAddItem = (item: MenuItem) => {
    const updatedOrder = [...orderItems, { menuItem: item, quantity: 1 }];
    setOrderItems(updatedOrder);
    const updatedParcels = parcels.map((p) =>
      p.id === parcel.id ? { ...p, order: updatedOrder } : p
    );
    setParcels(updatedParcels);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedOrder = orderItems.filter(
      (item) => item.menuItem.id !== itemId
    );
    setOrderItems(updatedOrder);
    const updatedParcels = parcels.map((p) =>
      p.id === parcel.id ? { ...p, order: updatedOrder } : p
    );
    setParcels(updatedParcels);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrderPrice = orderItems.reduce(
    (total, orderItem) => total + orderItem.menuItem.price * orderItem.quantity,
    0
  );

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px]">
      <SheetHeader>
        <SheetTitle>Manage Parcel {parcel.recipient}</SheetTitle>
      </SheetHeader>
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
        {orderItems.length > 0 && (
          <OrderSummary
            order={orderItems}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            totalOrderPrice={totalOrderPrice}
            receipent={parcel.recipient}
            handleOrderSubmit={handleOrderSubmit}
          />
        )}
      </div>
    </SheetContent>
  );
};

export default ParcelManager;
