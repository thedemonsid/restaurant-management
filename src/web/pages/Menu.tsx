import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/index";
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
import { useToast } from "@/hooks/use-toast";
const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1);
  const toast = useToast();
  useEffect(() => {
    async function fetchMenuItems() {
      const items = await window.restaurant.menu.getItems();
      setMenuItems(items);
      setFilteredItems(items); // Initialize filteredItems with all menu items
    }
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const filterMenuItems = () => {
      const filtered = menuItems.filter((item) => {
        const nameMatch = newItem.name
          ? item.name.toLowerCase().includes(newItem.name.toLowerCase())
          : true;
        const priceMatch = newItem.price
          ? item.price.toString().includes(newItem.price)
          : true;
        return nameMatch && priceMatch;
      });
      setFilteredItems(filtered);
    };
    filterMenuItems();
  }, [newItem.name, newItem.price, menuItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const item = { name: newItem.name, price: parseFloat(newItem.price) };

    try {
      const addedItem = await window.restaurant.menu.addItem(item);
      //@ts-ignore
      setMenuItems([...menuItems, addedItem]);
      setNewItem({ name: "", price: "" });
      toast.toast({
        title: "Menu item added successfully",
        description: `Added ${item.name} to the menu`,
        className: "bg-green-100",
      });
    } catch (error) {
      toast.toast({
        title: "Failed to add menu item",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleUpdateItem = async (id: number, name: string, price: number) => {
    const updatedItem = { id, name, price };
    updatedItem.name = updatedItem.name.trim();
    updatedItem.price = parseFloat(updatedItem.price.toFixed(2));
    try {
      await window.restaurant.menu.updateMenuItem(updatedItem);
      const updatedItems = menuItems.map((item) => {
        if (item.id === id) {
          return updatedItem;
        }
        return item;
      });
      setMenuItems(updatedItems);
      toast.toast({
        title: "Menu item updated successfully",
        description: `Updated ${name} in the menu`,
        className: "bg-green-100",
      });
    } catch (error) {
      console.error("Failed to update menu item:", error);
      toast.toast({
        title: "Failed to update menu item",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            type="text"
            name="name"
            value={newItem.name}
            autoFocus
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <Input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Add Menu Item</Button>
      </form>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">Existing Menu Items</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 min-w-[100px] max-w-[200px]">Sr. No</th>
              <th className="py-2 min-w-[150px] max-w-[300px]">Name</th>
              <th className="py-2 min-w-[100px] max-w-[200px]">Price</th>
              <th className="py-2 min-w-[150px] max-w-[300px]">Actions</th>
            </tr>
          </thead>
          <tbody className="max-h-40">
            {filteredItems.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 text-center min-w-[100px] max-w-[200px]">
                  {index + 1}
                </td>
                <td className="py-2 text-center min-w-[150px] max-w-[300px]">
                  {item.name}
                </td>
                <td className="py-2 text-center min-w-[100px] max-w-[200px]">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-2 text-center min-w-[150px] max-w-[300px]">
                  <Dialog
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setName("");
                        setPrice(1);
                      }
                      if (isOpen) {
                        setName(item.name);
                        setPrice(item.price);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>Update</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit MenuItem</DialogTitle>
                        <DialogDescription>
                          Update the name and price of the menu item
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
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            type="submit"
                            onClick={() => {
                              if (
                                name.trim() === item.name &&
                                price === item.price
                              ) {
                                // alert("No changes made to the menu item");
                                return;
                              }
                              if (name !== "" && price > 0) {
                                handleUpdateItem(item.id, name, price);
                              }
                            }}
                            disabled={
                              name.trim() === item.name.trim() &&
                              price === item.price
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

export default Menu;
