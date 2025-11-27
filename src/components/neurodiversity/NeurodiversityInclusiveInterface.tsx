/**
 * ALCHM Neurodiversity-Inclusive Interface System
 * 
 * Philosophy: "Neurodivergent brains aren't broken or deficient - they're beautifully different.
 * True inclusion means designing for different processing styles, sensory needs, and 
 * cognitive patterns from the ground up, not as an afterthought."
 * 
 * This system provides:
 * - Sensory-friendly interface options (reduced motion, gentle colors, quiet modes)
 * - Multiple processing pathways (visual, auditory, kinesthetic, text-based)
 * - Executive function support (timers, reminders, task breaking)
 * - Attention diversity accommodation (focus modes, distraction reduction)
 * - Communication style flexibility (direct, visual, structured options)
 * - Cognitive load management (chunking, pacing, complexity control)
 */

'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface NeurodiversityProfile {
  conditions?: string[]; // ADHD, autism, dyslexia, etc.
  sensoryNeeds?: {
    motionSensitivity: 'low' | 'medium' | 'high';
    colorSensitivity: 'low' | 'medium' | 'high';
    soundSensitivity: 'low' | 'medium' | 'high';
    lightSensitivity: 'low' | 'medium' | 'high';
  };
  processingPreferences?: {
    visualProcessing: boolean;
    auditoryProcessing: boolean;
    kinestheticProcessing: boolean;
    textBasedProcessing: boolean;
  };
  attentionNeeds?: {
    focusTimePreference: 'short' | 'medium' | 'long' | 'flexible';
    distractionTolerance: 'low' | 'medium' | 'high';
    taskSwitchingDifficulty: 'easy' | 'moderate' | 'difficult';
  };
  executiveFunctionSupport?: {
    timeManagement: boolean;
    taskBreaking: boolean;
    reminderSystems: boolean;
    organizationHelp: boolean;
  };
  communicationStyle?: 'direct' | 'visual' | 'structured' | 'flexible';
}

interface NeurodiversityContextType {
  profile: NeurodiversityProfile;
  adaptiveSettings: AdaptiveSettings;
  updateSettings: (settings: Partial<AdaptiveSettings>) => void;
}

interface AdaptiveSettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
  simplifiedInterface: boolean;
  focusMode: boolean;
  quietMode: boolean;
  structuredNavigation: boolean;
  visualCues: boolean;
  timerEnabled: boolean;
  breakReminders: boolean;
}

const NeurodiversityContext = createContext<NeurodiversityContextType | null>(null);

export function NeurodiversityProvider({ 
  children, 
  initialProfile 
}: { 
  children: React.ReactNode; 
  initialProfile: NeurodiversityProfile; 
}) {
  const [profile] = useState(initialProfile);
  const [adaptiveSettings, setAdaptiveSettings] = useState<AdaptiveSettings>({
    reducedMotion: initialProfile.sensoryNeeds?.motionSensitivity === 'high' || false,
    highContrast: initialProfile.sensoryNeeds?.lightSensitivity === 'high' || false,
    largerText: false,
    simplifiedInterface: false,
    focusMode: initialProfile.attentionNeeds?.distractionTolerance === 'low' || false,
    quietMode: initialProfile.sensoryNeeds?.soundSensitivity === 'high' || false,
    structuredNavigation: initialProfile.communicationStyle === 'structured' || false,
    visualCues: initialProfile.processingPreferences?.visualProcessing || false,
    timerEnabled: initialProfile.executiveFunctionSupport?.timeManagement || false,
    breakReminders: initialProfile.attentionNeeds?.focusTimePreference === 'short' || false
  });

  const updateSettings = (newSettings: Partial<AdaptiveSettings>) => {
    setAdaptiveSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <NeurodiversityContext.Provider value={{ profile, adaptiveSettings, updateSettings }}>
      <div 
        className={`neurodiversity-adaptive-interface ${
          adaptiveSettings.reducedMotion ? 'reduced-motion' : ''
        } ${
          adaptiveSettings.highContrast ? 'high-contrast' : ''
        } ${
          adaptiveSettings.largerText ? 'larger-text' : ''
        } ${
          adaptiveSettings.simplifiedInterface ? 'simplified-interface' : ''
        } ${
          adaptiveSettings.focusMode ? 'focus-mode' : ''
        }`}
      >
        {children}
      </div>
    </NeurodiversityContext.Provider>
  );
}

