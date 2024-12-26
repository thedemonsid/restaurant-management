import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Expense } from "@/electron/database/types";
import { addMinutes, format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ExpensesManager = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    name: "",
    price: "",
    doneBy: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1);
  const [doneBy, setDoneBy] = useState("");

  useEffect(() => {
    async function fetchExpenses() {
      const items = await window.restaurant.expenses.getExpensesForFullDay(
        selectedDate ? selectedDate.toISOString() : new Date().toISOString()
      );
      setExpenses(items);
    }
    fetchExpenses();
  }, [expenses.length, selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const expense = {
      name: newExpense.name,
      price: parseFloat(newExpense.price),
      doneBy: newExpense.doneBy,
    };
    const addedExpense = await window.restaurant.expenses.addExpense(expense);
    //@ts-ignore
    setExpenses([...expenses, addedExpense]);
    setNewExpense({ name: "", price: "", doneBy: "" });
  };

  const handleUpdateExpense = async (
    id: number,
    name: string,
    price: number,
    doneBy: string
  ) => {
    const updatedExpense = {
      id,
      name,
      price,
      doneBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updatedExpense.name = updatedExpense.name.trim();
    updatedExpense.price = parseFloat(updatedExpense.price.toFixed(2));

    try {
      const { createdAt, updatedAt, ...expenseWithoutTimestamps } =
        updatedExpense;
      await window.restaurant.expenses.updateExpense(expenseWithoutTimestamps);
      const updatedItems = expenses.map((item) => {
        if (item.id === id) {
          return updatedExpense;
        }
        return item;
      });
      //@ts-ignore
      setExpenses(updatedItems);
      alert(`Expense updated successfully: ${JSON.stringify(updatedExpense)}`);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };
  console.log(new Date().toLocaleString());
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="mb-2">
          <Label className="block text-sm font-medium text-gray-700">
            {/* add marathi translation */}
            Name of Expense / खर्चाचे नाव
          </Label>
          <Input
            type="text"
            name="name"
            value={newExpense.name}
            autoFocus
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <Label className="block text-sm font-medium text-gray-700">
            Price / किंमत
          </Label>
          <Input
            type="number"
            name="price"
            value={newExpense.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <Label className="block text-sm font-medium text-gray-700">
            Done By / कोणी केले
          </Label>
          <Input
            type="text"
            name="doneBy"
            value={newExpense.doneBy}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Add Expense</Button>
      </form>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-semibold mb-2">Existing Expenses</h2>
          <h2 className="text-3xl font-semibold mb-2 text-red-600">
            {selectedDate?.toDateString()}
          </h2>
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
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {/* add marathi */}
              <th className="py-2 min-w-[100px] max-w-[200px]">Sr. No</th>
              <th className="py-2 min-w-[150px] max-w-[300px">
                Name of Expense / खर्चाचे नाव{" "}
              </th>
              <th className="py-2 min-w-[100px] max-w-[200px]">
                Price / किंमत
              </th>
              <th className="py-2 min-w-[150px] max-w-[300px]">
                Done By / कोणी केले
              </th>
              <th className="py-2 min-w-[150px] max-w-[300px]">Date</th>
              <th className="py-2 min-w-[150px] max-w-[300px]">Actions</th>
            </tr>
          </thead>
          <tbody className="max-h-40">
            {expenses
              .sort(
                (a, b) =>
                  new Date(b?.createdAt).getTime() -
                  new Date(a?.createdAt).getTime()
              )
              .map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 text-center min-w-[100px] max-w-[200px]">
                    {index + 1}
                  </td>
                  <td className="py-2 text-center min-w-[150px] max-w-[300px]">
                    {item.name}
                  </td>
                  <td className="py-2 text-center min-w-[100px] max-w-[200px]">
                    ₹{item.price}
                  </td>
                  <td className="py-2 text-center min-w-[150px] max-w-[300px]">
                    {item.doneBy}
                  </td>
                  <td className="py-2 text-center min-w-[150px] max-w-[300px]">
                    {item.createdAt
                      ? addMinutes(
                          parseISO(item?.createdAt),
                          330
                        ).toLocaleString()
                      : "Unknown"}
                  </td>
                  <td className="py-2 text-center min-w-[150px] max-w-[300px]">
                    <Dialog
                      onOpenChange={(isOpen) => {
                        if (isOpen) {
                          setName(item.name);
                          setPrice(item.price);
                          setDoneBy(item.doneBy);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button>Update</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Expense</DialogTitle>
                          <DialogDescription>
                            Update the name, price, and done by of the expense
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={name}
                              className="col-span-3"
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                              Price
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              min={1}
                              value={price}
                              className="col-span-3"
                              onChange={(e) =>
                                setPrice(parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="doneBy" className="text-right">
                              Done By
                            </Label>
                            <Input
                              id="doneBy"
                              value={doneBy}
                              className="col-span-3"
                              onChange={(e) => setDoneBy(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant={"destructive"}>Delete</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Expense</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete the expense?
                                  </DialogDescription>
                                </DialogHeader>
                                <div>
                                  <p>
                                    Name: {item.name} <br />
                                    Price: ₹{item.price} <br />
                                    Done By: {item.doneBy} <br />
                                  </p>
                                </div>
                                <DialogFooter>
                                  <DialogClose>
                                    <Button
                                      variant={"destructive"}
                                      type="submit"
                                      onClick={async () => {
                                        await window.restaurant.expenses.deleteExpense(
                                          item.id
                                        );
                                        const updatedItems = expenses.filter(
                                          (i) => i.id !== item.id
                                        );
                                        //@ts-ignore
                                        setExpenses(updatedItems);
                                      }}
                                    >
                                      Confirm
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <DialogClose>
                            <Button
                              type="submit"
                              onClick={() => {
                                if (
                                  name.trim() === item.name &&
                                  price === item.price &&
                                  doneBy.trim() === item.doneBy
                                ) {
                                  alert("No changes made to the expense");
                                  return;
                                }
                                if (name !== "" && price > 0 && doneBy !== "") {
                                  handleUpdateExpense(
                                    item.id,
                                    name,
                                    price,
                                    doneBy
                                  );
                                }
                              }}
                              disabled={
                                name.trim() === item.name.trim() &&
                                price === item.price &&
                                doneBy.trim() === item.doneBy
                              }
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesManager;
