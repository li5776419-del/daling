"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export function GlobalNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isChatPage = pathname === "/soul-dialogue";

  return (
    <>
      {/* Back button - hide on home and chat pages */}
      {!isHomePage && !isChatPage && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="nav-button fixed top-6 left-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </motion.button>
      )}

      {/* Home button - hide on home page */}
      {!isHomePage && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/")}
          className="nav-button fixed top-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home size={20} className="text-gray-700" />
        </motion.button>
      )}
    </>
  );
}