export function useNeurodiversity() {
  const context = useContext(NeurodiversityContext);
  if (!context) {
    throw new Error('useNeurodiversity must be used within NeurodiversityProvider');
  }
  return context;
}

/**
 * Adaptive Interface Controls
 * Quick access to personalization options
 */
export function AdaptiveInterfaceControls() {
  const { profile, adaptiveSettings, updateSettings } = useNeurodiversity();
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setShowControls(!showControls)}
        className="mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        aria-label="Accessibility Controls"
      >
        ⚙️
      </Button>
      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl p-4 w-64 border"
          >
            <h3 className="font-medium text-blue-800 mb-4">Adaptive Controls</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveSettings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Reduce Motion</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveSettings.highContrast}
                  onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">High Contrast</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveSettings.largerText}
                  onChange={(e) => updateSettings({ largerText: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Larger Text</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveSettings.simplifiedInterface}
                  onChange={(e) => updateSettings({ simplifiedInterface: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Simplified Interface</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveSettings.focusMode}
                  onChange={(e) => updateSettings({ focusMode: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Focus Mode</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveSettings.timerEnabled}
                  onChange={(e) => updateSettings({ timerEnabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Writing Timer</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Sensory-Friendly Journal Interface
 */
export function SensoryFriendlyJournal({ 
  onSensoryOverload, 
  onJournalSubmit 
}: { 
  onSensoryOverload?: () => void;
  onJournalSubmit?: (content: string) => void;
}) {
  const { profile, adaptiveSettings } = useNeurodiversity();
  const [journalContent, setJournalContent] = useState('');
  const [writingTimer, setWritingTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sensoryOverloadDetected, setSensoryOverloadDetected] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && adaptiveSettings.timerEnabled) {
      interval = setInterval(() => {
        setWritingTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, adaptiveSettings.timerEnabled]);

  // Break reminder system
  useEffect(() => {
    if (adaptiveSettings.breakReminders && writingTimer > 0 && writingTimer % 300 === 0) { // Every 5 minutes
      setSensoryOverloadDetected(true);
      setTimeout(() => setSensoryOverloadDetected(false), 3000);
    }
  }, [writingTimer, adaptiveSettings.breakReminders]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProcessingModeInterface = () => {
    if (!profile.processingPreferences) return null;

    const { visualProcessing, textBasedProcessing } = profile.processingPreferences;
    
    if (visualProcessing) {
      return (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">📊 Visual Processing Mode</h4>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-3 bg-red-100 rounded cursor-pointer hover:bg-red-200">
              <div className="text-2xl mb-1">😰</div>
              <div className="text-xs">Overwhelmed</div>
            </div>
            <div className="text-center p-3 bg-yellow-100 rounded cursor-pointer hover:bg-yellow-200">
              <div className="text-2xl mb-1">😐</div>
              <div className="text-xs">Neutral</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded cursor-pointer hover:bg-green-200">
              <div className="text-2xl mb-1">😊</div>
              <div className="text-xs">Good</div>
            </div>
          </div>
          <p className="text-sm text-blue-700">Click emotions above to start writing about them.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className={`p-6 ${adaptiveSettings.quietMode ? 'bg-gray-50' : 'bg-gradient-to-br from-purple-50 to-blue-50'} ${adaptiveSettings.highContrast ? 'border-4 border-black' : 'border-purple-200'}`}>
      {/* Timer and Status */}
      {adaptiveSettings.timerEnabled && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono">{formatTimer(writingTimer)}</span>
            <Button
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isTimerRunning ? '⏸️ Pause' : '▶️ Start'}
            </Button>
          </div>
          
          {profile.conditions?.includes('ADHD') && (
            <div className="text-sm text-gray-600">
              🎯 Focus time: {Math.floor(writingTimer / 60)} min
            </div>
          )}
        </div>
      )}

      {/* Sensory Overload Warning */}
      <AnimatePresence>
        {sensoryOverloadDetected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-yellow-800">Break Time Suggestion</p>
                <p className="text-sm text-yellow-700">
                  You've been writing for a while. Consider taking a short break to prevent sensory overload.
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={() => setSensoryOverloadDetected(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Take Break
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSensoryOverloadDetected(false)}
                className="border-yellow-400 text-yellow-800"
              >
                Keep Writing
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Mode Interface */}
      {getProcessingModeInterface()}

      {/* Executive Function Support */}
      {profile.executiveFunctionSupport?.taskBreaking && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h4 className="font-medium text-green-800 mb-2">📝 Writing Steps</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">1. Choose a topic or emotion</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">2. Write 2-3 sentences about it</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">3. Describe how you feel in your body</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">4. Write what you need right now</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Writing Interface */}
      <div className="space-y-4">
        {profile.communicationStyle === 'structured' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-3 bg-white">
              <h5 className="font-medium text-purple-800 mb-2">What happened?</h5>
              <p className="text-sm text-purple-600">Describe the situation or event</p>
            </Card>
            <Card className="p-3 bg-white">
              <h5 className="font-medium text-purple-800 mb-2">How do you feel?</h5>
              <p className="text-sm text-purple-600">Name emotions and body sensations</p>
            </Card>
            <Card className="p-3 bg-white">
              <h5 className="font-medium text-purple-800 mb-2">What do you need?</h5>
              <p className="text-sm text-purple-600">Support, rest, action, etc.</p>
            </Card>
          </div>
        )}

        <textarea
          value={journalContent}
          onChange={(e) => {
            setJournalContent(e.target.value);
            if (!isTimerRunning && e.target.value && adaptiveSettings.timerEnabled) {
              setIsTimerRunning(true);
            }
          }}
          placeholder={
            profile.communicationStyle === 'direct' 
              ? "What's on your mind today?" 
              : profile.communicationStyle === 'structured'
              ? "Use the prompts above to structure your thoughts..."
              : "Write whatever feels right for you today..."
          }
          className={`w-full min-h-[200px] p-4 rounded-lg border-2 resize-none focus:outline-none focus:ring-2 ${
            adaptiveSettings.highContrast 
              ? 'border-black bg-white text-black text-lg' 
              : 'border-purple-300 bg-white focus:border-purple-500 focus:ring-purple-200'
          } ${
            adaptiveSettings.largerText ? 'text-lg' : 'text-base'
          }`}
          style={{
            lineHeight: adaptiveSettings.largerText ? '1.8' : '1.6',
            fontFamily: profile.conditions?.includes('dyslexia') ? 'OpenDyslexic, monospace' : 'inherit'
          }}
        />

        {/* Word count and progress indicators */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{journalContent.split(/\s+/).filter(word => word.length > 0).length} words</span>
          
          {profile.executiveFunctionSupport?.organizationHelp && (
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                📝 {journalContent.length > 50 ? 'Good progress!' : 'Getting started...'}
              </span>
              {journalContent.length > 200 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  ✅ Detailed entry
                </span>
              )}
            </div>
          )}
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => onJournalSubmit?.(journalContent)}
            disabled={journalContent.trim().length < 10}
            className={`${
              adaptiveSettings.highContrast 
                ? 'bg-black text-white hover:bg-gray-800 border-2 border-black' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            💾 Save Entry
          </Button>
          
          {profile.executiveFunctionSupport?.reminderSystems && (
            <Button
              variant="outline"
              className={adaptiveSettings.highContrast ? 'border-2 border-black' : ''}
            >
              🔔 Remind Me Tomorrow
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Neurodivergent-Specific Affirmations
 */
export function NeurodivergentAffirmations({ profile }: { profile: NeurodiversityProfile }) {
  const [currentAffirmation, setCurrentAffirmation] = useState<string | null>(null);
  
  const affirmations = {
    ADHD: [
      "Your creative, non-linear thinking is a gift that the world needs.",
      "Your hyperfocus on things you care about is a superpower.",
      "Your brain's need for movement and stimulation is not a flaw to fix.",
      "Your ability to see connections others miss is valuable.",
      "Your sensitivity to your environment gives you unique insights."
    ],
    autism: [
      "Your different way of processing the world brings unique perspectives.",
      "Your need for routine and predictability is valid and healthy.",
      "Your intense interests and deep knowledge are strengths, not obsessions.",
      "Your direct communication style is refreshing and honest.",
      "Your sensory experiences are real and deserve accommodation."
    ],
    dyslexia: [
      "Your brain processes information in beautifully different ways.",
      "Your creative problem-solving abilities are remarkable.",
      "Your persistence in learning shows incredible strength.",
      "Your visual-spatial thinking is a powerful gift.",
      "Your struggles with reading don't define your intelligence."
    ],
    general: [
      "Your neurodivergent brain is not broken - it's wonderfully different.",
      "You don't need to mask or camouflage who you are.",
      "Your needs for accommodation are valid and reasonable.",
      "Your way of thinking contributes unique value to the world.",
      "You deserve spaces that work with your brain, not against it."
    ]
  };

  const getRelevantAffirmations = () => {
    let relevantAffirmations: string[] = [];
    
    if (profile.conditions) {
      for (const condition of profile.conditions) {
        const conditionKey = condition.toLowerCase() as keyof typeof affirmations;
        if (affirmations[conditionKey]) {
          relevantAffirmations.push(...affirmations[conditionKey]);
        }
      }
    }
    
    // Always include general affirmations
    relevantAffirmations.push(...affirmations.general);
    
    return relevantAffirmations;
  };

  const generateAffirmation = () => {
    const relevantAffirmations = getRelevantAffirmations();
    const randomAffirmation = relevantAffirmations[Math.floor(Math.random() * relevantAffirmations.length)];
    setCurrentAffirmation(randomAffirmation);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h3 className="text-lg font-medium text-blue-800">
            Neurodivergent Affirmation
          </h3>
        </div>
        <Button
          onClick={generateAffirmation}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          New Affirmation
        </Button>
      </div>
      
      {currentAffirmation && (
        <motion.div
          key={currentAffirmation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-100 rounded-lg p-4"
        >
          <p className="text-blue-900 font-medium text-center">
            {currentAffirmation}
          </p>
        </motion.div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-700">
          Your neurodivergent brain is perfectly designed for you. 
          The world needs your unique way of thinking and being.
        </p>
      </div>
    </Card>
  );
}

/**
 * Executive Function Support Tools
 */
export function ExecutiveFunctionSupport({ profile }: { profile: NeurodiversityProfile }) {
  const [tasks, setTasks] = useState<Array<{id: number, text: string, completed: boolean}>>([]);
  const [newTask, setNewTask] = useState('');
  const [pomodoroTimer, setPomodoroTimer] = useState(25 * 60); // 25 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && pomodoroTimer > 0) {
      interval = setInterval(() => {
        setPomodoroTimer(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTimer === 0) {
      setIsTimerRunning(false);
      // Play notification sound or show notification
      alert("Break time! You've completed a focus session.");
      setPomodoroTimer(25 * 60); // Reset timer
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTimer]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prev => [...prev, {
        id: Date.now(),
        text: newTask,
        completed: false
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!profile.executiveFunctionSupport?.timeManagement && !profile.executiveFunctionSupport?.taskBreaking) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
      <h3 className="text-lg font-medium text-green-800 mb-4">
        🎯 Executive Function Support
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Management */}
        {profile.executiveFunctionSupport?.taskBreaking && (
          <div>
            <h4 className="font-medium text-green-800 mb-3">Task Breakdown</h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Break down a big task..."
                  className="flex-1 p-2 border rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Add
                </Button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="rounded"
                    />
                    <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Pomodoro Timer */}
        {profile.executiveFunctionSupport?.timeManagement && (
          <div>
            <h4 className="font-medium text-green-800 mb-3">Focus Timer</h4>
            <div className="text-center">
              <div className="text-3xl font-mono text-green-800 mb-4">
                {formatTime(pomodoroTimer)}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {isTimerRunning ? '⏸️ Pause' : '▶️ Start'}
                </Button>
                <Button
                  onClick={() => {
                    setPomodoroTimer(25 * 60);
                    setIsTimerRunning(false);
                  }}
                  variant="outline"
                  className="border-green-400 text-green-800"
                >
                  🔄 Reset
                </Button>
              </div>
              <p className="text-xs text-green-600 mt-2">
                25 min focus / 5 min break cycle
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}