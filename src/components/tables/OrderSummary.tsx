import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { MenuItem } from "@/types/index";

interface OrderSummaryProps {
  order: { [key: string]: number };
  menuItems: MenuItem[];
  handleAddItem: (item: MenuItem) => void;
  handleRemoveItem: (itemName: string) => void;
  totalOrderPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  menuItems,
  handleAddItem,
  handleRemoveItem,
  totalOrderPrice,
}) => {
  return (
    <div className="mt-4">
      <h4 className="font-medium">Current Order</h4>
      {Object.entries(order).map(([itemName, quantity]) => (
        <div key={itemName} className="flex justify-between items-center py-1">
          <span>OrderSummary
            {itemName} (x{quantity})
          </span>
          <div>
            <Button size="sm" variant="outline" onClick={() => handleRemoveItem(itemName)}>
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="ml-2"
              onClick={() => handleAddItem(menuItems.find((item) => item.name === itemName)!)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="font-bold mt-2">Total: ${totalOrderPrice.toFixed(2)}</div>
      <Button className="w-full mt-4">Submit Order</Button>
    </div>
  );
};

export default OrderSummary;