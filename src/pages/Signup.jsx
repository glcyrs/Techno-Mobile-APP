import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");

  const handleSignup = () => {
  setError("");

  if (!form.name || !form.email || !form.password || !form.confirm) {
    setError("All fields are required");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    setError("Invalid email format");
    return;
  }

  if (form.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  if (form.password !== form.confirm) {
    setError("Passwords do not match");
    return;
  }

  if (!agree) {
    setError("You must agree to Terms and Privacy Policy");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existing = users.find((u) => u.email === form.email);
  if (existing) {
    setError("Email already exists");
    return;
  }

  const newUser = {
    id: Date.now(),
    name: form.name,
    email: form.email,
    password: form.password,
    role: "User",
  };

  users.push(newUser);

  // SAVE USERS LIST
  localStorage.setItem("users", JSON.stringify(users));

  // SAVE CURRENT SESSION USER (IMPORTANT FIX)
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  console.log("USERS SAVED:", users);

  // reset subscription
  localStorage.removeItem("subscription");

  navigate("/choose-plan");
};

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 pt-16 px-6">
      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="text-center mb-6">
          <img src="/logo1.png" className="w-20 h-20 mx-auto mb-3" />
          <h1 className="text-2xl font-extrabold text-blue-800">
            SmartStock
          </h1>
          <p className="text-sm text-gray-500">
            Create your account
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4 border">

          {/* 🔴 ERROR MESSAGE */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <Input
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="pr-10"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
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

          {/* CONFIRM PASSWORD */}
          <div>
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                className="pr-10"
                value={form.confirm}
                onChange={(e) =>
                  setForm({ ...form, confirm: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* TERMS */}
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mt-1 accent-blue-600"
            />
            <span className="text-gray-600">
              I agree to Terms and Privacy Policy
            </span>
          </label>

          {/* BUTTON */}
          <Button
             type="button"
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white"
          >
              Create Account
            </Button>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-700 cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}