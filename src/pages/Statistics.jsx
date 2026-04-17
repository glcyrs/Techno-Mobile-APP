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
    async function load() {
      const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const storedMovements = JSON.parse(localStorage.getItem("movements") || "[]");

      setProducts(storedProducts);
      setMovements(storedMovements);
      setLoading(false);
    }
    load();
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

  const filteredMovements = movements.filter(
    (m) => m.created_date && isAfter(new Date(m.created_date), cutoff)
  );

  const salesMovements = filteredMovements.filter((m) => m.type === "sold");
  const stockInMovements = filteredMovements.filter((m) => m.type === "stock_in");

  const totalRevenue = salesMovements.reduce((sum, m) => {
    const prod = products.find((p) => p.id === m.product_id);
    return sum + (m.quantity || 0) * (prod?.selling_price || 0);
  }, 0);

  const totalCOGS = salesMovements.reduce((sum, m) => {
    const prod = products.find((p) => p.id === m.product_id);
    return sum + (m.quantity || 0) * (prod?.cost_price || 0);
  }, 0);

  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = totalRevenue
    ? ((grossProfit / totalRevenue) * 100).toFixed(1)
    : 0;

  const totalUnitsSold = salesMovements.reduce((s, m) => s + (m.quantity || 0), 0);
  const totalStockIn = stockInMovements.reduce((s, m) => s + (m.quantity || 0), 0);

  const dailyMap = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "MMM d");
    dailyMap[d] = { date: d, revenue: 0, profit: 0 };
  }

  salesMovements.forEach((m) => {
    const prod = products.find((p) => p.id === m.product_id);
    const d = format(new Date(m.created_date), "MMM d");

    if (dailyMap[d]) {
      const rev = (m.quantity || 0) * (prod?.selling_price || 0);
      const cost = (m.quantity || 0) * (prod?.cost_price || 0);

      dailyMap[d].revenue += rev;
      dailyMap[d].profit += rev - cost;
    }
  });

  const dailyData = Object.values(dailyMap).slice(-14);

  const productSales = {};

  salesMovements.forEach((m) => {
    if (!productSales[m.product_id]) {
      productSales[m.product_id] = {
        name: m.product_name,
        qty: 0,
        revenue: 0,
      };
    }

    const prod = products.find((p) => p.id === m.product_id);

    productSales[m.product_id].qty += m.quantity || 0;
    productSales[m.product_id].revenue +=
      (m.quantity || 0) * (prod?.selling_price || 0);
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const fmt = (n) =>
    `₱${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-5 text-gray-800">

      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-xl bg-white border shadow-sm active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <h1 className="text-xl font-bold">Statistics</h1>
          <p className="text-sm text-gray-500">
            Revenue & Performance Overview
          </p>
        </div>

        {/* RANGE */}
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

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-3">

        <StatCard label="Revenue" value={fmt(totalRevenue)} icon={DollarSign} />

        <StatCard
          label="Profit"
          value={fmt(grossProfit)}
          icon={grossProfit >= 0 ? TrendingUp : TrendingDown}
          color={grossProfit >= 0 ? "text-green-600" : "text-red-500"}
          sub={`${grossMargin}% margin`}
        />

        <StatCard label="Units Sold" value={totalUnitsSold} icon={ShoppingCart} />
        <StatCard label="Stock In" value={totalStockIn} icon={Package} />
      </div>

      {/* CHARTS (unchanged) */}
      <div className="bg-white border rounded-2xl shadow-sm p-4">
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

      <div className="bg-white border rounded-2xl shadow-sm p-4">
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

      <div className="bg-white border rounded-2xl shadow-sm p-4 space-y-2">
        <p className="text-sm font-semibold">Profit & Loss</p>

        <Row label="Revenue" value={fmt(totalRevenue)} />
        <Row label="Cost of Goods Sold" value={`-${fmt(totalCOGS)}`} />
        <Row label="Profit" value={fmt(grossProfit)} bold />
      </div>

    </div>
  );
}

/* UI COMPONENTS */
function StatCard({ label, value, icon: Icon, color = "text-blue-600", sub }) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        {label}
      </div>
      <p className="text-lg font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
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