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
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  // ======================
  // PRODUCTS (INVENTORY)
  // ======================
  useEffect(() => {
    const loadProducts = () => {
      const stored = JSON.parse(localStorage.getItem("products")) || [];
      setProducts(stored);
      setLoading(false);
    };

    loadProducts();

    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener("productsUpdated", loadProducts);
    };
  }, []);

  // ======================
  // MOVEMENTS (FIXED)
  // ======================
  useEffect(() => {
  const loadMovements = () => {
    const logs = JSON.parse(localStorage.getItem("movements")) || [];
    setMovements(logs);
  };

  loadMovements();

  window.addEventListener("movementsUpdated", loadMovements);
  window.addEventListener("storage", loadMovements);

  return () => {
    window.removeEventListener("movementsUpdated", loadMovements);
    window.removeEventListener("storage", loadMovements);
  };
}, []);

  // ======================
  // LOADING SCREEN
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0b0f19] text-white">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ======================
  // CALCULATIONS
  // ======================
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0),
    0
  );

  const lowStockItems = products.filter(
    (p) => p.quantity <= p.low_stock_threshold
  );

  const totalValue = products.reduce(
    (sum, p) =>
      sum + (Number(p.quantity) || 0) * (Number(p.selling_price) || 0),
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
      <AlertBanner products={products} />

      {/* STATS */}
      <div className="px-5 grid grid-cols-2 gap-3">
        <StatsCard icon={Package} label="Total Products" value={totalProducts} />
        <StatsCard icon={ShoppingCart} label="Total Stock" value={totalStock} color="blue"/>
        <StatsCard icon={AlertTriangle} label="Low Stock" value={lowStockItems.length} color="accent"/>
        <StatsCard icon={TrendingUp} label="Stock Value" value={`₱${totalValue}`} color="destructive"/>
      </div>

      {/* CATEGORY CHART */}
      <div className="px-5">
        <CategoryChart products={products} />
      </div>

      {/* RECENT MOVEMENTS */}
      <RecentMovements movements={movements.slice(0, 10)} />
    </div>
  );
}