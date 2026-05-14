import { useState, useEffect } from "react";
import {
  Save,
  ArrowLeft,
  Settings as SettingsIcon,
  DollarSign,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [lowStockDefault, setLowStockDefault] = useState(5);
  const [currency, setCurrency] = useState("PHP");
  const [savingSettings, setSavingSettings] = useState(false);
  
  // 👤 USER STATE
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [savingAccount, setSavingAccount] = useState(false);

  const [showNotif, setShowNotif] = useState(false);

  // LOAD DATA
  useEffect(() => {
  const savedUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const savedSettings = JSON.parse(localStorage.getItem("settings"));

  if (savedUser) setUser(savedUser);

  if (savedSettings) {
    setLowStockDefault(savedSettings.lowStockDefault || 5);
    setCurrency(savedSettings.currency || "PHP");
  }
}, []);

  // SAVE SETTINGS
  const handleSaveSettings = () => {
    setSavingSettings(true);

    localStorage.setItem(
      "settings",
      JSON.stringify({
        lowStockDefault,
        currency,
      })
    );

    setTimeout(() => setSavingSettings(false), 500);
  };

  // SAVE ACCOUNT
  const handleSaveAccount = () => {
  setSavingAccount(true);
    setShowNotif(true);

    setTimeout(() => {
  setShowNotif(false);
}, 3000);

  const updatedUser = { ...user };

  // update currentUser
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  // ALSO UPDATE USERS ARRAY
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const updatedUsers = users.map((u) =>
    u.id === updatedUser.id ? updatedUser : u
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));

  setTimeout(() => setSavingAccount(false), 500);
};

  return (
    <>
    {/* NOTIFICATION */}
    {showNotif && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50">
        Account updated successfully!
      </div>
    )}

    <div className="min-h-screen bg-gray-50 p-4 space-y-5 text-gray-800">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-xl bg-white border shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500">
            App preferences & system configuration
          </p>
        </div>
      </div>

      {/* SYSTEM SETTINGS */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-5">

        <div className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4 text-blue-600" />
          <p className="font-semibold text-sm">System Settings</p>
        </div>

        {/* LOW STOCK */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <p className="text-sm font-medium">Low Stock Threshold</p>
          </div>

          <input
            type="number"
            value={lowStockDefault}
            onChange={(e) => setLowStockDefault(Number(e.target.value))}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* CURRENCY */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <p className="text-sm font-medium">Currency</p>
          </div>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-3 border rounded-xl"
          >
            <option value="PHP">PHP (₱)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* SAVE SETTINGS BUTTON */}
        <button
          onClick={handleSaveSettings}
          className="w-full bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {savingSettings ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* ACCOUNT INFO */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-4">

        <p className="font-semibold text-sm">Account</p>

        <p className="text-sm text-gray-500">
          Update your personal information
        </p>

        {/* NAME */}
        <input
          value={user.name || ""}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Current: Full Name"
          className="w-full p-3 border rounded-xl"
        />

        {/* EMAIL */}
        <input
          value={user.email || ""}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Current: Email"
          className="w-full p-3 border rounded-xl"
        />

        {/* PASSWORD */}
        <input
          value={user.password || ""}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          placeholder="New password"
          className="w-full p-3 border rounded-xl"
        />

        {/* SAVE ACCOUNT BUTTON */}
        <button
          onClick={handleSaveAccount}
          className="w-full bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {savingAccount ? "Updating..." : "Update Account"}
        </button>
      </div>

      {/* ABOUT */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-2">

        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-600" />
          <p className="font-semibold text-sm">About</p>
        </div>

        <p className="text-sm text-gray-600">SmartStock v1.0</p>
      </div>

    </div>
   </>
  );
}