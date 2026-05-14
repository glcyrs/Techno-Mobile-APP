import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = () => {
  setError("");

  if (!email || !password) {
    setError("Email and password are required");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
  (u) =>
    u.email.trim().toLowerCase() === email.trim().toLowerCase()
  );

  console.log("ALL USERS:", users);
  console.log("FOUND USER:", user);

  if (!user) {
    setError("No account found with this email");
    return;
  }

  if (user.password !== password) {
    setError("Incorrect password");
    return;
  }

  // SAVE SESSION
  localStorage.setItem("currentUser", JSON.stringify(user));

  console.log("CURRENT USER AFTER LOGIN:", localStorage.getItem("currentUser"));
 
  let subscription = null;

try {
  const raw = localStorage.getItem("subscription");
  subscription = raw ? JSON.parse(raw) : null;
} catch (e) {
  subscription = null;
}

if (!subscription || !subscription.status) {
  navigate("/choose-plan");
  return;
}

// optional: check expiry
const today = new Date();
if (subscription.expiryDate && new Date(subscription.expiryDate) < today) {
  navigate("/choose-plan");
  return;
}

navigate("/dashboard");
};

  return (
    <div className="min-h-screen flex items-start justify-center 
    bg-gradient-to-br from-blue-100 via-white to-blue-200 pt-20 px-6">

      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="text-center mb-6">
          <img src="/logo1.png" className="w-20 h-20 mx-auto mb-3" />

          <h1 className="text-2xl font-bold text-blue-800">
            SmartStock
          </h1>

          <p className="text-sm text-gray-500">
            Login to your account
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4 border">

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-gray-600">Email Address</label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-600">Password</label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <span className="text-blue-700 text-xs cursor-pointer">
              Forgot password?
            </span>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white"
          >
            Login
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-700 cursor-pointer"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}