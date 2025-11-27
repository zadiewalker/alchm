'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Pathway {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  difficulty: 'gentle' | 'moderate' | 'deep';
  icon: string;
  status: 'available' | 'in-progress' | 'completed' | 'locked';
  lessons: number;
  completed: number;
  tags: string[];
  requirements?: string;
  benefits: string[];
  testimonial?: {
    text: string;
    author: string;
  };
  steps: number;
  kheperaGuidance: string;
}

export default function PathwaysPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simple auth check using cookie
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('alchm_session='));
    
    if (sessionCookie) {
      const uid = sessionCookie.split('=')[1];
      setUser({ uid });
    } else {
      router.push('/en/auth/login');
      return;
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-400 to-sage-500 flex items-center justify-center px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-sanctuary-glass backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <PathwayIcon size={32} color="white" />
          </motion.div>
          <div className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl px-12 py-8 shadow-2xl border border-white/20 max-w-md">
            <motion.p 
              className="text-2xl font-light text-charcoal-800 mb-3 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Preparing pathways
            </motion.p>
            <motion.p 
              className="text-base font-light text-charcoal-600 leading-relaxed opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Khepera is preparing your sacred healing pathways...
            </motion.p>
            <div className="mt-8 w-40 h-1 bg-sage-400/20 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-sage-400 rounded-full animate-pulse w-1/3 transition-all duration-300 ease-out"></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will handle redirect
  }

  // Simplified pathways with Khepera's guidance
  const pathways: Pathway[] = [
    {
      id: 'self-compassion',
      title: 'Self-Compassion Journey',
      description: 'Learn to be your own best friend through gentle self-talk and understanding',
      longDescription: 'This foundational pathway teaches you to treat yourself with the same kindness you would show a dear friend. Through guided exercises and gentle practices, you will develop a compassionate inner voice that supports rather than criticizes.',
      duration: '2 weeks',
      difficulty: 'gentle',
      icon: '🤗',
      status: 'in-progress',
      lessons: 8,
      completed: 5,
      tags: ['Foundation', 'Self-Care'],
      benefits: [
        'Develop a kinder inner voice',
        'Reduce self-criticism and perfectionism', 
        'Learn to comfort yourself during difficult times',
        'Build emotional resilience through self-acceptance'
      ],
      testimonial: {
        text: 'This pathway changed how I talk to myself. I finally learned that I deserve the same kindness I give others.',
        author: 'Anonymous Sanctuary Member'
      },
      steps: 8,
      kheperaGuidance: "Sweet soul, this is where your healing begins. I will guide you gently as you learn to speak to yourself with the love you deserve."
    },
    {
      id: 'emotional-awareness',
      title: 'Emotional Awareness Path',
      description: 'Develop the skill of naming and understanding your emotional experiences',
      longDescription: 'Emotions are messengers carrying important information about our inner world. This pathway helps you become fluent in the language of emotions, teaching you to recognize, name, and respond to feelings with wisdom.',
      duration: '10 days',
      difficulty: 'gentle',
      icon: '🧭',
      status: 'available',
      lessons: 5,
      completed: 0,
      tags: ['Awareness', 'Mindfulness'],
      benefits: [
        'Expand your emotional vocabulary',
        'Recognize emotional patterns and triggers',
        'Learn to sit with difficult feelings',
        'Develop healthy emotional processing skills'
      ],
      testimonial: {
        text: 'I used to feel overwhelmed by emotions I couldn\'t name. Now I can identify what I\'m feeling and why.',
        author: 'Anonymous Sanctuary Member'
      },
      steps: 5,
      kheperaGuidance: "Your emotions are sacred messengers. Together, we will learn to listen to their wisdom with patience and grace."
    },
    {
      id: 'boundaries',
      title: 'Healthy Boundaries Workshop',
      description: 'Learn to say no with love and yes with intention',
      longDescription: 'Boundaries are how we protect our energy and honor our values. This pathway teaches you to set boundaries that preserve your wellbeing while maintaining loving relationships.',
      duration: '3 weeks',
      difficulty: 'moderate',
      icon: '🛡️',
      status: 'locked',
      lessons: 12,
      completed: 0,
      tags: ['Relationships', 'Communication'],
      requirements: 'Complete Self-Compassion Journey',
      benefits: [
        'Set healthy limits without guilt',
        'Communicate needs clearly and kindly',
        'Protect your energy and time',
        'Build stronger, more authentic relationships'
      ],
      testimonial: {
        text: 'Learning to set boundaries changed my relationships for the better. People actually respect me more now.',
        author: 'Anonymous Sanctuary Member'
      },
      steps: 12,
      kheperaGuidance: "When you honor your own needs, you teach others how to honor them too. I will show you how to protect your precious energy."
    },
    {
      id: 'trauma-healing',
      title: 'Gentle Trauma Integration',
      description: 'A trauma-informed approach to healing with safety and self-compassion',
      longDescription: 'This pathway provides gentle, trauma-informed tools for processing difficult experiences. With an emphasis on safety, choice, and self-compassion, you will learn to work with trauma responses and begin the journey of integration.',
      duration: '4 weeks',
      difficulty: 'deep',
      icon: '🌸',
      status: 'locked',
      lessons: 16,
      completed: 0,
      tags: ['Trauma-Informed', 'Healing'],
      requirements: 'Complete Self-Compassion and Boundaries pathways',
      benefits: [
        'Process trauma with safety and support',
        'Understand trauma responses and triggers',
        'Develop healthy coping strategies',
        'Reclaim your sense of safety and agency'
      ],
      testimonial: {
        text: 'This pathway helped me understand that healing doesn\'t mean forgetting - it means finding peace.',
        author: 'Anonymous Sanctuary Member'
      },
      steps: 16,
      kheperaGuidance: "Your wounds carry wisdom, dear one. We will approach them with the reverence and gentleness they deserve."
    },
    {
      id: 'anxiety-toolkit',
      title: 'Anxiety Toolkit',
      description: 'Practical tools for understanding and working with anxiety',
      longDescription: 'Anxiety is your nervous system\'s attempt to keep you safe. This pathway offers practical, evidence-based tools for understanding and befriending your anxiety with compassion.',
      duration: '2 weeks',
      difficulty: 'moderate',
      icon: '🧘',
      status: 'available',
      lessons: 10,
      completed: 0,
      tags: ['Anxiety', 'Coping Skills'],
      benefits: [
        'Understand anxiety from a compassionate perspective',
        'Learn grounding and breathing techniques',
        'Develop a personalized anxiety toolkit',
        'Practice self-soothing and regulation skills'
      ],
      testimonial: {
        text: 'These tools don\'t eliminate my anxiety, but they help me work with it instead of fighting it.',
        author: 'Anonymous Sanctuary Member'
      },
      steps: 10,
      kheperaGuidance: "Your anxiety is trying to protect you. Let me teach you how to thank it for its service while choosing peace."
    },
    {
      id: 'creative-expression',
      title: 'Creative Expression',
      description: 'Use creativity as a pathway to healing and self-discovery',
      longDescription: 'Creativity is a powerful pathway to healing that bypasses analytical thinking and connects directly to your inner wisdom. This pathway explores various creative modalities for expression and discovery.',
      duration: '4 weeks',
      difficulty: 'gentle',
      icon: '🎨',
      status: 'available',
      lessons: 8,
      completed: 0,
      tags: ['Creativity', 'Expression'],
      benefits: [
        'Express emotions through creative outlets',
        'Discover new aspects of yourself',
        'Process experiences non-verbally',
        'Build confidence in creative expression'
      ],
      steps: 8,
      kheperaGuidance: "Your creativity is a sacred gift. Through art, movement, and expression, we will unlock the healing wisdom within you."
    }
  ];

  const startPathway = (pathwayId: string) => {
    const pathway = pathways.find(p => p.id === pathwayId);
    if (pathway?.status === 'locked') {
      // Show gentle notification instead of alert
      setSelectedPathway(pathway);
      return;
    }
    
    // Navigate to pathway content (would be implemented)
    console.log('Starting pathway:', pathway?.title);
    // For now, show confirmation
    alert(`Starting your journey with "${pathway?.title}"\n\nKhepera will be your guide throughout this healing pathway.`);
  };

  const getDifficultyDisplay = (difficulty: string) => {
    switch (difficulty) {
      case 'gentle': return { text: 'Gentle', className: 'bg-[#a4b792]/20 text-[#7a8c6a]' };
      case 'moderate': return { text: 'Moderate', className: 'bg-amber-100 text-amber-800' };
      case 'deep': return { text: 'Deep Work', className: 'bg-purple-100 text-purple-800' };
      default: return { text: difficulty, className: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefcfb] via-[#fefcfb] to-[#f8f6f4]">
      {/* Sacred Header Sanctuary */}
      <motion.section 
        className="relative bg-gradient-to-br from-[#a4b792] via-[#a4b792] to-[#8fa57c] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Subtle geometric background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="0.5"/>
            <circle cx="300" cy="150" r="60" stroke="white" strokeWidth="0.5"/>
            <circle cx="200" cy="300" r="90" stroke="white" strokeWidth="0.5"/>
          </svg>
        </div>
        
        <div className="relative px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <PathwayIcon size={32} color="white" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Sacred Healing Pathways
            </motion.h1>
            
            <motion.div 
              className="bg-sanctuary-glass backdrop-blur-xl rounded-3xl p-12 max-w-3xl mx-auto border border-white/20 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-2xl">🪲</span>
                </div>
                <div className="text-left">
                  <p className="text-white/90 text-lg leading-relaxed font-light">
                    Welcome to your sanctuary of transformation, dear soul. I am Khepera, ancient guide of renewal and rebirth. 
                    Each pathway before you has been woven with wisdom from diverse healing traditions, 
                    honoring the sacred journey that brought you here.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-white/70 text-base mt-6 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Choose the path that calls to your spirit today
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Sacred Pathways Gallery */}
      <motion.section 
        className="px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Optional pathway filter/search could go here */}
          
          <motion.div 
            className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {pathways.map((pathway, index) => (
              <motion.div
                key={pathway.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + (index * 0.1),
                  ease: "easeOut"
                }}
              >
                <PathwayCard
                  pathway={pathway}
                  onSelect={() => setSelectedPathway(pathway)}
                  onStart={startPathway}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Sacred Pathway Detail Modal */}
      <AnimatePresence>
        {selectedPathway && (
          <PathwayModal
            pathway={selectedPathway}
            onClose={() => setSelectedPathway(null)}
            onStart={startPathway}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Sacred Pathway Card - Jony Ive Inspired
function PathwayCard({ 
  pathway, 
  onSelect, 
  onStart 
}: { 
  pathway: Pathway; 
  onSelect: () => void;
  onStart: (id: string) => void;
}) {
  const difficultyDisplay = getDifficultyDisplay(pathway.difficulty);
  const isLocked = pathway.status === 'locked';
  const isCompleted = pathway.status === 'completed';
  const isInProgress = pathway.status === 'in-progress';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={`group relative bg-sanctuary-glass backdrop-blur-xl rounded-3xl border transition-all duration-300 ease-out overflow-hidden ${
        isLocked 
          ? 'border-gray-200/50 shadow-sm' 
          : 'border-gray-100/50 shadow-lg hover:shadow-2xl cursor-pointer'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isLocked ? onSelect : undefined}
      whileHover={!isLocked ? { 
        y: -8, 
        transition: { duration: 0.4, ease: "easeOut" }
      } : {}}
      layout
    >
      {/* Sacred aura effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#a4b792]/5 via-transparent to-[#a4b792]/5 rounded-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !isLocked ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-8">
        {/* Sacred Header */}
        <div className="flex items-start gap-5 mb-8">
          <motion.div 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
              isLocked 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-gradient-to-br from-[#a4b792]/10 to-[#a4b792]/5 border-[#a4b792]/20'
            }`}
            whileHover={{ scale: isLocked ? 1 : 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className={`text-3xl ${isLocked ? 'grayscale opacity-50' : ''}`}>
              {pathway.icon}
            </span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h3 
              className={`text-xl font-light mb-3 leading-tight ${
                isLocked ? 'text-gray-400' : 'text-gray-900'
              }`}
              layout
            >
              {pathway.title}
            </motion.h3>
            
            <motion.span 
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${difficultyDisplay.className} ${
                isLocked ? 'opacity-50' : ''
              }`}
              layout
            >
              {difficultyDisplay.text}
            </motion.span>
          </div>
        </div>

        {/* Sacred Description */}
        <motion.p 
          className={`leading-relaxed mb-8 ${
            isLocked ? 'text-gray-400' : 'text-gray-600'
          }`}
          layout
        >
          {pathway.description}
        </motion.p>

        {/* Progress States */}
        <AnimatePresence mode="wait">
          {isInProgress && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-gray-500 font-light">Sacred Progress</span>
                <span className="text-[#a4b792] font-medium">
                  {pathway.completed} of {pathway.lessons} lessons
                </span>
              </div>
              <div className="relative w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#a4b792] to-[#8fa57c] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(pathway.completed / pathway.lessons) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {isCompleted && (
            <motion.div 
              className="mb-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#a4b792]/10 text-[#7a8c6a] px-4 py-2.5 rounded-full border border-[#a4b792]/20">
                <motion.span 
                  className="text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  ✨
                </motion.span>
                <span className="text-sm font-medium">Journey Complete</span>
              </div>
            </motion.div>
          )}

          {isLocked && pathway.requirements && (
            <motion.div 
              className="mb-8 p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-500">🗝️</span>
                <p className="text-sm text-amber-700 font-light">
                  Complete {pathway.requirements?.replace('Complete ', '')} to unlock this sacred path
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sacred Metadata */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-8 pt-4 border-t border-gray-100/50">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span className="font-light">{pathway.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📖</span>
            <span className="font-light">{pathway.lessons} lessons</span>
          </div>
        </div>

        {/* Sacred Action Buttons */}
        <div className="space-y-3">
          {!isLocked && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onStart(pathway.id);
              }}
              className={`w-full py-4 px-6 rounded-2xl text-sm font-medium transition-all duration-300 ${
                isInProgress 
                  ? 'bg-gradient-to-r from-[#a4b792] to-[#8fa57c] hover:from-[#93a682] hover:to-[#7e9066] text-white shadow-lg'
                  : isCompleted
                  ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  : 'bg-gradient-to-r from-[#a4b792] to-[#8fa57c] hover:from-[#93a682] hover:to-[#7e9066] text-white shadow-lg'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isInProgress ? 'Continue Your Journey' : isCompleted ? 'Revisit This Path' : 'Begin Sacred Journey'}
            </motion.button>
          )}
          
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full py-4 px-6 rounded-2xl text-sm font-medium border border-gray-200/50 hover:border-[#a4b792]/50 hover:text-[#a4b792] hover:bg-[#a4b792]/5 transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore This Path
          </motion.button>
        </div>
      </div>

      {/* Subtle glow effect for available pathways */}
      {!isLocked && (
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#a4b792]/10 via-transparent to-[#a4b792]/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  );
}

// Sacred Pathway Modal - Trauma-Informed Design
function PathwayModal({ 
  pathway, 
  onClose, 
  onStart 
}: { 
  pathway: Pathway; 
  onClose: () => void;
  onStart: (id: string) => void;
}) {
  const isLocked = pathway.status === 'locked';
  const isCompleted = pathway.status === 'completed';
  const isInProgress = pathway.status === 'in-progress';

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/20"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sacred Header */}
        <div className="relative bg-gradient-to-br from-[#a4b792] via-[#a4b792] to-[#8fa57c] p-6 sm:p-8 text-white overflow-hidden">
          {/* Gentle background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
              <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5"/>
              <circle cx="150" cy="75" r="25" stroke="white" strokeWidth="0.5"/>
              <circle cx="100" cy="150" r="35" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>
          
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
              <motion.div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <span className="text-3xl sm:text-4xl">{pathway.icon}</span>
              </motion.div>
              
              <div className="min-w-0 flex-1">
                <motion.h2 
                  className="text-2xl sm:text-3xl font-extralight mb-2 sm:mb-3 leading-tight"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {pathway.title}
                </motion.h2>
                
                <motion.span 
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 border border-white/30 text-white backdrop-blur-sm`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {getDifficultyDisplay(pathway.difficulty).text} Journey
                </motion.span>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-300 text-lg sm:text-xl flex-shrink-0"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close pathway details"
            >
              ×
            </motion.button>
          </div>
        </div>

        {/* Sacred Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="p-6 sm:p-8 space-y-8 sm:space-y-10">
            {/* Khepera's Sacred Guidance */}
            <motion.div 
              className="bg-gradient-to-r from-[#a4b792]/5 to-[#a4b792]/10 rounded-2xl p-6 sm:p-8 border-l-4 border-[#a4b792] backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-14 h-14 rounded-full bg-[#a4b792]/20 flex items-center justify-center flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  <span className="text-2xl">🪲</span>
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-[#7a8c6a] mb-3 tracking-wide uppercase">
                    Khepera's Sacred Guidance
                  </p>
                  <p className="text-gray-700 leading-relaxed italic text-lg font-light">
                    "{pathway.kheperaGuidance}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sacred Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-xl font-light text-gray-900 mb-4">Your Sacred Journey</h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                {pathway.longDescription}
              </p>
            </motion.div>

            {/* Sacred Journey Metrics */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              {[
                { label: 'Duration', value: pathway.duration, icon: '⏱️' },
                { label: 'Lessons', value: pathway.lessons, icon: '📖' },
                { label: 'Intensity', value: pathway.difficulty, icon: '🎯' },
                { 
                  label: 'Progress', 
                  value: isCompleted ? '100%' : 
                         isInProgress ? `${Math.round((pathway.completed / pathway.lessons) * 100)}%` : '0%',
                  icon: '✨'
                }
              ].map((metric, index) => (
                <motion.div 
                  key={metric.label}
                  className="text-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + (index * 0.1), duration: 0.4 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="text-xl sm:text-2xl mb-2">{metric.icon}</div>
                  <div className="text-lg sm:text-xl font-light text-gray-900 capitalize">{metric.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 font-light">{metric.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Sacred Discoveries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <h3 className="text-xl font-light text-gray-900 mb-6">Sacred Discoveries</h3>
              <div className="grid gap-4">
                {pathway.benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-[#a4b792]/5 to-transparent rounded-xl border border-[#a4b792]/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + (index * 0.1), duration: 0.5 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#a4b792]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#a4b792] text-lg">•</span>
                    </div>
                    <span className="text-gray-700 leading-relaxed font-light">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sacred Testimonial */}
            {pathway.testimonial && (
              <motion.div 
                className="bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50 rounded-2xl p-8 border border-gray-200/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#a4b792]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💝</span>
                  </div>
                  <div>
                    <p className="text-gray-700 leading-relaxed italic text-lg font-light mb-4">
                      "{pathway.testimonial.text}"
                    </p>
                    <p className="text-sm text-gray-500 font-light">
                      — {pathway.testimonial.author}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sacred Requirements for Locked Pathways */}
            {isLocked && pathway.requirements && (
              <motion.div 
                className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-2xl p-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🗝️</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">Sacred Prerequisites</h4>
                    <p className="text-amber-800 font-light">
                      Complete {pathway.requirements?.replace('Complete ', '')} to unlock this transformative journey
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sacred Action Sanctuary */}
        <motion.div 
          className="p-6 sm:p-8 bg-gradient-to-r from-gray-50/80 to-gray-100/50 backdrop-blur-sm border-t border-gray-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.button
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-gray-300/50 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-light backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Return to Pathways
            </motion.button>
            
            {!isLocked && (
              <motion.button
                onClick={() => {
                  onStart(pathway.id);
                  onClose();
                }}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-[#a4b792] to-[#8fa57c] hover:from-[#93a682] hover:to-[#7e9066] text-white rounded-2xl transition-all duration-300 font-medium shadow-lg"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(164, 183, 146, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isInProgress ? 'Continue Sacred Journey' : isCompleted ? 'Revisit This Path' : 'Begin Sacred Journey'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Utility function for difficulty display
function getDifficultyDisplay(difficulty: string) {
  switch (difficulty) {
    case 'gentle': return { text: 'Gentle', className: 'bg-[#a4b792]/20 text-[#7a8c6a]' };
    case 'moderate': return { text: 'Moderate', className: 'bg-amber-100 text-amber-800' };
    case 'deep': return { text: 'Deep Work', className: 'bg-purple-100 text-purple-800' };
    default: return { text: difficulty, className: 'bg-gray-100 text-gray-800' };
  }
}

// Helper function to render pathway icons
function getPathwayIcon(iconType: string, size: number) {
  switch (iconType) {
    case 'heart': return <HeartIcon size={size} color="sage" />;
    case 'journey': return <JourneyIcon size={size} color="sage" />;
    case 'settings': return <SettingsIcon size={size} color="sage" />;
    case 'seedling': return <SeedlingIcon size={size} color="sage" />;
    case 'breathe': return <BreatheIcon size={size} color="sage" />;
    default: return <PathwayIcon size={size} color="sage" />;
  }
}

// Helper function to render metric icons
function getMetricIcon(iconType: string, size: number) {
  switch (iconType) {
    case 'clock': return <ClockIcon size={size} color="sage" />;
    case 'pathway': return <PathwayIcon size={size} color="sage" />;
    case 'journey': return <JourneyIcon size={size} color="sage" />;
    case 'milestone': return <MilestoneIcon size={size} color="sage" achieved={false} />;
    default: return <PathwayIcon size={size} color="sage" />;
  }
}