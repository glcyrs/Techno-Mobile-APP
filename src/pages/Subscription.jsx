import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Subscription() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);

  const [renewMode, setRenewMode] = useState(null);
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("GCash");

  useEffect(() => {
    const sub = JSON.parse(localStorage.getItem("subscription"));
    if (sub) setSubscription(sub);
  }, [showModal]);

   const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No subscription found</p>
      </div>
    );
  }

  const isTrial = subscription.isTrial;

  // ✅ FIXED RENEW LOGIC (WITH START + EXPIRY DATE)
  const handleFinalRenew = () => {
    const today = new Date();
    const expiry = new Date();
    expiry.setMonth(today.getMonth() + selectedMonths);

    const updated = {
      plan: renewMode === "trial" ? "Premium" : subscription.plan,
      isTrial: false,
      status: "Active",
      paymentMethod,

      // 🔥 START & EXPIRY DATE ADDED
      startDate: today.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
    };

    localStorage.setItem("subscription", JSON.stringify(updated));
    setSubscription({ ...updated });

    setShowModal(false);
    setStep(0);
    setRenewMode(null);

    alert("Subscription successfully renewed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-5 text-gray-800">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Subscription</h1>
          <p className="text-sm text-gray-500">Manage your plan and billing</p>
        </div>

        <Button variant="outline" onClick={() => navigate("/profile")}>
          Back
        </Button>
      </div>

      {/* CURRENT PLAN */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <p className="font-semibold text-lg">{subscription.plan}</p>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              subscription.status === "Active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {subscription.status}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          {isTrial
            ? "You are using a free trial with limited features."
            : "You have full system access with premium features."}
        </p>

        {/* 🔥 START & EXPIRY DISPLAY */}
        <div className="grid grid-cols-2 gap-3 text-sm mt-3">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-500 text-xs">Start Date</p>
            <p className="font-medium">{formatDate(subscription.startDate)}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <p className="text-gray-500 text-xs">Expiry Date</p>
            <p className="font-medium">{formatDate(subscription.expiryDate)}</p>
          </div>
        </div>
      </div>

      {/* BILLING */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-blue-600" />
          <p className="font-semibold text-sm">Billing</p>
        </div>

        <p className="text-sm text-gray-600">
          Payment Method:{" "}
          <span className="font-medium">{subscription.paymentMethod}</span>
        </p>

        <p className="text-sm text-gray-600">
          Price:{" "}
          <span className="font-medium">
            {isTrial ? "₱0 (Trial)" : "₱199 / month"}
          </span>
        </p>
      </div>

      {/* FEATURES */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3">
        <p className="font-semibold text-sm">Plan Features</p>

        {isTrial ? (
          <ul className="text-sm space-y-1 text-gray-600">
            <li>✔ Basic inventory access</li>
            <li>✔ Limited dashboard features</li>
            <li>✔ Basic reports</li>
            <li>✔ Analytics</li>
          </ul>
        ) : (
          <ul className="text-sm space-y-1 text-gray-600">
            <li>✔ Full system access</li>
            <li>✔ Real-time analytics</li>
            <li>✔ Unlimited inventory</li>
          </ul>
        )}
      </div>

      {/* RENEW BUTTON */}
      <Button
        onClick={() => {
          setShowModal(true);

          if (subscription.isTrial) {
            setRenewMode("trial");
            setStep(1);
          } else {
            setRenewMode("premium");
            setStep(2);
          }
        }}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-800"
      >
        <RefreshCcw className="text-white w-4 h-4 mr-2" />
        <span className="text-white">Renew Subscription</span>
      </Button>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-md p-5 rounded-xl space-y-4">

            {/* STEP 1 - TRIAL: Choose Plan */}
            {step === 1 && renewMode === "trial" && (
              <>
                <h2 className="font-bold">Choose Premium Plan</h2>

<p className="text-sm text-gray-600 mb-3">
  You are upgrading from Free Trial to Premium. This will unlock all features
  including full inventory access, analytics, and priority support.
</p>

<div className="border rounded p-3 bg-gray-50 mb-3">
  <p className="font-semibold text-blue-600">Premium Plan</p>
  <p className="text-sm text-gray-600">
    ₱199/month — Full access to all system features
  </p>
</div>

<button
  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded"
  onClick={() => setStep(2)}
>
  Proceed to Subscription Setup
</button>
              </>
            )}

            {/* STEP 2 - Choose Months */}
{step === 2 && (
  <>
    <h2 className="font-bold">Choose Duration</h2>

    <p className="text-sm text-gray-600 mb-3">
      Select how long you want to subscribe. Longer plans give you uninterrupted access to all premium features.
    </p>

    <select
      className="w-full border p-2 rounded mb-3"
      value={selectedMonths}
      onChange={(e) => setSelectedMonths(Number(e.target.value))}
    >
      <option value={1}>1 Month</option>
      <option value={3}>3 Months</option>
      <option value={6}>6 Months</option>
      <option value={12}>12 Months</option>
    </select>

    {/* DURATION INFO BOX */}
    <div className="bg-gray-50 border rounded p-3 text-sm text-gray-600 space-y-1">
      {selectedMonths === 1 && (
        <p>
         <b>1 Month Plan:</b> Best for short-term use or testing the system.
        </p>
      )}

      {selectedMonths === 3 && (
        <p>
         <b>3 Months Plan:</b> Recommended for small business usage with stable access.
        </p>
      )}

      {selectedMonths === 6 && (
        <p>
         <b>6 Months Plan:</b> More cost-efficient option with long-term usage benefits.
        </p>
      )}

      {selectedMonths === 12 && (
        <p>
         <b>12 Months Plan:</b> Best value. Full year access with maximum savings.
        </p>
      )}
    </div>

    <button
      className="w-full bg-blue-600 text-white p-2 rounded mt-3"
      onClick={() => setStep(3)}
    >
      Next
    </button>
  </>
)}

           {/* STEP 3 - Billing */}
{step === 3 && (
  <>
    <h2 className="font-bold">Billing Summary</h2>

    <p className="text-sm text-gray-600 mb-3">
      Please review your subscription details before proceeding to payment.
      This is a summary of your selected plan and duration.
    </p>

    <div className="bg-gray-50 border rounded p-3 space-y-2 text-sm">
      <p>
        <span className="font-medium">Plan:</span> {subscription.plan}
      </p>

      <p>
        <span className="font-medium">Duration:</span> {selectedMonths} month/s
      </p>

      <p>
        <span className="font-medium">Monthly Rate:</span> ₱199
      </p>

      <p className="text-green-600 font-semibold">
        Total Amount: ₱{selectedMonths * 199}
      </p>
    </div>

    <div className="text-xs text-gray-500 mt-3 space-y-1">
      <p>✔ Billing is processed securely</p>
      <p>✔ Subscription will activate immediately after payment</p>
      <p>✔ You can cancel anytime from your account settings</p>
    </div>

    <button
      className="w-full bg-blue-600 text-white p-2 rounded mt-3"
      onClick={() => setStep(4)}
    >
      Proceed to Payment
    </button>
  </>
)}

            {/* STEP 4 - Payment */}
{step === 4 && (
  <>
    <h2 className="font-bold">Payment Method</h2>

    <p className="text-sm text-gray-600 mb-3">
      Choose your preferred payment method. All transactions are securely processed and encrypted.
    </p>

    <div className="bg-gray-50 border rounded p-3 text-sm text-gray-600 mb-3 space-y-1">
      <p>✔ Secure payment gateway</p>
      <p>✔ Instant subscription activation after payment</p>
      <p>✔ Supports multiple payment options</p>
    </div>

    <select
      className="w-full border p-2 rounded mb-3"
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
    >
      <option>GCash</option>
      <option>PayMaya</option>
      <option>Credit Card</option>
    </select>

    {/* Payment preview */}
    <div className="bg-white border rounded p-3 text-sm mb-3">
      <p className="font-medium">Payment Summary</p>
      <p>Method: {paymentMethod}</p>
      <p className="text-green-600 font-semibold">
        Total: ₱{selectedMonths * 199}
      </p>
    </div>

    <button
      className="w-full bg-green-600 text-white p-2 rounded"
      onClick={handleFinalRenew}
    >
      Pay & Renew
    </button>
  </>
)}

            {/* CLOSE */}
            <button
              className="w-full text-sm text-gray-500"
              onClick={() => {
                setShowModal(false);
                setStep(0);
                setRenewMode(null);
              }}
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}