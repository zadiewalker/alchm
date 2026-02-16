'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';

export default function EnoughAsYouArePathway() {
  const [currentStage, setCurrentStage] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [selfCompassionScore, setSelfCompassionScore] = useState(5);
  const [affirmationShown, setAffirmationShown] = useState('');
  const [mirrorWork, setMirrorWork] = useState(false);

  const affirmations = [
    "I am enough exactly as I am right now",
    "My worth is not determined by my productivity",
    "I deserve love and belonging without conditions",
    "My struggles do not diminish my value",
    "I am learning and growing at my own pace",
    "My sensitivity is a strength, not a weakness",
    "I matter simply because I exist"
  ];

  const stages = [
    {
      title: "The Lie Detector",
      icon: "🔍",
      challenge: "First, we expose the lies you've been telling yourself about your worth.",
      type: "awareness",
      exercises: [
        {
          prompt: "Complete this sentence as many times as you can: 'I'm not enough because...' Write every cruel thing your mind tells you.",
          placeholder: "I'm not enough because I'm too sensitive, because I failed at..., because I don't have..."
        },
        {
          prompt: "Whose voice do you hear when you say these things? A parent? Society? A past partner? Name the source.",
          placeholder: "This voice sounds like... It comes from when... They used to say..."
        }
      ]
    },
    {
      title: "Evidence Court",
      icon: "⚖️",
      challenge: "Let's put your self-criticism on trial. What's the actual evidence?",
      type: "reframing",
      exercises: [
        {
          prompt: "Pick your harshest self-criticism. Now defend yourself like a lawyer. What evidence contradicts this belief?",
          placeholder: "The evidence against 'I'm not smart enough' is... Times I showed intelligence... People who value my mind..."
        },
        {
          prompt: "What would you tell a beloved friend who believed this about themselves? Write that letter to yourself.",
          placeholder: "My dear friend, if you told me you believed this about yourself, I would say..."
        }
      ]
    },
    {
      title: "Archaeological Dig",
      icon: "🏺",
      challenge: "Unearth the moments you first learned you might not be enough.",
      type: "healing",
      exercises: [
        {
          prompt: "When was the first time you remember feeling 'not enough'? You were a child then. Describe that moment with compassion.",
          placeholder: "I was about... years old when... I felt not enough because... That little person needed..."
        },
        {
          prompt: "What did that younger version of you need to hear? Write them a letter from your current self.",
          placeholder: "Dear little me, I wish I could tell you that you are... You don't need to... You are already..."
        }
      ]
    },
    {
      title: "Mirror Work Revolution",
      icon: "🪞",
      challenge: "Face yourself with radical acceptance. This is where transformation happens.",
      type: "practice",
      exercises: [
        {
          prompt: "Look in a mirror (or imagine looking). Say 'I love you exactly as you are' to your reflection. What comes up?",
          interactive: true,
          placeholder: "When I say this to myself, I feel... The resistance shows up as... But I also notice..."
        },
        {
          prompt: "List 10 things you genuinely appreciate about yourself. Include your struggles - they show your humanity.",
          placeholder: "I appreciate my ability to... I'm grateful for my capacity to feel... I admire how I..."
        }
      ]
    },
    {
      title: "Living As Enough",
      icon: "👑",
      challenge: "How do you live when you truly believe you're enough?",
      type: "integration",
      exercises: [
        {
          prompt: "If you deeply knew you were enough, what would you do differently? How would you treat yourself?",
          placeholder: "If I knew I was enough, I would stop... I would start... I would treat myself..."
        },
        {
          prompt: "Create a daily 'Enough Practice' - one small way you'll remind yourself of your worth each day.",
          placeholder: "My daily practice will be... Every morning I'll... When I doubt myself, I'll..."
        }
      ]
    }
  ];

  const showRandomAffirmation = () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setAffirmationShown(randomAffirmation);
    setTimeout(() => setAffirmationShown(''), 5000);
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

  const startMirrorWork = () => {
    setMirrorWork(true);
    setTimeout(() => setMirrorWork(false), 15000);
  };

  const currentStageData = stages[currentStage];

  return (
    <SanctuaryLayout noPadding>
      <div className="min-h-screen bg-gradient-to-b from-[#B395D4] to-[#9A7AC7] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/pathways" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Enough as You Are</h1>
        </div>
        <p className="text-white/70 text-sm font-light">Radical self-acceptance and unconditional worth</p>
        
        {/* Self-compassion meter */}
        <div className="mt-4 mb-4">
          <p className="text-white/60 text-xs mb-2">How compassionate are you feeling toward yourself right now?</p>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                onClick={() => setSelfCompassionScore(i + 1)}
                className={`h-3 w-6 rounded cursor-pointer transition-all duration-300 ${
                  i < selfCompassionScore ? 'bg-[#E8C56D]' : 'bg-white/20'
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
          <p className="text-purple-200 text-sm italic">"{currentStageData.challenge}"</p>
        </div>

        {/* Random Affirmation Button */}
        <div className="text-center mb-6">
          <button
            onClick={showRandomAffirmation}
            className="px-6 py-2 bg-[#E8C56D]/20 hover:bg-[#E8C56D]/30 rounded-full text-white text-sm transition-all duration-300"
          >
            ✨ Get Affirmation
          </button>
          
          {affirmationShown && (
            <div className="mt-4 p-4 bg-[#E8C56D]/20 rounded-xl border border-[#E8C56D]/20">
              <p className="text-purple-100 text-lg font-light italic">"{affirmationShown}"</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {currentStageData.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-white/10 backdrop-blur-md border border-purple-300/20 rounded-2xl p-6">
              <h3 className="text-white text-lg font-light mb-4">{exercise.prompt}</h3>
              
              {exercise.interactive && currentStage === 3 ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <button
                      onClick={startMirrorWork}
                      className={`px-8 py-4 rounded-full text-lg transition-all duration-500 ${
                        mirrorWork 
                          ? 'bg-[#E8C56D]/40 text-white shadow-lg shadow-[#E8C56D]/20' 
                          : 'bg-purple-500/20 hover:bg-purple-500/30 text-white'
                      }`}
                    >
                      {mirrorWork ? '🪞 Looking with Love' : 'Begin Mirror Work'}
                    </button>
                    
                    {mirrorWork && (
                      <div className="mt-6 p-6 bg-[#E8C56D]/10 rounded-xl border border-[#E8C56D]/20">
                        <div className="text-4xl mb-4 animate-pulse">🪞</div>
                        <p className="text-[#E8C56D] text-sm mb-4">
                          Look at yourself with kindness. Say "I love you exactly as you are."
                        </p>
                        <div className="text-purple-200 text-lg italic animate-pulse">
                          "I love you exactly as you are"
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <textarea
                    value={responses[currentStage * 2 + exerciseIndex] || ''}
                    onChange={(e) => handleResponse(currentStage * 2 + exerciseIndex, e.target.value)}
                    placeholder={exercise.placeholder}
                    className="w-full h-32 bg-white/10 border border-purple-300/20 rounded-xl p-4 text-white placeholder-purple-200/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8C56D]/50"
                  />
                </div>
              ) : (
                <textarea
                  value={responses[currentStage * 2 + exerciseIndex] || ''}
                  onChange={(e) => handleResponse(currentStage * 2 + exerciseIndex, e.target.value)}
                  placeholder={exercise.placeholder}
                  className="w-full h-40 bg-white/10 border border-purple-300/20 rounded-xl p-4 text-white placeholder-purple-200/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#E8C56D]/50 leading-relaxed"
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
                  ? 'bg-[#E8C56D]/30 text-white cursor-default'
                  : 'bg-white/20 hover:bg-[#E8C56D]/30 text-white'
              }`}
            >
              {completed[currentStage] ? '✓ I Am Enough' : 'Complete Stage'}
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
          You are inherently valuable · Crisis support: 988 · Your worth is not up for debate
        </p>
      </div>
      </div>
    </SanctuaryLayout>
  );
}
