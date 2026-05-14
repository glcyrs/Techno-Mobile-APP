import { useState, useEffect } from "react";
import { getUser, logout } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Settings,
  BarChart3,
  LogOut,
  History,
  CreditCard,
} from "lucide-react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const navigate = useNavigate();

  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const sub = JSON.parse(localStorage.getItem("subscription"));

    if (sub) {
      const today = new Date();
      const expiry = new Date(sub.expiryDate);

      if (expiry < today) {
        sub.status = "Expired";
        localStorage.setItem("subscription", JSON.stringify(sub));
      }

      setSubscription(sub);
    }
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-5">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-sm text-gray-500">Account overview</p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">

        {/* HEADER ROW */}
        <div className="flex items-start justify-between">

          {/* LEFT: USER */}
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {initials}
            </div>

            <div>
              <p className="text-lg font-semibold">
                 {user?.name || "Unknown User"}
              </p>

              <p className="text-sm text-gray-500">
                 {user?.email || "No email"}
              </p>
            </div>

          </div>

          {/* RIGHT: ADMIN BADGE (MOVED HERE) */}
          <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            <Shield className="h-3 w-3" />
            Admin
          </div>

        </div>

        {/* SUBSCRIPTION CARD (IMPROVED LAYOUT) */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">

          {/* HEADER */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <p className="font-semibold text-sm">Subscription</p>
            </div>

            {subscription && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  subscription.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {subscription.status}
              </span>
            )}

          </div>

          {/* GRID INFO */}
          {subscription ? (
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

              <div>
                <p className="text-xs text-gray-400">Plan</p>
                <p className="font-medium text-blue-600">
                  {subscription.plan}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Payment</p>
                <p className="font-medium">
                  {subscription.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Start</p>
                <p className="font-medium">
                  {formatDate(subscription.startDate)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Expires</p>
                <p className="font-medium">
                  {formatDate(subscription.expiryDate)}
                </p>
              </div>

            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No subscription found
            </p>
          )}

          {/* FOOT NOTE */}
          {subscription && (
            <p className="text-xs text-gray-400 pt-2">
              {subscription.isTrial
                ? "Free Trial Access (Limited Features)"
                : "Premium Access (Full System Enabled)"}
            </p>
          )}

        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <Link className="flex items-center gap-3 p-4 border-b hover:bg-gray-50" to="/subscription">
          <CreditCard className="h-4 w-4 text-blue-600" />
          Subscription
        </Link>

        <Link className="flex items-center gap-3 p-4 border-b hover:bg-gray-50" to="/settings">
          <Settings className="h-4 w-4 text-gray-600" />
          Settings
        </Link>

        <Link className="flex items-center gap-3 p-4 border-b hover:bg-gray-50" to="/statistics">
          <BarChart3 className="h-4 w-4 text-gray-600" />
          Statistics
        </Link>

        <Link className="flex items-center gap-3 p-4 hover:bg-gray-50" to="/history">
          <History className="h-4 w-4 text-gray-600" />
          History
        </Link>

      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="w-full bg-red-500 text-white p-3 rounded-xl font-medium flex items-center justify-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

    </div>
  );
}