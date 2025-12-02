'use client';

import { motion } from 'framer-motion';

export function FeedbackSuccess() {
  return (
    <div className="text-center py-8">
      {/* Animated Checkmark */}
      <motion.div
        className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
      >
        <motion.svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      {/* Message */}
      <motion.h3
        className="text-xl font-semibold text-gray-800 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Thank you
      </motion.h3>
      
      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Your feedback helps us grow.
      </motion.p>

      {/* Subtle closing indicator */}
      <motion.p
        className="text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Closing automatically...
      </motion.p>
    </div>
  );
}