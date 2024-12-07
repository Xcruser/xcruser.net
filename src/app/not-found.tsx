"use client";

import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-red-50/50 dark:bg-slate-900">
      <div className="text-center space-y-8 p-8 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-red-200 dark:border-red-900/30 shadow-lg shadow-red-500/5">
        {/* Animated SVG */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="w-64 h-64 mx-auto"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full fill-current text-red-400 dark:text-red-500"
          >
            {/* Animated Face */}
            <motion.g
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Sad Face Circle */}
              <circle cx="100" cy="100" r="80" className="fill-current" opacity="0.2" />
              {/* Eyes */}
              <motion.g
                initial={{ scaleY: 1 }}
                animate={{ scaleY: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
              >
                <circle cx="70" cy="80" r="8" className="fill-current" />
                <circle cx="130" cy="80" r="8" className="fill-current" />
              </motion.g>
              {/* Sad Mouth */}
              <path
                d="M60,120 Q100,100 140,120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              rotate: [-1, 1, -1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-7xl font-bold bg-gradient-to-r from-red-500 to-rose-700 dark:from-red-400 dark:to-rose-600 text-transparent bg-clip-text">
              404
            </h1>
          </motion.div>
          <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400">
            Oops! Seite nicht gefunden
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Tut uns leid, aber die gesuchte Seite scheint im digitalen Nirvana verschwunden zu sein.
          </p>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white transition-all rounded-md bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
