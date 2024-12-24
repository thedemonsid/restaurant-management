import { useEffect, useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    console.log("Order submitted", amountPaid, paymentMethod, parcel.order);
    const createdOrder = await window.restaurant.order.addOrder(
      {
        tableName: parcel.recipient, //! This is the Customer Name
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
    const updatedParcels = parcels.filter(
      (t) => t.recipient !== parcel.recipient
    );

    setParcels(updatedParcels);
    // setSelectedParcel(null);
  };

  const handleAddItem = (item: MenuItem) => {
    const updatedParcels = parcels.map((p) => {
      if (p.id === parcel.id) {
        const existingOrderItem = p.order.find(
          (orderItem) => orderItem.menuItem.id === item.id
        );
        let newOrder;
        if (existingOrderItem) {
          newOrder = p.order.map((orderItem) =>
            orderItem.menuItem.id === item.id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          );
        } else {
          newOrder = [...p.order, { menuItem: item, quantity: 1 }];
        }
        return { ...p, order: newOrder };
      }
      return p;
    });
    setParcels(updatedParcels);
    // setSelectedParcel(updatedParcels.find((p) => p.id === parcel.id) || null);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedParcels = parcels.map((p) => {
      if (p.id === parcel.id) {
        const newOrder = p.order
          .map((orderItem) =>
            orderItem.menuItem.id === itemId
              ? { ...orderItem, quantity: orderItem.quantity - 1 }
              : orderItem
          )
          .filter((orderItem) => orderItem.quantity > 0);
        return { ...p, order: newOrder };
      }
      return p;
    });
    setParcels(updatedParcels);
    // setSelectedParcel(updatedParcels.find((p) => p.id === parcel.id) || null);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOrderPrice = parcel.order.reduce(
    (total, orderItem) => total + orderItem.menuItem.price * orderItem.quantity,
    0
  );

  return (
    <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
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
        <div className="h-48 overflow-y-auto">
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
        {parcel.order.length > 0 && (
          <OrderSummary
            order={parcel.order}
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
