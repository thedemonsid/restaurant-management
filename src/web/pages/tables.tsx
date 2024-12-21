import { useEffect, useState } from "react";
import { Table } from "@/types/index";
import TableCard from "@/components/tables/TableCard";

const tables: Table[] = [
  { name: "A1", status: "occupied" },
  { name: "A2", status: "available" },
  { name: "A3", status: "available" },
  { name: "A4", status: "available" },
  { name: "A5", status: "occupied" },
  { name: "B1", status: "available" },
  { name: "B2", status: "occupied" },
  { name: "B3", status: "available" },
  { name: "B4", status: "available" },
  { name: "B5", status: "available" },
  { name: "C1", status: "available" },
  { name: "C2", status: "available" },
  { name: "C3", status: "available" },
  { name: "C4", status: "available" },
  { name: "C5", status: "available" },
  { name: "D1", status: "available" },
  { name: "D2", status: "available" },
  { name: "D3", status: "available" },
  { name: "D4", status: "available" },
  { name: "D5", status: "available" },
];

export default function Tables() {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    async function fetchMenuItems() {
      const menuItems = await window.restaurant.menu.getItems();
      if (menuItems.length === 0) {
        console.error("No menu items found");
        return;
      }
    }
    fetchMenuItems();
  }, []);

  const groupedTables = tables.reduce((acc, table) => {
    const section = table.name.charAt(0);
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(table);
    return acc;
  }, {} as { [key: string]: Table[] });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tables</h1>
        <p className="text-muted-foreground">Manage your restaurant tables and orders</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4 p-2">
        {Object.keys(groupedTables).map((section) => (
          <div key={section}>
            <h2 className="text-xl font-semibold mb-2">Section {section}</h2>
            {groupedTables[section].map((table) => (
              <TableCard key={table.name as React.Key} table={table} setSelectedTable={setSelectedTable} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}