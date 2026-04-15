import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  // AUTO REDIRECT AFTER ANIMATION
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >

        {/* LOGO */}
        <motion.img
          src="/logo1.png"
          className="w-28 h-28"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* APP NAME */}
        <motion.h1
          className="mt-4 text-3xl font-bold text-gradient bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-transparent bg-clip-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>Smart</span>Stock
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          className="text-s text-gray-500 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Scan. Track. Manage
        </motion.p>

      </motion.div>
    </div>
  );
}