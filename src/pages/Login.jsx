import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    localStorage.setItem("user", "true");

    if (remember) {
      localStorage.setItem("remember", "true");
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-start justify-center 
    bg-gradient-to-br from-blue-100 via-white to-blue-200 pt-20 px-6">

      <div className="w-full max-w-sm">

        {/* LOGO + BRAND */}
        <div className="text-center mb-6">
          <img
            src="/logo1.png"
            className="w-20 h-20 mx-auto mb-3 drop-shadow-lg"
          />

          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-900 text-transparent bg-clip-text">
            SmartStock
          </h1>

          <p className="text-sm text-gray-500">
            Login to your account
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-5 space-y-4 border">

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="example@email.com"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Password
            </label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-blue-600"
              />
              <span className="text-gray-600">Remember me</span>
            </label>

            <span className="text-blue-700 cursor-pointer text-xs">
              Forgot password?
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-900 text-white rounded-xl"
            onClick={handleLogin}
          >
            Login
          </Button>

          {/* SIGNUP */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-700 font-medium cursor-pointer"
            >
              Sign up
            </span>
          </p>

          {/* CONSENT */}
          <p className="text-[11px] text-gray-400 text-center leading-tight">
            By continuing, you agree to our{" "}
            <span className="underline">Terms</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>

        </div>
      </div>
    </div>
  );
}