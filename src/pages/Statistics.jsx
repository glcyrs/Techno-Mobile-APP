import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package,
  ArrowLeft
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { format, subDays, startOfDay, isAfter } from "date-fns";

export default function Statistics() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");

  useEffect(() => {
  const load = () => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const storedMovements = JSON.parse(localStorage.getItem("movements") || "[]");

    const fixedMovements = storedMovements
      .map((m) => ({
        ...m,
        timestamp: Number(m.timestamp),
      }))
      .filter((m) => !isNaN(m.timestamp));

    setProducts(storedProducts);
    setMovements(fixedMovements);
    setLoading(false);
  };

  load();

  const handleUpdate = () => load();

  window.addEventListener("productsUpdated", handleUpdate);
  window.addEventListener("movementsUpdated", handleUpdate);

  return () => {
    window.removeEventListener("productsUpdated", handleUpdate);
    window.removeEventListener("movementsUpdated", handleUpdate);
  };
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const days = parseInt(range);
  const cutoff = startOfDay(subDays(new Date(), days));

  //  use timestamp (NOT created_date)
const cleanMovements = movements
  .map((m) => ({
    ...m,
    timestamp: Number(m.timestamp),
    quantity: Number(m.quantity || 0),
    product_id: String(m.product_id),
  }))
  .filter((m) =>
    m.timestamp &&
    !isNaN(m.timestamp) &&
    m.type &&
    (m.type === "sold" || m.type === "stock_in")
  );

const filteredMovements = cleanMovements.filter((m) => {
  return m.timestamp >= cutoff.getTime();
});

  const salesMovements = filteredMovements.filter((m) => m.type === "sold");
  const stockInMovements = filteredMovements.filter((m) => m.type === "stock_in");

  //  Revenue
  const totalRevenue = salesMovements.reduce((sum, m) => {
 const prod = products.find((p) => String(p.id) === String(m.product_id));
  return sum + (m.quantity || 0) * (prod?.selling_price || 0);
}, 0);

  // Cost
 const totalCOGS = salesMovements.reduce((sum, m) => {
  const prod = products.find((p) => String(p.id) === String(m.product_id));
  return sum + (m.quantity || 0) * (prod?.cost_price || 0);
}, 0);

const grossProfit = totalRevenue - totalCOGS;

  const totalUnitsSold = salesMovements.reduce(
    (s, m) => s + (m.quantity || 0),
    0
  );

  const totalStockIn = stockInMovements.reduce(
    (s, m) => s + (m.quantity || 0),
    0
  );

  console.log("cutoff:", cutoff);
console.log("movement dates:", movements.map(m => new Date(m.timestamp)));

  // 📊 DAILY DATA
  const dailyMap = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "MMM d");
    dailyMap[d] = { date: d, revenue: 0, profit: 0 };
  }

  salesMovements.forEach((m) => {
    const prod = products.find((p) => String(p.id) === String(m.product_id));
    const dateObj = new Date(m.timestamp);
if (isNaN(dateObj)) return;

const d = format(dateObj, "MMM d");

    if (dailyMap[d]) {
      const rev = (m.quantity || 0) * (prod?.selling_price || 0);
      const cost = (m.quantity || 0) * (prod?.cost_price || 0);

      dailyMap[d].revenue += rev;
      dailyMap[d].profit += rev - cost;
    }
  });

  const dailyData = Object.values(dailyMap);

  // 🏆 TOP PRODUCTS
  const productSales = {};

  salesMovements.forEach((m) => {
    const key = String(m.product_id);

    if (!productSales[key]) {
      productSales[key] = {
        name: m.product_name,
        qty: 0,
        revenue: 0,
      };
    }

    const prod = products.find((p) => String(p.id) === key);

    productSales[key].qty += m.quantity || 0;
    productSales[key].revenue +=
      (m.quantity || 0) * (prod?.selling_price || 0);
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const fmt = (n) =>
    `₱${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-5 text-gray-800">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-xl bg-white border shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <h1 className="text-xl font-bold">Statistics</h1>
          <p className="text-sm text-gray-500">
            Revenue & Performance Overview
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded-xl p-2 text-sm bg-white"
        >
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="90">90 Days</option>
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Revenue" value={fmt(totalRevenue)} icon={DollarSign} />
        <StatCard
          label="Profit"
          value={fmt(grossProfit)}
          icon={grossProfit >= 0 ? TrendingUp : TrendingDown}
        />
        <StatCard label="Units Sold" value={totalUnitsSold} icon={ShoppingCart} />
        <StatCard label="Stock In" value={totalStockIn} icon={Package} />
      </div>

      {/* LINE CHART */}
      <div className="bg-white border rounded-2xl p-4">
        <p className="text-sm font-semibold mb-3">Revenue vs Profit</p>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
            <Line dataKey="profit" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR CHART */}
      <div className="bg-white border rounded-2xl p-4">
        <p className="text-sm font-semibold mb-3">Top Products</p>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={topProducts} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={90} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PNL */}
      <div className="bg-white border rounded-2xl p-4 space-y-2">
        <p className="text-sm font-semibold">Profit & Loss</p>

        <Row label="Revenue" value={fmt(totalRevenue)} />
        <Row label="Cost of Goods Sold" value={`-${fmt(totalCOGS)}`} />
        <Row label="Profit" value={fmt(grossProfit)} bold />
      </div>

    </div>
  );
}

/* COMPONENTS */
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className={bold ? "font-semibold" : "text-gray-500"}>
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}