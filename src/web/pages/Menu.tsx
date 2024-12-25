import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types/index";

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

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
    const addedItem = await window.restaurant.menu.addItem(item);
    //@ts-ignore
    setMenuItems([...menuItems, addedItem]);
    setNewItem({ name: "", price: "" });
  };

  const handleUpdateItem = (id: number) => {
    console.log(`Updated item with ID: ${id}`);
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
          <tbody>
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
                  <Button onClick={() => handleUpdateItem(item.id)}>
                    Update
                  </Button>
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
