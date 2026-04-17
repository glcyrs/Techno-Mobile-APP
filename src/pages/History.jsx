import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Undo2,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import moment from "moment";

const typeConfig = {
  stock_in: { icon: ArrowDownLeft, color: "text-green-600 bg-green-50", label: "Stock In" },
  stock_out: { icon: ArrowUpRight, color: "text-red-500 bg-red-50", label: "Removed" },
  sold: { icon: ShoppingCart, color: "text-blue-600 bg-blue-50", label: "Sold" },
  adjustment: { icon: RefreshCw, color: "text-indigo-600 bg-indigo-50", label: "Adjusted" },
  return: { icon: Undo2, color: "text-purple-600 bg-purple-50", label: "Return" },
};

export default function History() {
  const navigate = useNavigate();

  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        type: "stock_in",
        product_name: "Coca Cola",
        quantity: 20,
        method: "qr_scan",
        created_date: new Date(),
        previous_quantity: 0,
        new_quantity: 20,
      },
      {
        id: 2,
        type: "sold",
        product_name: "Rice 5kg",
        quantity: 2,
        method: "manual",
        created_date: new Date(),
        previous_quantity: 10,
        new_quantity: 8,
      },
      {
        id: 3,
        type: "adjustment",
        product_name: "Soap",
        quantity: 5,
        method: "manual",
        created_date: new Date(),
        previous_quantity: 15,
        new_quantity: 20,
      },
    ];

    setMovements(mockData);
    setLoading(false);
  }, []);

  const filtered =
    filterType === "all"
      ? movements
      : movements.filter((m) => m.type === filterType);

  const filterLabels = {
    all: "All",
    stock_in: "Stock In",
    stock_out: "Stock Out",
    sold: "Sold",
    adjustment: "Adjustment",
    return: "Return",
  };

  const grouped = filtered.reduce((acc, m) => {
    const date = moment(m.created_date).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-4 text-gray-900 p-4">

      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-xl bg-white border hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-sm text-gray-500">Stock movement logs</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "stock_in", "stock_out", "sold", "adjustment", "return"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              filterType === t
                ? "bg-gradient-to-r from-blue-500 to-blue-900 text-white"
                : "bg-white text-gray-900 border"
            }`}
          >
            {filterLabels[t]}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-700 py-10">
            No movements yet
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-sm text-gray-500 mb-2">
                {moment(date).format("MMM D, YYYY")}
              </p>

              <div className="bg-white rounded-xl divide-y border">
                {items.map((m) => {
                  const config = typeConfig[m.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {m.product_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {config.label} •{" "}
                            {m.method === "qr_scan" ? "QR Scan" : "Manual"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            m.type === "stock_in" || m.type === "return"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {m.type === "stock_in" || m.type === "return"
                            ? "+"
                            : "-"}
                          {m.quantity}
                        </p>

                        <p className="text-[12px] text-gray-400">
                          {m.previous_quantity} → {m.new_quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}