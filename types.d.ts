interface Window {
  restaurant: {
    menu: {
      addItem: (item: any) => Promise<void>;
      getItems: () => Promise<any>;
      deleteMenuItem: (id: number) => Promise<void>;
      updateMenuItem: (item: any) => Promise<void>;
    };
    order: {
      addOrder: (order: any, orderedItems: any) => Promise<void>;
      getOrders: () => Promise<any>;
      getOrderItems: (orderId: number) => Promise<any>;
      printReceipt: (data: any) => void;
    };
    revenue: {
      getMonthlyRevenue: (year: number, month: number) => Promise<any>;
      getDailyRevenue: (
        year: number,
        month: number,
        day: number
      ) => Promise<any>;
    };
    expenses: {
      addExpense: (expense: any) => Promise<void>;
      getExpenses: () => Promise<any>;
      deleteExpense: (id: number) => Promise<void>;
      updateExpense: (expense: any) => Promise<void>;
      getExpensesByDate: (date: string) => Promise<any>;
      getExpensesForFullDay: (date: string) => Promise<any>;
    };
  };
}
