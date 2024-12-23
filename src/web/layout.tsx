import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Utensils,
  ClipboardList,
  Users,
  Settings,
  Menu,
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
            <span>Dashboard</span>
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
            <span>Tables</span>
          </Link>
          <Link
            to="/parcels"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/parcels"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span>Parcels</span>
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
            <span>Orders</span>
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
            <span>Menu</span>
          </Link>
          <Link
            to="/staff"
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/staff"
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Staff</span>
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
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="h-full p-6">{children}</div>
      </div>
    </div>
  );
}
