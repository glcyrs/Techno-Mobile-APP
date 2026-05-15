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
const outStockItems = products.filter(
  (p) => Number(p.quantity) === 0
);

const lowStockItems = products.filter((p) => {
  const qty = parseFloat(p.quantity ?? 0);
  const threshold = parseFloat(p.low_stock_threshold ?? 5);

  return qty > 0 && qty <= threshold;
});

  // EXPIRING SOON (REAL if may expiration_date)
const now = new Date();
const sevenDays = new Date();
sevenDays.setDate(now.getDate() + 7);

const thirtyDays = new Date();
thirtyDays.setDate(now.getDate() + 30);

const expiredItems = products.filter((p) => {
  if (!p.expiration_date) return false;

  const exp = new Date(p.expiration_date);
  if (isNaN(exp)) return false;

  return exp < now;
});

const expiringSoonItems = products.filter((p) => {
  if (!p.expiration_date) return false;

  const exp = new Date(p.expiration_date);
  if (isNaN(exp)) return false;

  return exp >= now && exp <= sevenDays;
});

const expiringLaterItems = products.filter((p) => {
  if (!p.expiration_date) return false;

  const exp = new Date(p.expiration_date);
  if (isNaN(exp)) return false;

  return exp > sevenDays && exp <= thirtyDays;
});

  const lowStockCount = lowStockItems.length + outStockItems.length;

const expiringCount =
  expiredItems.length +
  expiringSoonItems.length +
  expiringLaterItems.length;

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
              Stock Alerts
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
              Expiry Alerts
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