import { useEffect, useState } from "react";
import { Table } from "@/types/index";
import TableCard from "@/components/tables/TableCard";

const initialTables: Table[] = [
  { name: "A5", status: "available", order: [] },
  { name: "A4", status: "available", order: [] },
  { name: "A3", status: "available", order: [] },
  { name: "A2", status: "available", order: [] },
  { name: "A1", status: "available", order: [] },
  { name: "B5", status: "available", order: [] },
  { name: "B4", status: "available", order: [] },
  { name: "B3", status: "available", order: [] },
  { name: "B2", status: "available", order: [] },
  { name: "B1", status: "available", order: [] },
  { name: "C5", status: "available", order: [] },
  { name: "C4", status: "available", order: [] },
  { name: "C3", status: "available", order: [] },
  { name: "C2", status: "available", order: [] },
  { name: "C1", status: "available", order: [] },
  { name: "D5", status: "available", order: [] },
  { name: "D4", status: "available", order: [] },
  { name: "D3", status: "available", order: [] },
  { name: "D2", status: "available", order: [] },
  { name: "D1", status: "available", order: [] },
];

export default function Tables() {
  const [tables, setTables] = useState<Table[]>(() => {
    const savedTables = localStorage.getItem("tables");
    return savedTables ? JSON.parse(savedTables) : initialTables;
  });

  useEffect(() => {
    localStorage.setItem("tables", JSON.stringify(tables));
  }, [tables]);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  console.log(selectedTable);
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
        <p className="text-muted-foreground">
          Manage your restaurant tables and orders
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-4 p-2">
        {Object.keys(groupedTables).map((section) => (
          <div key={section}>
            <h2 className="text-xl font-semibold mb-2">Section {section}</h2>
            {groupedTables[section].map((table) => (
              <TableCard
                key={table.name as React.Key}
                table={table}
                tables={tables}
                setSelectedTable={setSelectedTable}
                setTables={setTables}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
