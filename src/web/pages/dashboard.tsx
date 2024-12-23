import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { StatsCard } from "@/components/stats-card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  // const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);

  // useEffect(() => {
  //   async function fetchDashboardData() {

  //   }

  //   fetchDashboardData();
  // }, []);

  useEffect(() => {
    async function fetchDailyRevenue(date: Date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const fetchedDailyRevenue =
        await window.restaurant.revenue.getDailyRevenue(year, month, day);
      setDailyRevenue(fetchedDailyRevenue);
    }

    if (selectedDate) {
      fetchDailyRevenue(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    async function fetchMonthlyRevenue(year: number, month: number) {
      const fetchedMonthlyRevenue =
        await window.restaurant.revenue.getMonthlyRevenue(year, month);
      setMonthlyRevenue(fetchedMonthlyRevenue);
    }

    const currentDate = new Date();
    fetchMonthlyRevenue(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Monthly Revenue"
          value={`₹${monthlyRevenue}`}
          subtitle={`Revenue for ${format(new Date(), "MMMM yyyy")}`}
          icon={<i className="fas fa-calendar-alt"></i>}
        />
        <StatsCard
          title="Selected Date Revenue"
          value={`₹${dailyRevenue}`}
          subtitle={`Revenue for ${
            selectedDate ? format(selectedDate, "PPP") : "selected date"
          }`}
          icon={<i className="fas fa-calendar"></i>}
        />
      </div>
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
              //@ts-ignore //Todo: Fix this
              selected={selectedDate}
              //@ts-ignore //Todo: Fix this
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Dashboard;
