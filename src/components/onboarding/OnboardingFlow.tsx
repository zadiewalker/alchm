'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AITransparency from '@/components/ui/AITransparency';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';

interface QuestionOption {
  id: string;
  text: string;
  pathwayWeights: {
    resilience: number;
    becoming: number;
    purpose: number;
    belonging: number;
  };
}

interface Question {
  id: string;
  question: string;
  description: string;
  options: QuestionOption[];
}

const ONBOARDING_QUESTIONS: Question[] = [
  {
    id: 'cultural_identity',
    question: "How would you describe your cultural and spiritual background?",
    description: "This helps us honor your healing traditions and offer culturally-responsive support",
    options: [
      {
        id: 'indigenous_connected',
        text: "I connect with Indigenous wisdom and land-based healing",
        pathwayWeights: { resilience: 2, becoming: 2, purpose: 2, belonging: 2 }
      },
      {
        id: 'african_diaspora',
        text: "I draw from African or African diaspora traditions (Ubuntu, ancestral wisdom)",
        pathwayWeights: { resilience: 2, becoming: 1, purpose: 2, belonging: 3 }
      },
      {
        id: 'asian_traditions',
        text: "I'm influenced by Asian philosophies (Buddhism, Confucianism, Hindu traditions)",
        pathwayWeights: { resilience: 2, becoming: 3, purpose: 3, purpose: 1, belonging: 2 }
      },
      {
        id: 'latin_american',
        text: "I connect with Latin American or Latinx healing traditions",
        pathwayWeights: { resilience: 2, becoming: 2, purpose: 2, belonging: 3 }
      },
      {
        id: 'middle_eastern_north_african',
        text: "I draw from Middle Eastern or North African wisdom traditions",
        pathwayWeights: { resilience: 2, becoming: 2, purpose: 3, belonging: 2 }
      },
      {
        id: 'multicultural_blend',
        text: "I hold multiple cultural identities and draw from various traditions",
        pathwayWeights: { resilience: 2, becoming: 3, purpose: 2, belonging: 2 }
      },
      {
        id: 'western_secular',
        text: "I primarily connect with Western secular approaches to wellness",
        pathwayWeights: { resilience: 2, becoming: 2, purpose: 2, belonging: 1 }
      },
      {
        id: 'spiritual_eclectic',
        text: "I create my own spiritual practice from various sources",
        pathwayWeights: { resilience: 2, becoming: 3, purpose: 3, belonging: 1 }
      }
    ]
  },
  {
    id: 'healing_approach',
    question: "What approaches to healing and growth resonate most with you?",
    description: "Understanding your preferred healing modalities helps us offer relevant support",
    options: [
      {
        id: 'community_centered',
        text: "Community-centered healing - I heal best in relationship with others",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 2, belonging: 4 }
      },
      {
        id: 'somatic_body_based',
        text: "Body-based practices - movement, breathwork, somatic experiencing",
        pathwayWeights: { resilience: 3, becoming: 2, purpose: 1, belonging: 1 }
      },
      {
        id: 'ritual_ceremonial',
        text: "Ritual and ceremony - honoring transitions and sacred practices",
        pathwayWeights: { resilience: 2, becoming: 3, purpose: 3, belonging: 2 }
      },
      {
        id: 'storytelling_narrative',
        text: "Storytelling and narrative - healing through sharing and witnessing",
        pathwayWeights: { resilience: 2, becoming: 2, purpose: 2, belonging: 3 }
      },
      {
        id: 'analytical_cognitive',
        text: "Analytical approaches - understanding patterns and developing insights",
        pathwayWeights: { resilience: 2, becoming: 3, purpose: 2, belonging: 1 }
      },
      {
        id: 'creative_expressive',
        text: "Creative expression - art, music, poetry as pathways to healing",
        pathwayWeights: { resilience: 2, becoming: 3, purpose: 2, belonging: 2 }
      }
    ]
  },
  {
    id: 'current_challenge',
    question: "What's your biggest challenge right now?",
    description: "Understanding where you are helps us recommend the most helpful starting point",
    options: [
      {
        id: 'overwhelmed',
        text: "I feel overwhelmed and need to build strength",
        pathwayWeights: { resilience: 3, becoming: 1, purpose: 1, belonging: 1 }
      },
      {
        id: 'identity',
        text: "I'm questioning who I am and who I want to become",
        pathwayWeights: { resilience: 1, becoming: 3, purpose: 1, belonging: 1 }
      },
      {
        id: 'direction',
        text: "I feel lost and need to find my purpose",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 3, belonging: 1 }
      },
      {
        id: 'connection',
        text: "I feel alone and want to find my community",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 1, belonging: 3 }
      }
    ]
  },
  {
    id: 'motivation',
    question: "What motivates you to grow?",
    description: "Your motivation shapes which pathway will resonate most deeply",
    options: [
      {
        id: 'survive_thrive',
        text: "I want to not just survive, but thrive",
        pathwayWeights: { resilience: 2, becoming: 2, purpose: 1, belonging: 1 }
      },
      {
        id: 'authentic_self',
        text: "I want to become my most authentic self",
        pathwayWeights: { resilience: 1, becoming: 3, purpose: 1, belonging: 1 }
      },
      {
        id: 'make_difference',
        text: "I want to make a meaningful difference",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 3, belonging: 1 }
      },
      {
        id: 'find_tribe',
        text: "I want to find where I truly belong",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 1, belonging: 3 }
      }
    ]
  },
  {
    id: 'reflection_style',
    question: "How do you prefer to reflect and grow?",
    description: "Different pathways use different approaches to healing and growth",
    options: [
      {
        id: 'strength_focused',
        text: "Looking at what I've overcome and building on strengths",
        pathwayWeights: { resilience: 3, becoming: 1, purpose: 1, belonging: 1 }
      },
      {
        id: 'exploration',
        text: "Exploring different parts of myself and experimenting",
        pathwayWeights: { resilience: 1, becoming: 3, purpose: 1, belonging: 1 }
      },
      {
        id: 'vision_oriented',
        text: "Connecting with my values and envisioning my impact",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 3, belonging: 1 }
      },
      {
        id: 'connection_based',
        text: "Understanding myself through relationships and community",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 1, belonging: 3 }
      }
    ]
  },
  {
    id: 'current_state',
    question: "Where are you in your journey right now?",
    description: "This helps us understand what kind of support would be most helpful",
    options: [
      {
        id: 'rebuilding',
        text: "Rebuilding after a difficult time",
        pathwayWeights: { resilience: 3, becoming: 2, purpose: 1, belonging: 1 }
      },
      {
        id: 'transitioning',
        text: "In a major life transition or change",
        pathwayWeights: { resilience: 1, becoming: 3, purpose: 2, belonging: 1 }
      },
      {
        id: 'searching',
        text: "Searching for meaning and direction",
        pathwayWeights: { resilience: 1, becoming: 2, purpose: 3, belonging: 1 }
      },
      {
        id: 'isolated',
        text: "Feeling disconnected from others",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 1, belonging: 3 }
      }
    ]
  },
  {
    id: 'support_preference',
    question: "What kind of support feels most helpful to you?",
    description: "Different pathways offer different types of emotional and practical support",
    options: [
      {
        id: 'empowerment',
        text: "Reminders of my strength and capability",
        pathwayWeights: { resilience: 3, becoming: 1, purpose: 1, belonging: 1 }
      },
      {
        id: 'permission',
        text: "Permission to explore and change",
        pathwayWeights: { resilience: 1, becoming: 3, purpose: 1, belonging: 1 }
      },
      {
        id: 'clarity',
        text: "Clarity about what matters most to me",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 3, belonging: 1 }
      },
      {
        id: 'acceptance',
        text: "Acceptance and understanding from others",
        pathwayWeights: { resilience: 1, becoming: 1, purpose: 1, belonging: 3 }
      }
    ]
  }
];

