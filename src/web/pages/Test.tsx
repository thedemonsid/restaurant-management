import { useEffect, useState } from "react";
import type { MenuItem } from "../../electron/database/types";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Test() {
  const [items, setItems] = useState<(MenuItem & { category_name: string })[]>(
    []
  );
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category_id: 1,
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    const loadItems = async () => {
      const menuItems = await window.restaurant.menu.getItems();
      setItems(
        menuItems.map((item) => ({ ...item, category_name: "default" }))
      );
    };

    const loadCategories = async () => {
      const categories = await window.restaurant.menu.getCategories();
      setCategories(categories);
    };

    loadItems();
    loadCategories();
  }, []);

  const handleAddItem = async () => {
    await window.restaurant.menu.addItem(newItem);
    const menuItems = await window.restaurant.menu.getItems();
    setItems(menuItems.map((item) => ({ ...item, category_name: "default" })));
    setNewItem({ name: "", price: 0, category_id: categories[0]?.id || 1 });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) =>
            setNewItem({ ...newItem, price: parseFloat(e.target.value) })
          }
        />
        <Select
          value={`${newItem.category_id}`}
          onValueChange={(value) =>
            setNewItem({ ...newItem, category_id: parseInt(value) })
          }
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={`${category.id}`}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <Button onClick={handleAddItem} className="w-full">
          Add Item
        </Button>
      </div>
      <div>
        {items.map((item) => (
          <div key={item.id} className="p-2 border-b border-gray-200">
            {item.name} - ${item.price} ({item.category_name})
          </div>
        ))}
      </div>
    </div>
  );
}
