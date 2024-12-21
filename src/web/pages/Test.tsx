import { useEffect, useState } from "react";
import type { MenuItem } from "../../electron/database/types";

export default function Test() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: 0 });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    //@ts-ignore
    const items = await window.restaurant.menu.getItems();
    setMenuItems(items);
  };

  const handleAddMenuItem = async () => {
    //@ts-ignore
    await window.restaurant.menu.addItem(newMenuItem);
    setNewMenuItem({ name: "", price: 0 });
    loadMenuItems();
  };

  const handleRemoveMenuItem = async (id: number) => {
    //@ts-ignore
    await window.restaurant.menu.deleteMenuItem(id);
    loadMenuItems();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add Menu Item</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={newMenuItem.name}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, name: e.target.value })
          }
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={newMenuItem.price}
          onChange={(e) =>
            setNewMenuItem({
              ...newMenuItem,
              price: parseFloat(e.target.value),
            })
          }
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleAddMenuItem}
          className="bg-blue-500 text-white p-2 w-full"
        >
          Add Item
        </button>
      </div>

      <div className="">
        <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
        <ul>
          {menuItems.map((item: MenuItem) => (
            <li
              key={item.id}
              className="border p-2 mb-2 flex justify-between items-center"
            >
              <span>
                {item.name} - ${item.price}
              </span>
              <button
                onClick={() => handleRemoveMenuItem(item.id)}
                className="bg-red-500 text-white p-1"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
