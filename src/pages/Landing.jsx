import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  // AUTO REDIRECT TO LOGIN
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500); // medyo mas smooth (2.5s)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-blue-100 via-white to-blue-200">

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >

        {/* LOGO WITH FLOAT + GLOW */}
        <motion.img
          src="/logo1.png"
          className="w-40 h-40 drop-shadow-2xl"
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* FLOATING EFFECT */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-40 h-40 rounded-full bg-blue-400/20 blur-3xl -z-10"
        />

        {/* APP NAME */}
        <motion.h1
          className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          SmartStock
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          className="text-sm text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Scan. Track. Manage — Smarter.
        </motion.p>

        {/* LOADING DOTS */}
        <motion.div
          className="flex gap-1 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        </motion.div>

      </motion.div>
    </div>
  );
}