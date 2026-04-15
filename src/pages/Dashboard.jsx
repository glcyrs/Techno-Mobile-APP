import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

import PageHeader from "../components/layout/PageHeader";
import StatsCard from "../components/dashboard/StatsCard";
import AlertBanner from "../components/dashboard/AlertBanner";
import RecentMovements from "../components/dashboard/RecentMovements";
import CategoryChart from "../components/dashboard/CategoryChart";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // MOCK DATA 
  const [products] = useState([
    { name: "Milk", quantity: 10, low_stock_threshold: 5, selling_price: 50, category: "Dairy" },
    { name: "Bread", quantity: 2, low_stock_threshold: 5, selling_price: 30, category: "Bakery" },
    { name: "Egg", quantity: 20, low_stock_threshold: 5, selling_price: 10, category: "Dairy" },
    { name: "Rice", quantity: 8, low_stock_threshold: 5, selling_price: 60, category: "Grains" },
  ]);

  const [movements] = useState([
    { id: 1, action: "Added Milk stock" },
    { id: 2, action: "Bread is low stock" },
    { id: 3, action: "Egg updated" },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0b0f19] text-white">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 📊 CALCULATIONS
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter(
    (p) => p.quantity <= p.low_stock_threshold
  );
  const totalValue = products.reduce(
    (sum, p) => sum + p.quantity * p.selling_price,
    0
  );

  return (
    <div className="space-y-5 pb-20 bg-gray-100 min-h-screen text-white">

      {/* HEADER */}
      <PageHeader
        logo="/logo-only.png"
        title="SmartStock"
        subtitle="Scan. Track. Manage — Smarter."
      />
      {/* ALERT */}
      <AlertBanner
        lowStockCount={lowStockItems.length}
        expiringCount={2}
      />

      {/* STATS */}
      <div className="px-5 grid grid-cols-2 gap-3">
        <StatsCard icon={Package} label="Total Products" value={totalProducts} />
        <StatsCard icon={ShoppingCart} label="Total Stock" value={totalStock} color="blue"/>
        <StatsCard icon={AlertTriangle} label="Low Stock" value={lowStockItems.length} color="accent"/>
        <StatsCard icon={TrendingUp} label="Stock Value" value={`₱${totalValue}`} color="destructive"/>
      </div>

      {/* CATEGORY CHART (still frontend data) */}
      <div className="px-5">
        <CategoryChart products={products} />
      </div>

      {/* RECENT MOVEMENTS */}
      <RecentMovements movements={movements} />

    </div>
  );
}