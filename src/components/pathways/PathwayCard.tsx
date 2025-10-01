'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Pathway {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  difficulty: string;
  participants: number;
  requiresSupport?: boolean;
}

interface Category {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
}

interface PathwayCardProps {
  pathway: Pathway;
  category: Category;
  onStart: () => void;
}

// Progress circle with organic growth animation
const ProgressCircle = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-medium text-sm">
          {progress}%
        </span>
      </div>
    </div>
  );
};

// Difficulty badge with appropriate styling
const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const styles = {
    'Foundation': 'bg-green-500/20 text-green-100 border-green-300/30',
    'Growth': 'bg-blue-500/20 text-blue-100 border-blue-300/30',
    'Guided': 'bg-purple-500/20 text-purple-100 border-purple-300/30',
    'Advanced': 'bg-amber-500/20 text-amber-100 border-amber-300/30'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[difficulty as keyof typeof styles] || styles.Foundation}`}>
      {difficulty}
    </span>
  );
};

// Heart sparkle for support indicator
const HeartSparkle = () => {
  return (
    <motion.div
      className="text-red-300"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      💖
    </motion.div>
  );
};

export function PathwayCard({ pathway, category, onStart }: PathwayCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasProgress = pathway.progress > 0;

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} backdrop-blur-sm border border-white/20 p-6 transition-all duration-500`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glass morphism overlay */}
      <motion.div
        className="absolute inset-0 bg-white/5 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Support indicator */}
      {pathway.requiresSupport && (
        <div className="absolute top-4 right-4">
          <HeartSparkle />
        </div>
      )}

      <div className="relative z-10 space-y-6">
        {/* Header with icon and progress */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-4xl"
              animate={isHovered ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 0.6 }}
            >
              {category.icon}
            </motion.div>
            <div>
              <DifficultyBadge difficulty={pathway.difficulty} />
            </div>
          </div>
          
          {hasProgress && (
            <ProgressCircle progress={pathway.progress} />
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium text-white mb-2 leading-tight">
              {pathway.title}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
              {pathway.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-white/60 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {pathway.duration}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {pathway.participants.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className={`w-full ${hasProgress 
              ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30' 
              : 'bg-white/90 hover:bg-white text-gray-800 border border-white/50'
            } backdrop-blur-sm transition-all duration-300`}
            size="lg"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {hasProgress ? (
                <>
                  Continue Journey
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Begin Pathway
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </>
              )}
            </motion.span>
          </Button>
        </div>

        {/* Special support message */}
        {pathway.requiresSupport && (
          <motion.div
            className="bg-red-500/10 border border-red-300/20 rounded-xl p-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-100 text-xs leading-relaxed">
              This pathway includes extra support and guidance for sensitive content. 
              Professional resources are always available.
            </p>
          </motion.div>
        )}
      </div>

      {/* Gentle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.1 : 0,
          boxShadow: isHovered 
            ? "inset 0 0 60px rgba(255,255,255,0.2)" 
            : "inset 0 0 0px rgba(255,255,255,0)"
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

export default PathwayCard;