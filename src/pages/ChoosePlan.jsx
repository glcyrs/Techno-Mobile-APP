import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ChoosePlan() {
  const navigate = useNavigate();
  const [planChoice, setPlanChoice] = useState("trial");

  // 🔥 GUARD
  useEffect(() => {
  const user = localStorage.getItem("currentUser");

  if (!user) {
    navigate("/login");
  }
}, []);

  const handleContinue = () => {
  const user = localStorage.getItem("currentUser");

  if (!user) {
    navigate("/login");
    return;
  }

  const today = new Date();
  const expiry = new Date();
  expiry.setMonth(today.getMonth() + 1);

  const subscription = {
    plan: planChoice === "trial" ? "Free Trial" : "Premium",
    status: "Active",
    paymentMethod: planChoice === "trial" ? "N/A (Trial)" : "GCash",
    startDate: today.toISOString(),
    expiryDate: expiry.toISOString(),
    isTrial: planChoice === "trial",
  };

  try {
    localStorage.setItem("subscription", JSON.stringify(subscription));
  } catch (e) {
    console.error("Subscription save failed", e);
    return;
  }

  navigate("/dashboard");
};

  const baseCard =
    "border rounded-2xl p-5 cursor-pointer transition-all duration-200";

  const selected =
    "border-blue-600 shadow-lg bg-blue-50 scale-[1.02]";
  const unselected =
    "border-gray-200 hover:border-blue-300";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-6">

      {/* LOGO */}
      <div className="text-center mb-6">
        <img src="/logo1.png" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-blue-800">
          SmartStock
        </h1>
        <p className="text-sm text-gray-500">
          Choose your subscription plan
        </p>
      </div>

      {/* PLANS */}
      <div className="w-full max-w-md space-y-4">

        {/* FREE TRIAL */}
        <div
          onClick={() => setPlanChoice("trial")}
          className={`${baseCard} ${
            planChoice === "trial" ? selected : unselected
          }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Free Trial</h2>
            <span className="text-green-600 text-sm font-medium">
              Free
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Perfect for testing the system for 1 month
          </p>

          <ul className="text-sm space-y-1 text-gray-600">
            <li>✔ Full system access</li>
            <li>✔ Inventory management</li>
            <li>✔ QR scanning feature</li>
            <li>✔ 30 days validity</li>
            <li>✔ No payment required</li>
          </ul>
        </div>

        {/* PREMIUM */}
        <div
          onClick={() => setPlanChoice("premium")}
          className={`${baseCard} ${
            planChoice === "premium" ? selected : unselected
          }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Premium</h2>
            <span className="text-blue-600 text-sm font-medium">
              ₱199/month
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Unlimited and continuous access to the system
          </p>

          <ul className="text-sm space-y-1 text-gray-600">
            <li>✔ Everything in Free Trial</li>
            <li>✔ Continuous system access</li>
            <li>✔ Unlimited inventory usage</li>
            <li>✔ Real-time QR tracking</li>
            <li>✔ Admin dashboard tools</li>
          </ul>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white py-3 rounded-xl font-medium"
        >
          Continue to Dashboard
        </button>

      </div>
    </div>
  );
}