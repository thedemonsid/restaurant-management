import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { MenuItem, OrderItem } from "@/types/index";

interface OrderSummaryProps {
  order: OrderItem[];
  menuItems: MenuItem[];
  handleAddItem: (item: MenuItem) => void;
  handleRemoveItem: (itemId: number) => void;
  handleOrderSubmit: () => void;
  totalOrderPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  menuItems,
  handleAddItem,
  handleRemoveItem,
  handleOrderSubmit,
  totalOrderPrice,
}) => {
  return (
    <div className="mt-4">
      <h4 className="font-medium">Current Order</h4>
      {order.map((orderItem) => (
        <div
          key={orderItem.menuItem.id}
          className="flex justify-between items-center py-1"
        >
          <span>
            {orderItem.menuItem.name} (x{orderItem.quantity})
          </span>
          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRemoveItem(orderItem.menuItem.id)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="ml-2"
              onClick={() => handleAddItem(orderItem.menuItem)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="font-bold mt-2">Total: ${totalOrderPrice.toFixed(2)}</div>
      <Button className="w-full mt-4" onClick={handleOrderSubmit}>Submit Order</Button>
    </div>
  );
};

export default OrderSummary;
