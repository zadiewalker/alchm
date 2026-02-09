'use client';

import Link from 'next/link';
import UsageMonitor from '@/components/UsageMonitor';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <Link href="/dashboard/" className="text-white/60 text-base mb-4 inline-block hover:text-white/80 transition-all duration-200 ease-out active:scale-[0.98]">
          ← Back
        </Link>
        <h1 className="text-white text-3xl font-light">Settings</h1>
        <p className="text-white/50 text-base mt-1">Your sanctuary preferences</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        
        {/* Usage Section */}
        <section className="mb-8">
          <h2 className="text-white/50 text-sm tracking-wide mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#E8C56D]"/>
            API Usage
          </h2>
          <UsageMonitor />
        </section>

        {/* Account Section */}
        <section className="mb-8">
          <h2 className="text-white/50 text-sm tracking-wide mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#E8C56D]"/>
            Account
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => console.log('Navigate to profile settings')}
              className="w-full text-left bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#E8C56D]/30 hover:bg-[#E8C56D]/5 transition-all duration-200 ease-out active:scale-[0.99]"
            >
              <h3 className="text-white text-base font-medium mb-1">Profile</h3>
              <p className="text-white/50 text-sm">Manage your personal information</p>
            </button>
            
            <Link 
              href="/privacy/"
              className="block bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#E8C56D]/30 hover:bg-[#E8C56D]/5 transition-all duration-200 ease-out active:scale-[0.99]"
            >
              <h3 className="text-white text-base font-medium mb-1">Privacy</h3>
              <p className="text-white/50 text-sm">Control how your data is used</p>
            </Link>
          </div>
        </section>

        {/* Sanctuary Section */}
        <section className="mb-8">
          <h2 className="text-white/50 text-sm tracking-wide mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#E8C56D]"/>
            Sanctuary
          </h2>
          <div className="space-y-3">
            <button 
              onClick={() => console.log('Open notification settings')}
              className="w-full text-left bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#E8C56D]/30 hover:bg-[#E8C56D]/5 transition-all duration-200 ease-out active:scale-[0.99]"
            >
              <h3 className="text-white text-base font-medium mb-1">Reminders</h3>
              <p className="text-white/50 text-sm">Gentle notifications for reflection</p>
            </button>
            
            <button 
              onClick={() => console.log('Export data functionality')}
              className="w-full text-left bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-[#E8C56D]/30 hover:bg-[#E8C56D]/5 transition-all duration-200 ease-out active:scale-[0.99]"
            >
              <h3 className="text-white text-base font-medium mb-1">Export Data</h3>
              <p className="text-white/50 text-sm">Download your journal entries</p>
            </button>
          </div>
        </section>

        {/* Support Section */}
        <section className="mb-8">
          <h2 className="text-white/50 text-sm tracking-wide mb-4 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#E8C56D]"/>
            Support
          </h2>
          <div className="space-y-3">
            <Link 
              href="/privacy-policy/"
              className="block bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#E8C56D]/20 hover:bg-[#E8C56D]/5 transition-all duration-200 ease-out active:scale-[0.99] min-h-[44px] flex items-center justify-between"
            >
              <span className="text-white/80 text-sm font-light">Privacy Policy</span>
              <div className="w-1 h-1 rounded-full bg-[#E8C56D]/60" />
            </Link>
            
            <Link 
              href="/settings/disclaimer/"
              className="block bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-[#E8C56D]/20 hover:bg-[#E8C56D]/5 transition-all duration-200 ease-out active:scale-[0.99] min-h-[44px] flex items-center justify-between"
            >
              <span className="text-white/80 text-sm font-light">Medical Disclaimer</span>
              <div className="w-1 h-1 rounded-full bg-[#E8C56D]/60" />
            </Link>
            
            <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/5 flex items-center justify-between">
              <span className="text-white/60 text-sm font-light">Version 1.0.16</span>
              <div className="w-1 h-1 rounded-full bg-[#E8C56D]/40" />
            </div>
          </div>
        </section>


        
        {/* Crisis Support Footer */}
        <div className="mt-8 pb-8 pt-6">
          <p className="text-white/30 text-xs text-center tracking-wide">
            Crisis support available · 988
          </p>
        </div>

      </div>
    </div>
  );
}