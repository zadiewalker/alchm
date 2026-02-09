'use client';

import Link from 'next/link';

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-4">
        <Link href="/dashboard/" className="text-white/60 text-base mb-4 inline-block hover:text-white/80 transition-all duration-200 ease-out active:scale-[0.98]">
          ← Back to Sanctuary
        </Link>
        <div className="flex items-center mb-2">
          <span className="text-amber-200 text-2xl mr-3">☾</span>
          <h1 className="text-white text-2xl font-light">Crisis Support</h1>
        </div>
        <p className="text-white/50 text-sm">You're not alone in this moment</p>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        
        {/* Gentle Welcome */}
        <div className="bg-[#E8C56D]/15 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C56D]/20 mb-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🤗</div>
            <h2 className="text-white text-xl font-light mb-4">You're Not Alone</h2>
            <p className="text-white/70 text-base leading-relaxed">
              If you're having thoughts of hurting yourself or others, please reach out for immediate support. 
              Your life has value, and help is available 24/7.
            </p>
          </div>
        </div>

        {/* Immediate Crisis Support */}
        <div className="bg-[#E8C56D]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#E8C56D]/25 mb-6">
          <h3 className="text-white text-lg font-light mb-4 flex items-center">
            <span className="text-amber-200 text-xl mr-3">☾</span>
            Immediate Crisis Support
          </h3>
          
          <div className="space-y-4">
            <a 
              href="tel:988"
              className="block bg-[#E8C56D] hover:bg-[#F2D99D] text-white p-6 rounded-xl transition-all duration-200 ease-out active:scale-[0.98] text-center"
            >
              <div className="text-xl mb-2">📞</div>
              <div className="font-medium text-lg">Call 988</div>
              <div className="text-sm opacity-90">Suicide & Crisis Lifeline</div>
            </a>
            
            <a 
              href="sms:741741"
              className="block bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl transition-all duration-200 ease-out active:scale-[0.98] text-center border border-white/20"
            >
              <div className="text-xl mb-2">💬</div>
              <div className="font-medium text-lg">Text HOME to 741741</div>
              <div className="text-sm opacity-90">Crisis Text Line</div>
            </a>
            
            <a 
              href="tel:911"
              className="block bg-white/15 hover:bg-white/25 text-white p-6 rounded-xl transition-all duration-200 ease-out active:scale-[0.98] text-center border border-white/30"
            >
              <div className="text-xl mb-2">🚑</div>
              <div className="font-medium text-lg">Call 911</div>
              <div className="text-sm opacity-90">Emergency Services</div>
            </a>
          </div>
        </div>

        {/* Additional Support Resources */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15 mb-6">
          <h3 className="text-white text-lg font-light mb-4 flex items-center">
            <span className="text-[#8B9A7C] text-xl mr-3">💚</span>
            Additional Support Resources
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white text-base font-medium mb-2 flex items-center">
                <span className="mr-2">🌈</span>
                LGBTQ+ Crisis Support
              </h4>
              <p className="text-white/70 text-sm mb-1">
                Trevor Project Lifeline: <a href="tel:1-866-488-7386" className="text-amber-200 underline">1-866-488-7386</a>
              </p>
              <p className="text-white/70 text-sm">
                Text START to <a href="sms:678-678" className="text-amber-200 underline">678-678</a>
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white text-base font-medium mb-2 flex items-center">
                <span className="mr-2">🧠</span>
                Mental Health Crisis
              </h4>
              <p className="text-white/70 text-sm mb-1">
                NAMI Helpline: <a href="tel:1-800-950-6264" className="text-amber-200 underline">1-800-950-NAMI</a>
              </p>
              <p className="text-white/70 text-sm">
                Monday–Friday, 10 AM–10 PM ET
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white text-base font-medium mb-2 flex items-center">
                <span className="mr-2">🌟</span>
                Veterans Crisis Line
              </h4>
              <p className="text-white/70 text-sm mb-1">
                Call: <a href="tel:1-800-273-8255" className="text-amber-200 underline">1-800-273-8255</a> (Press 1)
              </p>
              <p className="text-white/70 text-sm">
                Text: <a href="sms:838255" className="text-amber-200 underline">838255</a>
              </p>
            </div>
          </div>
        </div>

        {/* Self-Care Reminders */}
        <div className="bg-[#8B9A7C]/15 backdrop-blur-sm rounded-2xl p-6 border border-[#8B9A7C]/20">
          <h3 className="text-white text-lg font-light mb-4 flex items-center">
            <span className="text-amber-200 text-xl mr-3">✨</span>
            Gentle Reminders
          </h3>
          
          <div className="space-y-3">
            <p className="text-white/70 text-sm leading-relaxed">
              • Crisis support available 24/7 - 988
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              • Your feelings are valid and temporary
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              • You don't have to face this alone
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              • Professional support can help you navigate difficult moments
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              • This moment will pass, and help is available
            </p>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/60 text-xs leading-relaxed text-center">
            <strong>Medical Disclaimer:</strong> ALCHM is not a substitute for professional medical care, therapy, or emergency services. 
            If you are experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately.
          </p>
        </div>
        
      </div>
    </div>
  );
}