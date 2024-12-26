import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CardComponent = ({
  title,
  value,
  valueClass,
}: {
  title: string;
  value: string;
  valueClass: string;
}) => (
  <Card className="min-w-60">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className={cn("font-bold text-3xl", valueClass)}>{value}</p>
    </CardContent>
  </Card>
);

const SelectComponent = ({
  label,
  options,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="flex flex-col">
    <label className="mb-2">{label}</label>
    <select
      className="p-2 border border-gray-300 rounded-md"
      onChange={onChange}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedMonthlyRevenue, setSelectedMonthlyRevenue] = useState(0);
  const [selectedMonthlyExpenses, setSelectedMonthlyExpenses] = useState(0);

  const fetchData = async () => {
    const orders = await window.restaurant.order.getOrders();
    const expenses = await window.restaurant.expenses.getExpenses();

    const totalRevenue = orders.reduce(
      (sum: number, order: { amountPaid: number }) => sum + order.amountPaid,
      0
    );
    const totalExpenses = expenses.reduce(
      (sum: number, expense: { price: number }) => sum + expense.price,
      0
    );
    const netProfit = totalRevenue - totalExpenses;

    setTotalRevenue(totalRevenue);
    setTotalExpenses(totalExpenses);
    setNetProfit(netProfit);
  };

  const fetchMonthlyData = async (year: number, month: number) => {
    const monthlyRevenue = await window.restaurant.revenue.getMonthlyRevenue(
      year,
      month
    );
    const monthlyExpenses = await window.restaurant.expenses.getMonthlyExpenses(
      year,
      month
    );

    setMonthlyRevenue(monthlyRevenue);
    setMonthlyExpenses(monthlyExpenses);
  };

  const fetchSelectedMonthlyData = async () => {
    if (!selectedMonth || !selectedYear) return;

    const monthlyRevenue = await window.restaurant.revenue.getMonthlyRevenue(
      selectedYear,
      selectedMonth
    );
    const monthlyExpenses = await window.restaurant.expenses.getMonthlyExpenses(
      selectedYear,
      selectedMonth
    );

    setSelectedMonthlyRevenue(monthlyRevenue);
    setSelectedMonthlyExpenses(monthlyExpenses);
  };

  useEffect(() => {
    fetchData();
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    fetchMonthlyData(year, month);
  }, []);

  useEffect(() => {
    fetchSelectedMonthlyData();
  }, [selectedMonth, selectedYear]);

  const monthOptions = Array.from({ length: 12 }).map((_, i) => {
    const month = i + 1;
    return {
      value: `${new Date().getFullYear()}-${month}`,
      label: new Date(new Date().getFullYear(), i).toLocaleString("default", {
        month: "long",
      }),
    };
  });

  const yearOptions = Array.from({ length: 5 }).map((_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex flex-col flex-wrap gap-4">
        <div className="flex justify-between w-1/2 items-center gap-4">
          <CardComponent
            title="Total Revenue"
            value={`₹${totalRevenue}`}
            valueClass="text-green-400"
          />
          <CardComponent
            title="Total Expenses"
            value={`₹${totalExpenses}`}
            valueClass="text-red-400"
          />
          <CardComponent
            title="Net Profit"
            value={`₹${netProfit}`}
            valueClass={netProfit > 0 ? "text-green-400" : "text-red-400"}
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {new Date().toLocaleString("default", { month: "long" })}{" "}
          {new Date().getFullYear()}
        </h1>
        <div className="flex justify-between w-1/2 items-center gap-4">
          <CardComponent
            title="Monthly Revenue"
            value={`₹${monthlyRevenue}`}
            valueClass="text-green-400"
          />
          <CardComponent
            title="Monthly Expenses"
            value={`₹${monthlyExpenses}`}
            valueClass="text-red-400"
          />
          <CardComponent
            title="Monthly Net Profit"
            value={`₹${monthlyRevenue - monthlyExpenses}`}
            valueClass={
              monthlyRevenue - monthlyExpenses > 0
                ? "text-green-400"
                : "text-red-400"
            }
          />
        </div>
        <h1 className="text-2xl font-bold mb-4">Select a month and year</h1>
        <div className="flex gap-4">
          <SelectComponent
            label="Month"
            options={monthOptions}
            onChange={(e) =>
              setSelectedMonth(parseInt(e.target.value.split("-")[1]))
            }
          />
          <SelectComponent
            label="Year"
            options={yearOptions}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          />
        </div>
        <div className="flex justify-between w-1/2 items-center gap-4">
          <CardComponent
            title="Monthly Revenue"
            value={`₹${selectedMonthlyRevenue}`}
            valueClass="text-green-400"
          />
          <CardComponent
            title="Monthly Expenses"
            value={`₹${selectedMonthlyExpenses}`}
            valueClass="text-red-400"
          />
          <CardComponent
            title="Monthly Net Profit"
            value={`₹${selectedMonthlyRevenue - selectedMonthlyExpenses}`}
            valueClass={
              selectedMonthlyRevenue - selectedMonthlyExpenses > 0
                ? "text-green-400"
                : "text-red-400"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
