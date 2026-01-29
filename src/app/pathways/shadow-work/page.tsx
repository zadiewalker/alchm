'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function ShadowWorkPathway() {
  const [currentStage, setCurrentStage] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [shadowRevealed, setShadowRevealed] = useState(false);
  const [integrationLevel, setIntegrationLevel] = useState(0);

  const stages = [
    {
      title: "Meeting Your Shadow",
      icon: "🌑",
      challenge: "What you resist about others lives within you too.",
      type: "recognition",
      exercises: [
        {
          prompt: "Who triggers you most intensely? Describe them and what exactly makes your skin crawl about them.",
          placeholder: "The person who triggers me most is... What I can't stand about them is their... It makes me feel..."
        },
        {
          prompt: "Now the hard truth: How might you possess even a tiny seed of what you despise in them?",
          placeholder: "If I'm brutally honest, I also can be... I sometimes... I hide the part of me that..."
        }
      ]
    },
    {
      title: "Excavating the Disowned",
      icon: "⛏️",
      challenge: "What parts of yourself did you bury to be loved?",
      type: "archaeology",
      exercises: [
        {
          prompt: "What emotions, traits, or behaviors were not allowed in your family/culture? What got you rejected or punished?",
          placeholder: "Anger was not allowed... Being selfish was... Showing weakness meant... I learned to hide my..."
        },
        {
          prompt: "Where do these banished parts show up in your life now? When do they sneak out?",
          placeholder: "My hidden anger shows up when... My buried selfishness appears... My secret weakness emerges..."
        }
      ]
    },
    {
      title: "Dialogue with Darkness",
      icon: "🎭",
      challenge: "Your shadow has been trying to get your attention. What does it want to say?",
      type: "conversation",
      exercises: [
        {
          prompt: "Write a conversation with your shadow self. Let it speak first. What has it been trying to tell you?",
          placeholder: "Shadow: 'I've been trying to tell you that...' Me: 'I never realized...' Shadow: 'If you would just...'"
        },
        {
          prompt: "What gifts might your shadow possess? What power have you given away by rejecting these parts?",
          placeholder: "My anger could give me... My selfishness could protect... My darkness holds the power to..."
        }
      ]
    },
    {
      title: "The Shadow Dance",
      icon: "💃🏻",
      challenge: "Integration isn't elimination. It's learning to dance with all parts of yourself.",
      type: "integration",
      exercises: [
        {
          prompt: "How can you honor your shadow without letting it run your life? What healthy expression could it have?",
          placeholder: "I can honor my anger by... My selfishness can serve me by... My darkness can be channeled into..."
        },
        {
          prompt: "Write a peace treaty with your shadow. What are the terms of your new relationship?",
          placeholder: "Dear Shadow, I acknowledge that you... I agree to... In return, you will... We will work together to..."
        }
      ]
    },
    {
      title: "Wholeness Embodied", 
      icon: "🔮",
      challenge: "You are not just light. You are the full spectrum of human experience.",
      type: "embodiment",
      exercises: [
        {
          prompt: "How does it feel to own ALL of yourself - light and shadow? What becomes possible when you stop hiding?",
          placeholder: "When I accept all of me, I feel... I no longer need to... I become free to... What's possible is..."
        },
        {
          prompt: "Design a daily practice for staying connected to your wholeness. How will you honor both your light and shadow?",
          placeholder: "My wholeness practice includes... When I feel triggered, I will... To honor my shadow, I'll... To celebrate my light, I'll..."
        }
      ]
    }
  ];

  const shadowAspects = [
    "The part that gets jealous",
    "The one who wants to be special", 
    "The voice that judges others",
    "The desperate need for control",
    "The rage you're not allowed to feel",
    "The selfishness you've disowned",
    "The weakness you hide",
    "The darkness you fear in yourself"
  ];

  const revealShadow = () => {
    setShadowRevealed(true);
    setTimeout(() => setShadowRevealed(false), 10000);
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
    if (stageIndex === stages.length - 1) {
      setIntegrationLevel(10); // Full integration on final completion
    }
  };

  const currentStageData = stages[currentStage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/pathways" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Shadow Work</h1>
        </div>
        <p className="text-white/70 text-sm font-light">Integrating the hidden and disowned parts of yourself</p>
        
        {/* Integration level */}
        <div className="mt-4 mb-4">
          <p className="text-white/60 text-xs mb-2">Shadow integration level:</p>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-3 w-6 rounded transition-all duration-300 ${
                  i < integrationLevel ? 'bg-purple-500' : 'bg-white/20'
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
                  ? 'bg-purple-500' 
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
          <p className="text-gray-300 text-sm italic">"{currentStageData.challenge}"</p>
        </div>

        {/* Shadow Aspects Revealer for Stage 0 */}
        {currentStage === 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={revealShadow}
              className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-full text-white text-sm transition-all duration-300"
            >
              🔮 Reveal Shadow Aspects
            </button>
            
            {shadowRevealed && (
              <div className="mt-4 p-6 bg-purple-900/20 rounded-2xl border border-purple-500/20">
                <h4 className="text-purple-300 text-lg mb-4">Common Shadow Aspects:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {shadowAspects.map((aspect, index) => (
                    <div key={index} className="p-3 bg-black/40 rounded-lg text-purple-200 text-sm">
                      {aspect}
                    </div>
                  ))}
                </div>
                <p className="text-purple-300/70 text-xs mt-4 italic">
                  Which of these make you uncomfortable? That's where your shadow lives.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {currentStageData.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-white/5 backdrop-blur-md border border-gray-600/20 rounded-2xl p-6">
              <h3 className="text-white text-lg font-light mb-4">{exercise.prompt}</h3>
              
              <textarea
                value={responses[currentStage * 2 + exerciseIndex] || ''}
                onChange={(e) => handleResponse(currentStage * 2 + exerciseIndex, e.target.value)}
                placeholder={exercise.placeholder}
                className="w-full h-40 bg-black/40 border border-gray-500/20 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 leading-relaxed"
              />
            </div>
          ))}
        </div>

        {/* Special Integration Ritual for Final Stage */}
        {currentStage === stages.length - 1 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-2xl border border-purple-500/20 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-purple-200 text-lg mb-3">Integration Ritual</h4>
            <p className="text-purple-300 text-sm mb-4">
              Place one hand on your heart and one on your stomach. Breathe deeply and say:
            </p>
            <p className="text-purple-100 text-lg italic mb-4">
              "I am both light and shadow. I am whole."
            </p>
            <button
              onClick={() => setIntegrationLevel(Math.min(integrationLevel + 1, 10))}
              className="px-6 py-2 bg-purple-600/30 hover:bg-purple-600/40 rounded-full text-white text-sm transition-all duration-300"
            >
              Complete Integration
            </button>
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
                  ? 'bg-purple-500/30 text-white cursor-default'
                  : 'bg-white/20 hover:bg-purple-500/30 text-white'
              }`}
            >
              {completed[currentStage] ? '✓ Integrated' : 'Complete Stage'}
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
          Shadow work can bring up intense emotions · Crisis support: 988 · Integration takes time
        </p>
      </div>
    </div>
  );
}