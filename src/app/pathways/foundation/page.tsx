'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function FoundationPathway() {
  const [currentStage, setCurrentStage] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);

  const stages = [
    {
      title: "Ground Your Existence",
      icon: "🌱",
      challenge: "Before we heal what's broken, we must know what's solid.",
      exercises: [
        {
          type: "reflection",
          prompt: "Write down 5 physical sensations you can feel right now. Don't think - just notice and write.",
          placeholder: "The weight of my body on this chair, the air moving in my lungs..."
        },
        {
          type: "action",
          prompt: "Find one object in your space that represents safety. Hold it. What makes it feel safe?",
          placeholder: "This smooth stone feels cool and solid in my palm..."
        }
      ]
    },
    {
      title: "Map Your Support System", 
      icon: "🗺️",
      challenge: "Healing happens in relationship - even if that's just with yourself.",
      exercises: [
        {
          type: "reflection",
          prompt: "Who are 3 people you could call at 2am? If none exist, what would you need to create that safety?",
          placeholder: "I could call... OR I need to build connections by..."
        },
        {
          type: "commitment",
          prompt: "What is one small way you will nurture connection this week? Be specific.",
          placeholder: "I will text my friend Sarah on Wednesday to check in..."
        }
      ]
    },
    {
      title: "Establish Your Non-Negotiables",
      icon: "⚡",
      challenge: "What boundaries will you defend with your life?",
      exercises: [
        {
          type: "values",
          prompt: "Complete this: 'I will never again allow...' and 'I will always protect my...'",
          placeholder: "I will never again allow... I will always protect my..."
        },
        {
          type: "practice",
          prompt: "Write one boundary you need to set this week. How will you communicate it clearly and kindly?",
          placeholder: "I need to tell my partner that... I will say it like this..."
        }
      ]
    },
    {
      title: "Create Your Sacred Space",
      icon: "🏛️", 
      challenge: "Even warriors need a place to rest. Where is yours?",
      exercises: [
        {
          type: "creation",
          prompt: "Describe your ideal sanctuary - real or imagined. What makes it feel sacred to you?",
          placeholder: "In my sanctuary, I see... I feel... I hear..."
        },
        {
          type: "action",
          prompt: "Choose one element from your ideal sanctuary and create it in your real space today.",
          placeholder: "I will create this by..."
        }
      ]
    }
  ];

  const handleResponse = (stageIndex: number, exerciseIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[stageIndex * 2 + exerciseIndex] = value;
    setResponses(newResponses);
  };

  const markCompleted = (stageIndex: number) => {
    const newCompleted = [...completed];
    newCompleted[stageIndex] = true;
    setCompleted(newCompleted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/pathways" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Foundation</h1>
        </div>
        <p className="text-white/70 text-sm font-light">Building the bedrock of your healing journey</p>
        <div className="mt-4 flex gap-2">
          {stages.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                completed[index] 
                  ? 'bg-[#E8C56D]/70' 
                  : index === currentStage 
                  ? 'bg-white/40' 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Stage */}
      <div className="flex-1">
        {stages.map((stage, stageIndex) => (
          currentStage === stageIndex && (
            <div key={stageIndex} className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">{stage.icon}</div>
                <h2 className="text-xl text-white font-light mb-3">{stage.title}</h2>
                <p className="text-white/60 text-sm italic">"{stage.challenge}"</p>
              </div>

              <div className="space-y-6">
                {stage.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                    <h3 className="text-white text-lg font-light mb-4">{exercise.prompt}</h3>
                    <textarea
                      value={responses[stageIndex * 2 + exerciseIndex] || ''}
                      onChange={(e) => handleResponse(stageIndex, exerciseIndex, e.target.value)}
                      placeholder={exercise.placeholder}
                      className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8C56D]/50"
                    />
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
                        ? 'bg-[#E8C56D]/70 text-white cursor-default'
                        : 'bg-[#E8C56D] hover:bg-[#E8C56D]/80 text-white'
                    }`}
                  >
                    {completed[currentStage] ? '✓ Completed' : 'Mark Complete'}
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
          )
        ))}
      </div>

      {/* Crisis Support */}
      <div className="pb-10">
        <p className="text-white/40 text-xs text-center tracking-wide">Crisis support available · 988</p>
      </div>
    </div>
  );
}