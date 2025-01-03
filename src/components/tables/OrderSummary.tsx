import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { MenuItem, OrderItem } from "@/types/index";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderSummaryProps {
  order: OrderItem[];
  handleAddItem: (item: MenuItem) => void;
  handleRemoveItem: (itemId: number) => void;
  handleOrderSubmit: ({ amountPaid, paymentMethod }: any) => void;
  totalOrderPrice: number;
  tableName: String;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  handleAddItem,
  handleRemoveItem,
  handleOrderSubmit,
  totalOrderPrice,
  tableName,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSaveOrder = () => {
    if (!paymentMethod.length) return;
    if (paymentMethod === "srs" || paymentMethod === "dcs") {
      handleOrderSubmit({ amountPaid: 0, paymentMethod });
      // alert("Order submitted successfully by " + paymentMethod);
      return;
    }
    handleOrderSubmit({ amountPaid: totalOrderPrice, paymentMethod });
  };

  const handlePrintOrder = () => {
    const receiptData = {
      orderId: Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleString(),
      items: order.map((orderItem) => ({
        name: orderItem.menuItem.name,
        quantity: orderItem.quantity,
        price: orderItem.menuItem.price,
      })),
      total: totalOrderPrice,
    };
    window.restaurant.order.printReceipt(receiptData);
  };
  const handleKitchenReceipt = () => {
    const receiptData = {
      orderId: Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleString(),
      items: order.map((orderItem) => ({
        name: orderItem.menuItem.name,
        quantity: orderItem.quantity,
        price: orderItem.menuItem.price,
      })),
      total: totalOrderPrice,
    };
    window.restaurant.order.printKitchenReceipt(receiptData);
  };
  const handlePrintAndSaveOrder = () => {
    console.log("Order printed and saved");
    handlePrintOrder();
    handleSaveOrder();
  };
  return (
    <div className="mt-4">
      <h4 className="font-medium">Current Order</h4>
      <section className="max-h-72 overflow-y-auto">
        {" "}
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
      </section>
      <div className="font-bold mt-2">Total: ${totalOrderPrice.toFixed(2)}</div>
      <div className="flex justify-between">
        {" "}
        <Dialog>
          <DialogTrigger>
            <Button className="mt-4">Submit Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex justify-between gap-4 flex-col">
              <DialogTitle>Order Summary</DialogTitle>
              <div className="font-bold">
                Table{" "}
                <span className="text-md bg-green-100 text-red-600 p-2 rounded-md">
                  {tableName}
                </span>
              </div>
              <div className="space-y-2">
                {/* order summary in print format */}
                {order.map((orderItem) => (
                  <div
                    key={orderItem.menuItem.id}
                    className="flex justify-between items-center py-1"
                  >
                    <span>
                      {orderItem.menuItem.name} (x{orderItem.quantity})
                    </span>
                    <span>
                      ₹
                      {(orderItem.menuItem.price * orderItem.quantity).toFixed(
                        2
                      )}
                    </span>
                  </div>
                ))}
                <div className="font-bold mt-2">
                  Total:{" "}
                  <span className="text-green-500 text-xl">
                    ₹{totalOrderPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </DialogHeader>
            <DialogTitle>Payment Method</DialogTitle>
            <Select
              defaultValue={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">UPI / Online</SelectItem>
                <SelectItem value="srs">Shreyash Shrirame</SelectItem>
                <SelectItem value="dcs">Damaji Shrirame</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <DialogClose>
                <Button
                  onClick={handleSaveOrder}
                  type="submit"
                  disabled={!paymentMethod.length}
                >
                  Save Order
                </Button>
              </DialogClose>
              <DialogClose>
                <Button
                  onClick={handlePrintAndSaveOrder}
                  type="submit"
                  disabled={!paymentMethod.length}
                >
                  Print & Save Order
                </Button>
              </DialogClose>
              <DialogClose>
                <Button
                  onClick={handlePrintOrder}
                  type="submit"
                  // disabled={!paymentMethod.length}
                >
                  Print Order
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button className="mt-4" onClick={handleKitchenReceipt} variant={"outline"}>
          Generate QT
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
