import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/electron/database/types";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const fetchedOrders = await window.restaurant.order.getOrders();
      console.log("Fetched Orders", fetchedOrders);
      setOrders(fetchedOrders);
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    const filterOrdersByDate = () => {
      if (!selectedDate) return;

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(6, 0, 0, 0); //! Set to 6 AM of the selected date

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(startOfDay.getDate() + 1); //! Set to 6 AM of the next day

      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfDay && orderDate < endOfDay;
      });

      setFilteredOrders(filtered);
    };

    filterOrdersByDate();
  }, [orders, selectedDate]);

  const handleOrderClick = async (order: Order) => {
    setSelectedOrder(order);
    const items = await window.restaurant.order.getOrderItems(order.id);
    console.log("Order Items", items);
    setOrderItems(items);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[280px] justify-start text-left font-normal ${
                !selectedDate && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              //@ts-ignore
              selected={selectedDate}
              //@ts-ignore
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="py-2 text-center">Order ID</TableHead>
            <TableHead className="py-2 text-center">Table Name</TableHead>
            <TableHead className="py-2 text-center">Amount Paid</TableHead>
            <TableHead className="py-2 text-center">Payment Method</TableHead>
            <TableHead className="py-2 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="py-2 text-center">{order.id}</TableCell>
              <TableCell className="py-2 text-center">
                {order.tableName}
              </TableCell>
              <TableCell className="py-2 text-center">
                ₹{order.amountPaid.toFixed(2)}
              </TableCell>
              <TableCell className="py-2 text-center">
                {order.paymentMethod}
              </TableCell>
              <TableCell className="py-2 text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOrderClick(order)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                      <div>
                        <p>
                          <strong>Order ID:</strong> {selectedOrder.id}
                        </p>
                        <p>
                          <strong>Table Name:</strong> {selectedOrder.tableName}
                        </p>
                        <p>
                          <strong>Amount Paid:</strong> ₹
                          {selectedOrder.amountPaid.toFixed(2)}
                        </p>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {selectedOrder.paymentMethod}
                        </p>
                        <h4 className="font-medium mt-4">Order Items</h4>
                        {orderItems.map((item) => (
                          <div
                            key={item.menu_item_id}
                            className="flex justify-between items-center py-1"
                          >
                            <span>
                              {item.name} (x{item.quantity})
                            </span>
                            <span>
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={() => setSelectedOrder(null)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Orders;
