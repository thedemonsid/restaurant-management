import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const orders = await window.restaurant.order.getOrders();
      const expenses = await window.restaurant.expenses.getExpenses();

      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.amountPaid,
        0
      );
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.price,
        0
      );
      const netProfit = totalRevenue - totalExpenses;

      setTotalRevenue(totalRevenue);
      setTotalExpenses(totalExpenses);
      setNetProfit(netProfit);
      setRecentOrders(orders.slice(-5));
      setRecentExpenses(expenses.slice(-5));
    }

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{netProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
