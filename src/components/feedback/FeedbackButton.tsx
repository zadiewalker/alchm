'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackModal } from './FeedbackModal';

interface FeedbackButtonProps {
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left';
  /** Hide on certain pages */
  hidden?: boolean;
}

export function FeedbackButton({ 
  position = 'bottom-right',
  hidden = false 
}: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  if (hidden) return null;

  const positionClasses = {
    'bottom-right': 'right-4 bottom-28',
    'bottom-left': 'left-4 bottom-28',
  };

  return (
    <>
      {/* The Button */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          setHasInteracted(true);
        }}
        className={`fixed ${positionClasses[position]} z-40
                    w-14 h-14 rounded-full
                    bg-gradient-to-br from-[#a4b792] to-[#8fa07d]
                    shadow-lg shadow-[#a4b792]/30
                    flex items-center justify-center
                    focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2
                    active:scale-95 transition-transform`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4, ease: 'easeOut' }}
        aria-label="Send feedback"
        aria-haspopup="dialog"
      >
        {/* Icon with subtle animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <FeedbackIcon className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>

      {/* Tooltip - shows once, then disappears */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 2, duration: 0.3 }}
            className={`fixed ${position === 'bottom-right' ? 'right-20' : 'left-20'} 
                        bottom-32 z-40
                        bg-white rounded-xl px-4 py-2 shadow-lg
                        text-sm text-gray-700 font-medium
                        pointer-events-none`}
          >
            Share feedback
            {/* Arrow */}
            <div className={`absolute top-1/2 -translate-y-1/2 
                            ${position === 'bottom-right' ? '-right-2' : '-left-2'}
                            w-0 h-0 
                            border-t-8 border-t-transparent
                            border-b-8 border-b-transparent
                            ${position === 'bottom-right' 
                              ? 'border-l-8 border-l-white' 
                              : 'border-r-8 border-r-white'}`} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Modal */}
      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}

// Custom icon that feels organic, not corporate
function FeedbackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      {/* Speech bubble with heart */}
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      {/* Small heart inside */}
      <path d="M12 14.5c-.8 0-1.5-.3-2-1-.5.7-1.2 1-2 1-1.7 0-3-1.3-3-3s1.3-3 3-3c.8 0 1.5.3 2 1 .5-.7 1.2-1 2-1 1.7 0 3 1.3 3 3s-1.3 3-3 3z" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}