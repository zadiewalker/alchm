/**
 * PROGRESS VISUALIZATION SYSTEM
 * "Your Emotional Growth Garden - Visual Journey of Healing"
 * 
 * Beautiful, trauma-informed visualizations that show emotional competency
 * development as organic growth rather than mechanical progression.
 * Celebrates presence over performance and honors healing's non-linear nature.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { 
  EmotionalCompetency, 
  EmotionalLearningProgress 
} from '@/lib/emotional-learning/emotional-skill-tree';
import type { HealingBadge } from '@/lib/emotional-learning/badge-ecosystem';

// Progress Visualization Types
export type VisualizationType = 
  | 'skill_garden'      // Skills as growing plants
  | 'constellation'     // Skills as connected stars
  | 'river_flow'       // Progress as flowing water
  | 'mountain_journey' // Skills as mountain paths
  | 'healing_mandala'  // Circular, sacred geometry
  | 'ecosystem';       // Interconnected living system

export interface ProgressVisualizationProps {
  progress: EmotionalLearningProgress;
  badges: HealingBadge[];
  visualizationType?: VisualizationType;
  showDetails?: boolean;
  interactive?: boolean;
  celebrationMode?: boolean;
  className?: string;
}

// Skill Growth Visualization Component
export const SkillGarden: React.FC<{
  progress: EmotionalLearningProgress;
  interactive?: boolean;
  onSkillClick?: (skill: EmotionalCompetency) => void;
}> = ({ progress, interactive = false, onSkillClick }) => {
  const [hoveredSkill, setHoveredSkill] = useState<EmotionalCompetency | null>(null);
  const [celebratingSkill, setCelebratingSkill] = useState<EmotionalCompetency | null>(null);

  // Convert emotional competencies to garden elements
  const getPlantType = (competency: EmotionalCompetency, masteryLevel: number) => {
    const plantTypes = {
      emotional_awareness: { type: 'sunflower', color: '#FFD700', size: masteryLevel / 100 },
      self_regulation: { type: 'oak_tree', color: '#8FBC8F', size: masteryLevel / 100 },
      social_awareness: { type: 'rose_bush', color: '#FF6B8A', size: masteryLevel / 100 },
      relationship_skills: { type: 'vine', color: '#9370DB', size: masteryLevel / 100 },
      responsible_decision_making: { type: 'bamboo', color: '#32CD32', size: masteryLevel / 100 },
      trauma_healing: { type: 'lotus', color: '#DDA0DD', size: masteryLevel / 100 },
      boundary_setting: { type: 'cactus', color: '#228B22', size: masteryLevel / 100 },
      self_compassion: { type: 'cherry_blossom', color: '#FFB6C1', size: masteryLevel / 100 }
    };
    
    return plantTypes[competency] || plantTypes.emotional_awareness;
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-xl overflow-hidden border-2 border-green-200">
      {/* Sky and Ground */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-green-50" />
      
      {/* Sun */}
      <motion.div
        className="absolute top-4 right-4 w-12 h-12 bg-yellow-300 rounded-full shadow-lg"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-4 bg-yellow-200 origin-bottom"
            style={{
              left: '50%',
              bottom: '50%',
              transform: `rotate(${i * 45}deg) translateX(-50%)`
            }}
            animate={{ 
              scaleY: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Ground line */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-amber-100 to-transparent" />

      {/* Plants for each skill */}
      <div className="absolute inset-0 p-4">
        {Object.entries(progress.treeProgress).map(([competency, treeData], index) => {
          const plant = getPlantType(competency as EmotionalCompetency, treeData.masteryScore);
          const isHovered = hoveredSkill === competency;
          const isCelebrating = celebratingSkill === competency;
          
          return (
            <motion.div
              key={competency}
              className={`absolute ${interactive ? 'cursor-pointer' : ''}`}
              style={{
                left: `${15 + (index % 4) * 20}%`,
                bottom: `${20 + Math.floor(index / 4) * 25}%`
              }}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isCelebrating ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => interactive && setHoveredSkill(competency as EmotionalCompetency)}
              onHoverEnd={() => interactive && setHoveredSkill(null)}
              onClick={() => interactive && onSkillClick?.(competency as EmotionalCompetency)}
            >
              {/* Plant visualization */}
              <PlantVisualization
                type={plant.type}
                color={plant.color}
                size={Math.max(0.3, plant.size)} // Minimum size for visibility
                masteryLevel={treeData.masteryScore}
                isGrowing={isCelebrating}
              />
              
              {/* Skill label */}
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-800 bg-white/80 px-2 py-1 rounded-lg shadow-sm whitespace-nowrap"
                initial={{ opacity: 0, y: 5 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0.7,
                  y: isHovered ? 0 : 5
                }}
                transition={{ duration: 0.2 }}
              >
                {competency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </motion.div>
              
              {/* Mastery level indicator */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                animate={{ 
                  scale: isHovered ? 1.2 : 1,
                  rotate: isCelebrating ? [0, 360] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(treeData.masteryScore / 10)}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Growth celebration effects */}
      <AnimatePresence>
        {celebratingSkill && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Sparkles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Plant Visualization
const PlantVisualization: React.FC<{
  type: string;
  color: string;
  size: number;
  masteryLevel: number;
  isGrowing?: boolean;
}> = ({ type, color, size, masteryLevel, isGrowing = false }) => {
  
  const baseSize = 20 + (size * 30); // Scale from 20px to 50px
  
  switch (type) {
    case 'sunflower':
      return (
        <motion.div
          className="relative"
          animate={{ 
            scale: isGrowing ? [1, 1.2, 1] : 1,
            rotate: isGrowing ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 1, repeat: isGrowing ? Infinity : 0 }}
        >
          {/* Stem */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-t-lg"
            style={{ width: '4px', height: `${baseSize * 0.8}px` }}
          />
          {/* Flower */}
          <div
            className="absolute rounded-full border-4 border-yellow-400 flex items-center justify-center"
            style={{
              width: `${baseSize}px`,
              height: `${baseSize}px`,
              backgroundColor: color,
              bottom: `${baseSize * 0.6}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="w-3 h-3 bg-amber-800 rounded-full" />
          </div>
        </motion.div>
      );
      
    case 'oak_tree':
      return (
        <motion.div
          className="relative"
          animate={{ 
            scale: isGrowing ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 2, repeat: isGrowing ? Infinity : 0 }}
        >
          {/* Trunk */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-amber-700 rounded-t-lg"
            style={{ width: '6px', height: `${baseSize * 0.6}px` }}
          />
          {/* Leaves */}
          <div
            className="absolute rounded-full"
            style={{
              width: `${baseSize}px`,
              height: `${baseSize * 0.8}px`,
              backgroundColor: color,
              bottom: `${baseSize * 0.4}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </motion.div>
      );
      
    case 'rose_bush':
      return (
        <motion.div
          className="relative"
          animate={{ 
            scale: isGrowing ? [1, 1.15, 1] : 1
          }}
          transition={{ duration: 1.5, repeat: isGrowing ? Infinity : 0 }}
        >
          {/* Bush base */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full"
            style={{ width: `${baseSize}px`, height: `${baseSize * 0.7}px` }}
          />
          {/* Roses */}
          {[...Array(Math.max(1, Math.floor(masteryLevel / 25)))].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: color,
                top: `${10 + i * 8}%`,
                left: `${30 + (i % 3) * 20}%`
              }}
            />
          ))}
        </motion.div>
      );
      
    case 'lotus':
      return (
        <motion.div
          className="relative"
          animate={{ 
            rotate: isGrowing ? [0, 360] : 0,
            scale: isGrowing ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 3, repeat: isGrowing ? Infinity : 0 },
            scale: { duration: 2, repeat: isGrowing ? Infinity : 0 }
          }}
        >
          {/* Lotus petals */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-80"
              style={{
                width: `${baseSize * 0.4}px`,
                height: `${baseSize * 0.8}px`,
                backgroundColor: color,
                transformOrigin: '50% 100%',
                transform: `rotate(${i * 45}deg) translateY(-${baseSize * 0.3}px)`,
                left: '50%',
                bottom: '0',
                marginLeft: `-${baseSize * 0.2}px`
              }}
            />
          ))}
          {/* Center */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-yellow-300 rounded-full"
            style={{ width: `${baseSize * 0.3}px`, height: `${baseSize * 0.3}px` }}
          />
        </motion.div>
      );
      
    default:
      return (
        <div
          className="rounded-full"
          style={{
            width: `${baseSize}px`,
            height: `${baseSize}px`,
            backgroundColor: color
          }}
        />
      );
  }
};

// Constellation View for Skills
export const SkillConstellation: React.FC<{
  progress: EmotionalLearningProgress;
  badges: HealingBadge[];
}> = ({ progress, badges }) => {
  const [activeSkill, setActiveSkill] = useState<EmotionalCompetency | null>(null);

  const getSkillPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = 120;
    return {
      x: 50 + (Math.cos(angle) * radius) / 3, // Percentage
      y: 50 + (Math.sin(angle) * radius) / 3
    };
  };

  const skills = Object.entries(progress.treeProgress);

  return (
    <div className="relative w-full h-80 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl overflow-hidden">
      {/* Stars background */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Skill stars */}
      {skills.map(([competency, data], index) => {
        const position = getSkillPosition(index, skills.length);
        const isActive = activeSkill === competency;
        const masteryLevel = data.masteryScore;
        
        return (
          <motion.div
            key={competency}
            className="absolute cursor-pointer"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            whileHover={{ scale: 1.3 }}
            onHoverStart={() => setActiveSkill(competency as EmotionalCompetency)}
            onHoverEnd={() => setActiveSkill(null)}
          >
            {/* Star */}
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 360],
                scale: isActive ? 1.2 : 1
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 }
              }}
            >
              <StarShape
                size={10 + (masteryLevel / 100) * 20}
                color={`hsl(${masteryLevel * 1.2}, 70%, 70%)`}
                brightness={masteryLevel / 100}
              />
            </motion.div>

            {/* Skill name */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {competency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <div className="text-xs text-gray-300 mt-1">
                    Level {Math.ceil(masteryLevel / 20)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Connection lines between related skills */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {skills.map(([competency, _], index) => {
          const from = getSkillPosition(index, skills.length);
          const nextIndex = (index + 1) % skills.length;
          const to = getSkillPosition(nextIndex, skills.length);
          
          return (
            <motion.line
              key={`${competency}-connection`}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 0.3,
                strokeDasharray: [0, 100, 0]
              }}
              transition={{ 
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 5
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Star shape component
const StarShape: React.FC<{
  size: number;
  color: string;
  brightness: number;
}> = ({ size, color, brightness }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <motion.path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={color}
      animate={{
        filter: [
          `brightness(${brightness})`,
          `brightness(${brightness * 1.5})`,
          `brightness(${brightness})`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </svg>
);

// Badge Gallery Component
export const BadgeGallery: React.FC<{
  badges: HealingBadge[];
  onBadgeClick?: (badge: HealingBadge) => void;
}> = ({ badges, onBadgeClick }) => {
  const [selectedBadge, setSelectedBadge] = useState<HealingBadge | null>(null);

  const categoryColors = {
    foundation: 'from-green-100 to-green-200',
    skill_development: 'from-blue-100 to-blue-200', 
    resilience_building: 'from-purple-100 to-purple-200',
    community_healing: 'from-pink-100 to-pink-200'
  };

  const groupedBadges = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, HealingBadge[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {category.replace('_', ' ')} Badges
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryBadges.map(badge => (
              <motion.div
                key={badge.id}
                className={`relative p-4 rounded-lg cursor-pointer bg-gradient-to-br ${
                  categoryColors[badge.category as keyof typeof categoryColors]
                } border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedBadge(badge);
                  onBadgeClick?.(badge);
                }}
              >
                {/* Badge Icon */}
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center text-2xl">
                    {getBadgeIcon(badge.name)}
                  </div>
                </div>
                
                {/* Badge Name */}
                <h4 className="text-sm font-medium text-center text-gray-800 mb-1">
                  {badge.name}
                </h4>
                
                {/* Badge Description */}
                <p className="text-xs text-gray-600 text-center line-clamp-2">
                  {badge.description}
                </p>
                
                {/* Earned indicator */}
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get badge icon
const getBadgeIcon = (badgeName: string): string => {
  const iconMap: Record<string, string> = {
    'Feeling Translator': '🔍',
    'Body Wisdom': '🌊',
    'Trigger Mapper': '🗺️',
    'Safe Space Creator': '🏛️',
    'Pause Master': '⏸️',
    'Breath Alchemist': '🌬️',
    'Reframe Artist': '🎨',
    'Boundary Guardian': '🛡️',
    'Storm Surfer': '🌊',
    'Wisdom Keeper': '💎',
    'Phoenix Rising': '🔥',
    'Gentle Warrior': '🌟',
    'Anonymous Angel': '👼',
    'Collective Strength': '🌍',
    'Ripple Effect': '〰️',
    'Sanctuary Builder': '🏛️'
  };
  
  return iconMap[badgeName] || '⭐';
};

// Main Progress Visualization Component
export const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  badges,
  visualizationType = 'skill_garden',
  showDetails = true,
  interactive = true,
  celebrationMode = false,
  className = ''
}) => {
  const [activeView, setActiveView] = useState<VisualizationType>(visualizationType);

  const handleSkillClick = (skill: EmotionalCompetency) => {
    if (interactive) {
      // Could open skill details modal
      console.log('Skill clicked:', skill);
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* View Toggle */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(['skill_garden', 'constellation'] as VisualizationType[]).map(view => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === view
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {view.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Main Visualization */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {activeView === 'skill_garden' && (
            <SkillGarden
              progress={progress}
              interactive={interactive}
              onSkillClick={handleSkillClick}
            />
          )}
          
          {activeView === 'constellation' && (
            <SkillConstellation
              progress={progress}
              badges={badges}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Badge Gallery */}
      {badges.length > 0 && (
        <BadgeGallery
          badges={badges}
          onBadgeClick={(badge) => console.log('Badge clicked:', badge)}
        />
      )}

      {/* Progress Summary */}
      {showDetails && (
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Growth Journey</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {progress.totalLessonsCompleted}
              </div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {badges.length}
              </div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Day Learning Streak</div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            "Every step forward is worth celebrating. You're becoming who you're meant to be."
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressVisualization;