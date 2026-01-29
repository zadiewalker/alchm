'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CalmTheStormPathway() {
  const [currentStage, setCurrentStage] = useState(0);
  const [stormLevel, setStormLevel] = useState(5);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);

  const stages = [
    {
      title: "Name Your Storm",
      icon: "🌪️",
      challenge: "You cannot calm what you cannot see clearly.",
      type: "awareness",
      exercises: [
        {
          prompt: "Right now, what does the storm inside you look like? Don't soften it - describe it raw and real.",
          placeholder: "It feels like a tornado of rage, like being underwater and can't breathe, like..."
        },
        {
          prompt: "Where do you feel this storm in your body? Point to it. What temperature, texture, movement?",
          placeholder: "It's hot in my chest, tight in my throat, like electricity in my hands..."
        }
      ]
    },
    {
      title: "Eye of the Storm Breathing",
      icon: "👁️",
      challenge: "In the center of every storm is perfect stillness.",
      type: "breathwork", 
      exercises: [
        {
          prompt: "We'll breathe together. 4 counts in, 4 counts hold, 6 counts out. Click to begin.",
          interactive: true
        },
        {
          prompt: "After 10 breaths, describe what shifted. Even tiny changes matter.",
          placeholder: "I noticed my shoulders dropped, the tightness loosened slightly..."
        }
      ]
    },
    {
      title: "Storm Triggers Map",
      icon: "🗺️",
      challenge: "Every storm has a pattern. Learning yours gives you power.",
      type: "pattern-recognition",
      exercises: [
        {
          prompt: "What are 3 situations that consistently trigger your inner storm? Be brutally honest.",
          placeholder: "When someone dismisses me, when I feel trapped, when I'm criticized..."
        },
        {
          prompt: "Choose one trigger. What's the story your mind tells you when it happens?",
          placeholder: "When this happens, I tell myself that..."
        }
      ]
    },
    {
      title: "Storm Alchemy",
      icon: "⚗️",
      challenge: "Transform the energy of your storm into something that serves you.",
      type: "transformation",
      exercises: [
        {
          prompt: "Your anger, your overwhelm, your chaos - what if it's trying to protect something precious? What?",
          placeholder: "My storm protects my need for safety, my right to be heard, my..."
        },
        {
          prompt: "Write a letter to your storm. Thank it for trying to protect you, then negotiate new terms.",
          placeholder: "Dear Storm, I know you're trying to keep me safe by... But what I really need is..."
        }
      ]
    },
    {
      title: "After the Storm Ritual",
      icon: "🌈",
      challenge: "Every storm passes. What will you plant in the cleared ground?",
      type: "integration",
      exercises: [
        {
          prompt: "Describe who you are when the storm has passed. What does your calm self know?",
          placeholder: "When I'm calm, I know that I am strong, that this will pass, that..."
        },
        {
          prompt: "Create a simple ritual for after your storms pass. What will help you reconnect with your calm self?",
          placeholder: "I will light a candle and say... I will touch my heart and remember..."
        }
      ]
    }
  ];

  // Breathing exercise logic
  useEffect(() => {
    if (isBreathing) {
      const interval = setInterval(() => {
        setBreathCount(prev => prev + 1);
        if (breathCount >= 10) {
          setIsBreathing(false);
        }
      }, 4000); // 4 second cycle
      return () => clearInterval(interval);
    }
  }, [isBreathing, breathCount]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);
  };

  const handleResponse = (exerciseIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[exerciseIndex] = value;
    setResponses(newResponses);
  };

  const markCompleted = (stageIndex: number) => {
    const newCompleted = [...completed];
    newCompleted[stageIndex] = true;
    setCompleted(newCompleted);
  };

  const currentStageData = stages[currentStage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/pathways" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Calm the Storm</h1>
        </div>
        <p className="text-white/70 text-sm font-light">Learning to navigate the tempests within</p>
        
        {/* Storm intensity meter */}
        <div className="mt-4 mb-4">
          <p className="text-white/60 text-xs mb-2">Current storm level:</p>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                onClick={() => setStormLevel(i + 1)}
                className={`h-3 w-6 rounded cursor-pointer transition-all duration-300 ${
                  i < stormLevel ? 'bg-red-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                completed[index] 
                  ? 'bg-blue-400' 
                  : index === currentStage 
                  ? 'bg-white/40' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Stage */}
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{currentStageData.icon}</div>
          <h2 className="text-xl text-white font-light mb-3">{currentStageData.title}</h2>
          <p className="text-white/60 text-sm italic">"{currentStageData.challenge}"</p>
        </div>

        <div className="space-y-6">
          {currentStageData.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-white text-lg font-light mb-4">{exercise.prompt}</h3>
              
              {exercise.interactive && currentStage === 1 ? (
                <div className="text-center">
                  <button
                    onClick={startBreathing}
                    disabled={isBreathing}
                    className={`px-8 py-4 rounded-full text-lg transition-all duration-300 ${
                      isBreathing 
                        ? 'bg-blue-500/30 text-white cursor-default' 
                        : 'bg-blue-500/20 hover:bg-blue-500/30 text-white'
                    }`}
                  >
                    {isBreathing ? `Breathing... ${breathCount}/10` : 'Begin Storm Breathing'}
                  </button>
                  {isBreathing && (
                    <div className="mt-6">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-blue-400/40"></div>
                      </div>
                      <p className="text-white/70 mt-4 text-sm">
                        Breathe in... hold... breathe out...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={responses[currentStage * 2 + exerciseIndex] || ''}
                  onChange={(e) => handleResponse(currentStage * 2 + exerciseIndex, e.target.value)}
                  placeholder={exercise.placeholder}
                  className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 mb-20">
          {currentStage > 0 && (
            <button
              onClick={() => setCurrentStage(currentStage - 1)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all duration-300"
            >
              Previous
            </button>
          )}
          <div className="flex gap-4 ml-auto">
            <button
              onClick={() => markCompleted(currentStage)}
              disabled={completed[currentStage]}
              className={`px-6 py-3 rounded-full text-sm transition-all duration-300 ${
                completed[currentStage]
                  ? 'bg-blue-400/30 text-white cursor-default'
                  : 'bg-white/20 hover:bg-blue-400/30 text-white'
              }`}
            >
              {completed[currentStage] ? '✓ Storm Calmed' : 'Complete Stage'}
            </button>
            {currentStage < stages.length - 1 && (
              <button
                onClick={() => setCurrentStage(currentStage + 1)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition-all duration-300"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Crisis Support */}
      <div className="pb-10">
        <p className="text-white/40 text-xs text-center tracking-wide">In crisis? Call 988 · You are not alone in this storm</p>
      </div>
    </div>
  );
}