import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Table } from "@/types/index";
import { cn } from "@/lib/utils";
import TableManager from "@/components/tables/TableManager";

interface TableCardProps {
  table: Table;
  setSelectedTable: (table: Table) => void;
  setTables: (tables: Table[]) => void;
  tables: Table[];
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  setSelectedTable,
  setTables,
  tables,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card
          key={table.name as React.Key}
          className={cn(
            table.status === "occupied" && "bg-green-300",
            table.status === "reserved" && "bg-yellow-100",
            "min-w-28 min-h-28 max-w-56 max-h-40 mb-2 cursor-pointer"
          )}
          onClick={() => setSelectedTable(table)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <span> Table </span>
              <span className="text-red-600 shadow-sm text-xl ml-3 bg-green-300 p-2 rounded-lg">
                {table.name}
              </span>
            </CardTitle>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                table.status === "occupied"
                  ? "bg-green-100 text-green-800"
                  : table.status === "reserved"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {table.status}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {table.status === "occupied"
                ? "Currently in use"
                : table.status === "reserved"
                ? "Reserved"
                : "Available for seating"}
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => setSelectedTable(table)}
            >
              Manage Table
            </Button>
          </CardContent>
        </Card>
      </SheetTrigger>
      <TableManager table={table} tables={tables} setTables={setTables} />
    </Sheet>
  );
};

export default TableCard;
