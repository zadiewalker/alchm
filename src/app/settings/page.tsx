'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [gentleReminders, setGentleReminders] = useState(true);
  const [crisisSupport, setCrisisSupport] = useState(true);
  const [journalReminders, setJournalReminders] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [soundHealing, setSoundHealing] = useState(true);
  const [breathingCues, setBreathingCues] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [customCrisisNumber, setCustomCrisisNumber] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [supportPerson, setSupportPerson] = useState('');
  const [safeWords, setSafeWords] = useState(['breathe', 'safe', 'grounded']);
  const [newSafeWord, setNewSafeWord] = useState('');
  const [cleared, setCleared] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('alchm_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotifications(settings.notifications ?? true);
      setGentleReminders(settings.gentleReminders ?? true);
      setCrisisSupport(settings.crisisSupport ?? true);
      setJournalReminders(settings.journalReminders ?? false);
      setPrivateMode(settings.privateMode ?? false);
      setSoundHealing(settings.soundHealing ?? true);
      setBreathingCues(settings.breathingCues ?? true);
      setDarkMode(settings.darkMode ?? false);
      setCustomCrisisNumber(settings.customCrisisNumber ?? '');
      setPreferredName(settings.preferredName ?? '');
      setSupportPerson(settings.supportPerson ?? '');
      setSafeWords(settings.safeWords ?? ['breathe', 'safe', 'grounded']);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      notifications,
      gentleReminders,
      crisisSupport,
      journalReminders,
      privateMode,
      soundHealing,
      breathingCues,
      darkMode,
      customCrisisNumber,
      preferredName,
      supportPerson,
      safeWords
    };
    localStorage.setItem('alchm_settings', JSON.stringify(settings));
  };

  useEffect(() => {
    saveSettings();
  }, [notifications, gentleReminders, crisisSupport, journalReminders, privateMode, soundHealing, breathingCues, darkMode, customCrisisNumber, preferredName, supportPerson, safeWords]);

  // Load subscription status
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const response = await fetch('/api/stripe/subscription-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    loadSubscription();
  }, []);

  const addSafeWord = () => {
    if (newSafeWord.trim() && !safeWords.includes(newSafeWord.trim())) {
      setSafeWords([...safeWords, newSafeWord.trim()]);
      setNewSafeWord('');
    }
  };

  const removeSafeWord = (wordToRemove: string) => {
    setSafeWords(safeWords.filter(word => word !== wordToRemove));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure? This will delete all your journal entries, pathway progress, and settings. This cannot be undone.')) {
      // Clear all ALCHM data from localStorage
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('journal_') || key.startsWith('alchm_') || key.startsWith('pathway_')
      );
      keys.forEach(key => localStorage.removeItem(key));
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  const openCustomerPortal = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Sorry, there was an error opening the billing portal. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Settings</h1>
        </div>
        <p className="text-white/70 text-sm font-light">Customize your healing sanctuary</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6 pb-20">
        
        {/* Personal Sanctuary */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-lg font-light mb-4 flex items-center gap-3">
            <span>🏛️</span> Personal Sanctuary
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-light mb-2">What would you like to be called?</label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="Your preferred name or nickname..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-light mb-2">Safe words for grounding</label>
              <div className="flex gap-2 flex-wrap mb-3">
                {safeWords.map((word, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full">
                    <span className="text-white text-sm">{word}</span>
                    <button
                      onClick={() => removeSafeWord(word)}
                      className="text-white/60 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSafeWord}
                  onChange={(e) => setNewSafeWord(e.target.value)}
                  placeholder="Add a safe word..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                  onKeyPress={(e) => e.key === 'Enter' && addSafeWord()}
                />
                <button
                  onClick={addSafeWord}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white text-sm transition-all duration-300"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Support */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-lg font-light mb-4 flex items-center gap-3">
            <span>🛡️</span> Safety & Support
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-light mb-2">Trusted support person (optional)</label>
              <input
                type="text"
                value={supportPerson}
                onChange={(e) => setSupportPerson(e.target.value)}
                placeholder="Name of someone you can reach out to..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-light mb-2">Custom crisis number (optional)</label>
              <input
                type="text"
                value={customCrisisNumber}
                onChange={(e) => setCustomCrisisNumber(e.target.value)}
                placeholder="Alternative crisis support number..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">Show crisis support on all pages</span>
                <p className="text-white/60 text-xs mt-1">Always display 988 crisis line info</p>
              </div>
              <button
                onClick={() => setCrisisSupport(!crisisSupport)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  crisisSupport ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  crisisSupport ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Healing Experience */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-lg font-light mb-4 flex items-center gap-3">
            <span>✨</span> Healing Experience
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">Gentle breathing cues</span>
                <p className="text-white/60 text-xs mt-1">Visual breath guidance during exercises</p>
              </div>
              <button
                onClick={() => setBreathingCues(!breathingCues)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  breathingCues ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  breathingCues ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">Sound healing tones</span>
                <p className="text-white/60 text-xs mt-1">Gentle audio cues for meditation</p>
              </div>
              <button
                onClick={() => setSoundHealing(!soundHealing)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  soundHealing ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  soundHealing ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">Gentle journal reminders</span>
                <p className="text-white/60 text-xs mt-1">Soft prompts to check in with yourself</p>
              </div>
              <button
                onClick={() => setJournalReminders(!journalReminders)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  journalReminders ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  journalReminders ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        {!loadingSubscription && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-white text-lg font-light mb-4 flex items-center gap-3">
              <span>💳</span> Subscription
            </h2>
            
            <div className="space-y-4">
              {subscription?.isActive ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white text-sm">Current Plan</span>
                      <p className="text-white/60 text-xs mt-1 capitalize">
                        {subscription.planType === 'sanctuary' ? 'Sanctuary (Free)' : 
                         subscription.planType === 'growth' ? 'Growth ($4.99/month)' : 
                         subscription.planType === 'transformation' ? 'Transformation ($9.99/month)' : 'Unknown'}
                      </p>
                    </div>
                    <div className="text-green-400 text-sm">Active</div>
                  </div>
                  
                  <button
                    onClick={openCustomerPortal}
                    className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-white text-sm transition-all duration-300"
                  >
                    Manage Subscription
                  </button>
                  <p className="text-white/60 text-xs text-center">
                    Update billing info, change plans, or cancel subscription
                  </p>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <span className="text-white text-sm">Sanctuary Plan (Free)</span>
                    <p className="text-white/60 text-xs mt-1">You're currently on the free plan</p>
                  </div>
                  
                  <Link
                    href="/pricing"
                    className="block w-full px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-white text-sm text-center transition-all duration-300"
                  >
                    Upgrade Your Journey
                  </Link>
                  <p className="text-white/60 text-xs text-center">
                    Access advanced features and personalized guidance
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Privacy & Data */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-lg font-light mb-4 flex items-center gap-3">
            <span>🔒</span> Privacy & Data
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white text-sm">Private mode</span>
                <p className="text-white/60 text-xs mt-1">Hide content when others might see screen</p>
              </div>
              <button
                onClick={() => setPrivateMode(!privateMode)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  privateMode ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  privateMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="border-t border-white/20 pt-4">
              <button
                onClick={clearAllData}
                className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl text-red-200 text-sm transition-all duration-300"
              >
                Clear All Data
              </button>
              <p className="text-white/60 text-xs mt-2 text-center">
                This will permanently delete all your journal entries and progress
              </p>
              {cleared && (
                <p className="text-green-300 text-sm mt-2 text-center">✓ All data cleared</p>
              )}
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-white text-lg font-light mb-4 flex items-center gap-3">
            <span>ℹ️</span> About ALCHM
          </h2>
          
          <div className="space-y-3 text-white/70 text-sm">
            <p>ALCHM is your digital sanctuary for healing and transformation.</p>
            <p>Version 1.0 • Built with trauma-informed design principles</p>
            <div className="flex gap-4 mt-4">
              <Link href="/privacy-policy" className="text-white/60 hover:text-white text-xs">
                Privacy Policy
              </Link>
              <Link href="/transparency" className="text-white/60 hover:text-white text-xs">
                Transparency
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Support */}
      {crisisSupport && (
        <div className="pb-10">
          <p className="text-white/40 text-xs text-center tracking-wide">
            Crisis support available · {customCrisisNumber || '988'}
            {supportPerson && ` · Reach out to ${supportPerson}`}
          </p>
        </div>
      )}
    </div>
  );
}