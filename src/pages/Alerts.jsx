import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Package } from "lucide-react";
import { addDays, isAfter, isBefore } from "date-fns";
import { useSearchParams } from "react-router-dom";

export default function Alerts() {
  const [searchParams] = useSearchParams();

const [tab, setTab] = useState(
  searchParams.get("tab") || "low-stock"
);

useEffect(() => {
  const tabFromUrl = searchParams.get("tab");
  if (tabFromUrl) {
    setTab(tabFromUrl);
  }
}, [searchParams]);

  const [products, setProducts] = useState([]);

  useEffect(() => {
  const loadProducts = () => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  };

  loadProducts(); // initial load

  const handleUpdate = () => {
    loadProducts();
  };

  window.addEventListener("productsUpdated", handleUpdate);

  return () => {
    window.removeEventListener("productsUpdated", handleUpdate);
  };
}, []);

  const now = new Date();
  const sevenDays = addDays(now, 7);
  const thirtyDays = addDays(now, 30);

  // STOCK LOGIC
  const lowStock = products.filter(p => p.quantity <= p.low_stock_threshold && p.quantity > 0);
  const outStock = products.filter(p => p.quantity === 0);

  // EXPIRY LOGIC
  const expiringSoon = products.filter(p => {
  if (!p.expiration_date) return false;

  const exp = new Date(p.expiration_date);
  if (isNaN(exp)) return false;

  return isAfter(exp, now) && isBefore(exp, sevenDays);
});

 const expiringLater = products.filter(p => {
  if (!p.expiration_date) return false;

  const exp = new Date(p.expiration_date);
  if (isNaN(exp)) return false;

  return isAfter(exp, sevenDays) && isBefore(exp, thirtyDays);
});

  const expired = products.filter(p => {
  if (!p.expiration_date) return false;

  const exp = new Date(p.expiration_date);
  if (isNaN(exp)) return false;

  return isBefore(exp, now);
});

  const tabs = [
    { id: "low-stock", label: "Low Stock", count: lowStock.length + outStock.length },
    { id: "expiring", label: "Expiring", count: expiringSoon.length + expiringLater.length + expired.length },
  ];

  return (
    <div className="p-5 space-y-3 text-gray-900">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-sm text-gray-500">
          Monitor low stock and expiry alerts
        </p>
      </div>

      {/* TABS */}
      <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-sm rounded-lg transition ${
              tab === t.id
                ? "bg-gradient-to-r from-blue-500 to-blue-900 text-white"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            {t.label}

            {t.count > 0 && (
              <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-3">
        {tab === "low-stock" ? (
          <>
          <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                  <Package className="h-3 w-3" /> Out of Stock ({outStock.length})
                </p>
            {outStock.map(p => (
              <Card
                key={p.id}
                icon={<Package className="w-4 h-4" />}
                color="red"
                product={p}
                text="Out of Stock"
              />
            ))}
          <p className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Low Stock ({lowStock.length})
                </p>
            {lowStock.map(p => (
              <Card
                key={p.id}
                icon={<AlertTriangle className="w-4 h-4" />}
                color="yellow"
                product={p}
                text="Low Stock"
              />
            ))}

            {outStock.length === 0 && lowStock.length === 0 && (
              <Empty text="All stock is healthy" />
            )}
          </>
        ) : (
          <>
          <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Expired ({expired.length})
                </p>
            {expired.map(p => (
              <Card
                key={p.id}
                icon={<Clock className="w-4 h-4" />}
                color="red"
                product={p}
                text="Expired"
              />
            ))}

             <p className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Expiring within 7 days ({expiringSoon.length})
                </p>
            {expiringSoon.map(p => (
              <Card
                key={p.id}
                icon={<Clock className="w-4 h-4" />}
                color="yellow"
                product={p}
                text="Expiring Soon"
              />
            ))}

            <p className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Expiring within 30 days ({expiringLater.length})
                </p>
            {expiringLater.map(p => (
              <Card
                key={p.id}
                icon={<Clock className="w-4 h-4" />}
                color="blue"
                product={p}
                text="Expiring Later"
              />
            ))}

            {expired.length === 0 &&
              expiringSoon.length === 0 &&
              expiringLater.length === 0 && (
              <Empty text="No expiry alerts" />
            )}
          </>
        )}

      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */
function Card({ icon, product, text, color }) {
  const colors = {
    red: {
      border: "border-red-300",
      iconBg: "bg-red-50",
      text: "text-red-600",
    },
    yellow: {
      border: "border-yellow-300",
      iconBg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    blue: {
      border: "border-blue-300",
      iconBg: "bg-blue-50",
      text: "text-blue-600",
    },
  };

  const c = colors[color] || colors.red;

  return (
    <div className={`flex items-center justify-between bg-white border rounded-xl p-3 ${c.border}`}>

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${c.iconBg} ${c.text}`}>
          {icon}
        </div>

        <div>
          <p className="font-medium text-sm text-gray-800">
            {product.name}
          </p>
          <p className="text-xs text-gray-500">
            {product.category}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <p className={`text-sm font-bold ${c.text}`}>
          {text}
        </p>
        <p className="text-xs text-gray-500">
          {product.quantity} {product.unit}
        </p>
      </div>

    </div>
  );
}

/* ---------------- EMPTY ---------------- */
function Empty({ text }) {
  return (
    <div className="text-center py-10 text-gray-500">
      {text}
    </div>
  );
}