const PATHWAY_DESCRIPTIONS = {
  resilience: {
    title: "Resilience",
    subtitle: "Your Strength Story",
    description: "Discover the power you already carry. This pathway helps you recognize your inherent resilience, understand how you've survived challenges, and build on the strength that lives in your bones. We honor both individual strength and ancestral wisdom passed down through generations.",
    benefits: ["Recognize your existing strengths", "Process difficult experiences", "Build confidence for future challenges", "Connect with ancestral wisdom", "Honor survival strategies from your culture", "Transform trauma into medicine"],
    color: "bg-gradient-to-r from-amber-500 to-orange-500"
  },
  becoming: {
    title: "Becoming",
    subtitle: "Your Evolution Journey", 
    description: "Embrace the art of transformation. This pathway supports you in shedding old stories, exploring new possibilities, and stepping into the fullest expression of who you're meant to be.",
    benefits: ["Explore your authentic identity", "Release limiting beliefs", "Navigate life transitions", "Embrace personal growth"],
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  purpose: {
    title: "Purpose",
    subtitle: "Your Meaning Quest",
    description: "Discover what sets your soul on fire. This pathway helps you connect with your deepest values, understand your unique gifts, and find ways to contribute meaningfully to the world.",
    benefits: ["Clarify your core values", "Discover your unique gifts", "Find meaningful direction", "Create positive impact"],
    color: "bg-gradient-to-r from-blue-500 to-indigo-500"
  },
  belonging: {
    title: "Belonging", 
    subtitle: "Your Connection Circle",
    description: "Find your people and your place. This pathway honors both chosen family and cultural roots, helping you navigate multiple identities and create spaces where all parts of you can be welcomed and celebrated.",
    benefits: ["Build authentic relationships", "Find your community", "Practice healthy boundaries", "Create spaces of acceptance", "Navigate cultural code-switching", "Honor both roots and chosen family"],
    color: "bg-gradient-to-r from-green-500 to-teal-500"
  }
};

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pathwayScores, setPathwayScores] = useState({
    resilience: 0,
    becoming: 0,
    purpose: 0,
    belonging: 0
  });
  const [recommendedPathway, setRecommendedPathway] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === ONBOARDING_QUESTIONS.length - 1;
  const progress = ((currentStep + 1) / ONBOARDING_QUESTIONS.length) * 100;

  const handleAnswer = (optionId: string) => {
    const option = currentQuestion?.options.find(opt => opt.id === optionId);
    if (!option || !currentQuestion) return;

    // Update answers
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);

    // Update pathway scores
    const newScores = { ...pathwayScores };
    Object.entries(option.pathwayWeights).forEach(([pathway, weight]) => {
      newScores[pathway as keyof typeof pathwayScores] += weight;
    });
    setPathwayScores(newScores);

    if (isLastQuestion) {
      // Calculate recommended pathway
      const recommended = Object.entries(newScores).reduce((a, b) => 
        newScores[a[0] as keyof typeof pathwayScores] > newScores[b[0] as keyof typeof pathwayScores] ? a : b
      )[0];
      
      setRecommendedPathway(recommended);
      setShowResults(true);
    } else {
      // Move to next question
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const startPathway = () => {
    if (recommendedPathway) {
      // Store user preferences and pathway choice
      localStorage.setItem('alchm_onboarding_complete', 'true');
      localStorage.setItem('alchm_recommended_pathway', recommendedPathway);
      localStorage.setItem('alchm_pathway_scores', JSON.stringify(pathwayScores));
      
      // Navigate to the recommended pathway
      router.push(`/pathways/${recommendedPathway}/step/1`);
    }
  };

  const exploreAllPathways = () => {
    localStorage.setItem('alchm_onboarding_complete', 'true');
    router.push('/pathways');
  };

  if (showResults && recommendedPathway) {
    const pathway = PATHWAY_DESCRIPTIONS[recommendedPathway as keyof typeof PATHWAY_DESCRIPTIONS];
    
    return (
      <div className="min-h-screen bg-[#2D2D30] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5E8E7F] flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-3xl font-light text-white mb-2">Your Healing Journey Begins</h1>
            <p className="text-white/80">Based on your responses, we recommend starting here:</p>
          </div>

          <Card className="bg-white/5 border-white/10 p-8 mb-6">
            <div className={`w-full h-32 rounded-xl ${pathway.color} mb-6 flex items-center justify-center`}>
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-1">{pathway.title}</h2>
                <p className="opacity-90">{pathway.subtitle}</p>
              </div>
            </div>
            
            <p className="text-white/90 mb-6 leading-relaxed">
              {pathway.description}
            </p>

            <div className="mb-6">
              <h3 className="text-white font-medium mb-3">What you'll explore:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pathway.benefits.map((benefit, index) => (
                  <li key={index} className="text-white/80 text-sm flex items-center">
                    <span className="text-[#5E8E7F] mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={startPathway}
                className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E] text-white font-medium py-3"
              >
                Start {pathway.title} Journey
              </Button>
              <Button 
                onClick={exploreAllPathways}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Explore All Pathways
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <AITransparency context="onboarding" />
            <MedicalDisclaimer variant="inline" />
            
            <div className="text-center">
              <p className="text-white/60 text-sm mb-4">
                Your pathway scores (you can explore others anytime):
              </p>
              <div className="flex justify-center gap-4 text-sm">
                {Object.entries(pathwayScores).map(([pathway, score]) => (
                  <div key={pathway} className="text-white/60">
                    <span className="capitalize">{pathway}</span>: {score}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2D2D30] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5E8E7F]/20 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Welcome to Your Digital Sanctuary</h1>
          <p className="text-white/80">Let's find the perfect starting point for your healing journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">
              Question {currentStep + 1} of {ONBOARDING_QUESTIONS.length}
            </span>
            <span className="text-white/60 text-sm">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-[#5E8E7F] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="bg-white/5 border-white/10 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-light text-white mb-3">
              {currentQuestion?.question}
            </h2>
            <p className="text-white/80 text-sm">
              {currentQuestion?.description}
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className="w-full p-4 text-left rounded-lg border border-white/10 hover:border-[#5E8E7F] hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="text-white group-hover:text-white/90 font-medium">
                  {option.text}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            variant="ghost"
            className={`text-white/80 ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'}`}
            disabled={currentStep === 0}
          >
            ← Previous
          </Button>
          
          <Button
            onClick={exploreAllPathways}
            variant="ghost"
            className="text-white/60 hover:text-white/80 text-sm"
          >
            Skip and explore all pathways
          </Button>
        </div>
      </div>
    </div>
  );
}