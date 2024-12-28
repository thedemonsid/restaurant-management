import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Utensils,
  ClipboardList,
  Menu,
  IndianRupee,
  Settings,
  Bike,
} from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background">
        <div className="p-4">
          <h1 className="text-xl font-bold">Restaurant Manager</h1>
        </div>
        <nav className="space-y-1 p-2">
          <Link
            to="/"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard / डॅशबोर्ड</span>
          </Link>
          <Link
            to="/tables"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/tables"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <Utensils className="h-4 w-4" />
            <span>Tables / टेबल</span>
          </Link>
          <Link
            to="/parcels"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/parcels"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <Bike className="h-4 w-4" />
            <span>Parcels / पार्सल्स</span>
          </Link>
          <Link
            to="/orders"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/orders"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Orders / ऑर्डर</span>
          </Link>
          <Link
            to="/menu"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/menu"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <Menu className="h-4 w-4" />
            <span>Menu / मेनू</span>
          </Link>
          <Link
            to="/expenses"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/expenses"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <IndianRupee className="h-4 w-4" />
            <span>Expenses / खर्च</span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/settings"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings / सेटिंग्स</span>
          </Link>
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="h-full p-6">{children}</div>
      </div>
    </div>
  );
}
