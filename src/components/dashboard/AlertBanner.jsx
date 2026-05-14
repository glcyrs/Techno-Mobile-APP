import { Link } from "react-router-dom";
import { AlertTriangle, Clock, ChevronRight } from "lucide-react";

export default function AlertBanner({ products = [] }) {
  console.log("ALL PRODUCTS:", products);
  console.log(
    "EXPIRATION FIELD:",
    products.map(p => ({
      name: p.name,
      expiration_date: p.expiration_date
    }))
  );
 
 
  // LOW STOCK COUNT (REAL)
  const lowStockItems = products.filter(
    (p) => Number(p.quantity) <= Number(p.low_stock_threshold || 0)
  );

  // EXPIRING SOON (REAL if may expiration_date ka)
 const expiringItems = products.filter((p) => {
  if (!p.isPerishable) return false;
  if (!p.expiration_date) return false;

  const today = new Date();
  const expDate = new Date(p.expiration_date);

  // REMOVE TIME (important fix)
  today.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);

  const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= 7;
});

  const lowStockCount = lowStockItems.length;
  const expiringCount = expiringItems.length;

  if (lowStockCount === 0 && expiringCount === 0) return null;

  return (
    <div className="px-5 space-y-2">

      {/* LOW STOCK */}
      {lowStockCount > 0 && (
        <Link
          to="/alerts?tab=low-stock"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3"
        >
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              Low Stock Alert
            </p>
            <p className="text-xs text-amber-600">
              {lowStockCount} item{lowStockCount > 1 ? "s" : ""} need restocking
            </p>
          </div>

          <ChevronRight className="h-4 w-4 text-amber-400" />
        </Link>
      )}

      {/* EXPIRING */}
      {expiringCount > 0 && (
        <Link
          to="/alerts?tab=expiring"
          className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3"
        >
          <div className="p-1.5 bg-red-100 rounded-lg">
            <Clock className="h-4 w-4 text-red-600" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              Expiring Soon
            </p>
            <p className="text-xs text-red-600">
              {expiringCount} item{expiringCount > 1 ? "s" : ""} are near or about to expire
            </p>
          </div>

          <ChevronRight className="h-4 w-4 text-red-400" />
        </Link>
      )}
    </div>
  );
}