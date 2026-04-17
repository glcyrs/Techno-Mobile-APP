import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [lowStockDefault, setLowStockDefault] = useState(5);
  const [currency, setCurrency] = useState("PHP");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);

    localStorage.setItem(
      "settings",
      JSON.stringify({
        lowStockDefault,
        currency,
      })
    );

    setTimeout(() => {
      setSaving(false);
      alert("Settings saved!");
    }, 500);
  };

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

        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500">
            App preferences & defaults
          </p>
        </div>

      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-5">

        {/* LOW STOCK */}
        <div>
          <p className="text-sm font-medium mb-1">
            Low Stock Threshold
          </p>

          <input
            type="number"
            value={lowStockDefault}
            onChange={(e) => setLowStockDefault(e.target.value)}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Alert when stock falls below this number
          </p>
        </div>

        {/* CURRENCY */}
        <div>
          <p className="text-sm font-medium mb-1">Currency</p>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="PHP">PHP (₱)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>

      </div>

      {/* ABOUT */}
      <div className="bg-white border rounded-2xl shadow-sm p-5">
        <p className="font-semibold text-sm">About</p>
        <p className="text-sm text-gray-600 mt-1">SmartStock v1.0</p>
        <p className="text-xs text-gray-400">
          Scan. Track. Manage — Smarter system.
        </p>
      </div>

    </div>
  );
}