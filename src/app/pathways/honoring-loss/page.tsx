'use client';
import Link from 'next/link';
import { useState } from 'react';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';

export default function HonoringLossPathway() {
  const [currentStage, setCurrentStage] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [candleLit, setCandleLit] = useState(false);
  const [memorialCreated, setMemorialCreated] = useState(false);

  const stages = [
    {
      title: "What Has Been Lost",
      icon: "🖤",
      challenge: "Grief begins with honesty about what is gone.",
      type: "recognition",
      exercises: [
        {
          prompt: "Name what you have lost. It might be a person, a dream, a version of yourself, a time in your life. Don't minimize it.",
          placeholder: "I have lost... and it matters because..."
        },
        {
          prompt: "How long have you been carrying this loss? What has it cost you to hold it alone?",
          placeholder: "I've been carrying this for... It has cost me..."
        }
      ]
    },
    {
      title: "The Weight of What Was",
      icon: "⚖️",
      challenge: "Before we can release, we must fully feel the weight.",
      type: "acknowledgment",
      exercises: [
        {
          prompt: "Write a letter to what you've lost. Tell it what it meant to you. Don't hold back.",
          placeholder: "Dear [what I lost], You were... You gave me... I miss..."
        },
        {
          prompt: "What did this loss teach you about love? About impermanence? About your own strength?",
          placeholder: "This loss taught me that love means... that nothing lasts... that I am..."
        }
      ]
    },
    {
      title: "Mapping Your Grief",
      icon: "🗺️",
      challenge: "Grief is not linear. It's a landscape with many territories.",
      type: "exploration", 
      exercises: [
        {
          prompt: "Where in your body do you carry this grief? Describe its texture, temperature, color.",
          placeholder: "My grief lives in my... It feels like... It looks like..."
        },
        {
          prompt: "When does your grief visit you most? What triggers its presence?",
          placeholder: "My grief comes when... It's triggered by..."
        }
      ]
    },
    {
      title: "Creating Sacred Memorial",
      icon: "🕯️",
      challenge: "What deserves honor must be given a sacred place.",
      type: "ritual",
      exercises: [
        {
          prompt: "Design a memorial for your loss. It could be physical or imaginary. What would honor what's gone?",
          placeholder: "My memorial would include... It would be located... It would represent..."
        },
        {
          prompt: "Light a candle (real or imaginary) for your loss. Speak to it. What do you want to say?",
          interactive: true,
          placeholder: "As I light this candle, I want to say..."
        }
      ]
    },
    {
      title: "Carrying Forward",
      icon: "🌅",
      challenge: "How do you carry what you've lost in a way that honors both death and life?",
      type: "integration",
      exercises: [
        {
          prompt: "What part of what you lost do you want to carry forward? How will you keep it alive in your life?",
          placeholder: "I want to carry forward their/its... I will honor this by..."
        },
        {
          prompt: "Write a promise to yourself about how you will live differently because of this loss.",
          placeholder: "Because of this loss, I promise to... I will no longer... I will always..."
        }
      ]
    }
  ];

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

  const lightCandle = () => {
    setCandleLit(true);
    setTimeout(() => setCandleLit(false), 30000); // Candle stays lit for 30 seconds
  };

  const createMemorial = () => {
    setMemorialCreated(true);
  };

  const currentStageData = stages[currentStage];

  return (
    <SanctuaryLayout noPadding>
      <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/pathways" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Honoring Loss</h1>
        </div>
        <p className="text-white/70 text-sm font-light">Sacred space for grief and remembrance</p>
        
        <div className="mt-4 flex gap-2">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                completed[index] 
                  ? 'bg-[#E8C56D]' 
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
          <p className="text-green-200 text-sm italic">"{currentStageData.challenge}"</p>
        </div>

        <div className="space-y-6">
          {currentStageData.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-white/10 backdrop-blur-md border border-green-300/20 rounded-2xl p-6">
              <h3 className="text-white text-lg font-light mb-4">{exercise.prompt}</h3>
              
              {exercise.interactive && currentStage === 3 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <button
                      onClick={lightCandle}
                      className={`px-8 py-4 rounded-full text-lg transition-all duration-500 ${
                        candleLit 
                          ? 'bg-[#E8C56D]/40 text-white shadow-lg shadow-[#E8C56D]/20' 
                          : 'bg-[#E8C56D]/20 hover:bg-[#E8C56D]/30 text-white'
                      }`}
                    >
                      {candleLit ? '🕯️ Candle is Lit' : 'Light Memorial Candle'}
                    </button>
                    
                    {candleLit && (
                      <div className="mt-6 p-6 bg-[#E8C56D]/10 rounded-xl border border-[#E8C56D]/20">
                        <div className="text-4xl mb-4 animate-pulse">🕯️</div>
                        <p className="text-[#E8C56D] text-sm">
                          Your candle burns in honor of your loss. Speak to the flame.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <textarea
                    value={responses[currentStage * 2 + exerciseIndex] || ''}
                    onChange={(e) => handleResponse(currentStage * 2 + exerciseIndex, e.target.value)}
                    placeholder={exercise.placeholder}
                    className="w-full h-32 bg-white/10 border border-green-300/20 rounded-xl p-4 text-white placeholder-green-200/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8C56D]/50"
                  />
                </div>
              ) : (
                <textarea
                  value={responses[currentStage * 2 + exerciseIndex] || ''}
                  onChange={(e) => handleResponse(currentStage * 2 + exerciseIndex, e.target.value)}
                  placeholder={exercise.placeholder}
                  className="w-full h-40 bg-white/10 border border-green-300/20 rounded-xl p-4 text-white placeholder-green-200/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8C56D]/50 leading-relaxed"
                />
              )}
            </div>
          ))}
        </div>

        {/* Special Memorial Creation for Stage 3 */}
        {currentStage === 3 && !memorialCreated && (
          <div className="mt-6 text-center">
            <button
              onClick={createMemorial}
              className="px-6 py-3 bg-[#E8C56D]/20 hover:bg-[#E8C56D]/30 rounded-full text-white text-sm transition-all duration-300"
            >
              Create Your Memorial
            </button>
          </div>
        )}

        {memorialCreated && currentStage === 3 && (
          <div className="mt-6 p-6 bg-[#E8C56D]/10 rounded-2xl border border-[#E8C56D]/20 text-center">
            <div className="text-3xl mb-4">🏛️</div>
            <p className="text-[#E8C56D] text-sm">
              Your memorial has been created. This sacred space will always honor what you've lost.
            </p>
          </div>
        )}

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
                  ? 'bg-[#E8C56D]/30 text-white cursor-default'
                  : 'bg-white/20 hover:bg-[#E8C56D]/30 text-white'
              }`}
            >
              {completed[currentStage] ? '✓ Honored' : 'Complete Stage'}
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
        <p className="text-white/40 text-xs text-center tracking-wide">
          Grief can feel overwhelming · Crisis support: 988 · You don't have to carry this alone
        </p>
      </div>
      </div>
    </SanctuaryLayout>
  );
}
