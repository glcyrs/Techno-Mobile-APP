import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ScanLine,
  Bell,
  User,
} from "lucide-react";

export default function BottomNav() {
  const location = useLocation();

  const [alertCount, setAlertCount] = useState(0);

const computeAlerts = () => {
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  const now = new Date();
  const sevenDays = new Date();
  sevenDays.setDate(now.getDate() + 7);

  const thirtyDays = new Date();
  thirtyDays.setDate(now.getDate() + 30);

  // STOCK
  const outStock = products.filter(p => Number(p.quantity ?? 0) === 0);

  const lowStock = products.filter(p => {
    const qty = Number(p.quantity ?? 0);
    const threshold = Number(p.low_stock_threshold ?? 5);
    return qty > 0 && qty <= threshold;
  });

  // EXPIRY
  const expired = products.filter(p => {
    if (!p.expiration_date) return false;
    const exp = new Date(p.expiration_date);
    return !isNaN(exp) && exp < now;
  });

  const expiringSoon = products.filter(p => {
    if (!p.expiration_date) return false;
    const exp = new Date(p.expiration_date);
    return !isNaN(exp) && exp >= now && exp <= sevenDays;
  });

  const expiringLater = products.filter(p => {
    if (!p.expiration_date) return false;
    const exp = new Date(p.expiration_date);
    return !isNaN(exp) && exp > sevenDays && exp <= thirtyDays;
  });

  // TOTAL (MATCH ALERTS PAGE)
  const total =
    outStock.length +
    lowStock.length +
    expired.length +
    expiringSoon.length +
    expiringLater.length;

  setAlertCount(total);
};


  useEffect(() => {
    computeAlerts();

    const handleUpdate = () => computeAlerts();

    window.addEventListener("productsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("productsUpdated", handleUpdate);
    };
  }, []);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/scan", icon: ScanLine, label: "Scan" },
    { path: "/alerts", icon: Bell, label: "Alerts" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          const isScan = item.path === "/scan";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isScan ? "-mt-6" : ""
              } ${isActive && !isScan ? "text-blue-800" : "text-gray-400"}`}
            >
              {/* SCAN BUTTON */}
              {isScan ? (
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    isActive
                      ? "bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-white scale-105"
                      : "bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-white"
                  }`}
                >
                  <ScanLine className="h-6 w-6" />
                </div>
              ) : (
                <div className="relative">
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? "stroke-[2.5px]" : ""
                    }`}
                  />

                  {/* 🔥 ALERT BADGE */}
                  {item.path === "/alerts" && alertCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {alertCount}
                    </span>
                  )}
                </div>
              )}

              <span
                className={`text-[10px] font-medium ${
                  isActive && !isScan ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="h-6 bg-white" />
    </nav>
  );
}