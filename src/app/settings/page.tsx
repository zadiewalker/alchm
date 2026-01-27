'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../../lib/auth';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [khepera, setKhepera] = useState(true);
  const [insights, setInsights] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // TODO: Implement account deletion
      console.log('Deleting account...');
      
      // For now, just logout
      await handleLogout();
    } catch (error) {
      console.error('Account deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange,
    label 
  }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-4">
      <span className="text-white">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          enabled ? 'bg-white/30' : 'bg-white/10'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
          enabled ? 'left-7' : 'left-1'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Fixed Header */}
      <header className="px-6 pt-4 pb-2 flex items-center">
        <button onClick={() => router.back()} className="group relative">
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
          <span className="relative text-white/70 text-lg">← Back</span>
        </button>
        <h1 className="text-white text-xl font-light ml-4">Settings</h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-md mx-auto space-y-6">

          {/* Preferences */}
          <div className="bg-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white font-light text-lg mb-2">Preferences</h2>
              <p className="text-white/70 text-sm">Customize your healing experience</p>
            </div>
            <div className="px-6">
              <ToggleSwitch
                enabled={notifications}
                onChange={setNotifications}
                label="Gentle reminders to journal"
              />
              <ToggleSwitch
                enabled={khepera}
                onChange={setKhepera}
                label="Khepera insights & responses"
              />
              <ToggleSwitch
                enabled={insights}
                onChange={setInsights}
                label="Weekly healing insights"
              />
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white font-light text-lg mb-2">Privacy & Security</h2>
              <p className="text-white/70 text-sm">Your sanctuary, your rules</p>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => router.push('/privacy')}
                className="group relative w-full text-left py-3"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
                <span className="relative text-white">Privacy Policy</span>
              </button>
              
              <button
                onClick={() => {
                  // TODO: Export user data
                  console.log('Exporting user data...');
                }}
                className="group relative w-full text-left py-3"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
                <span className="relative text-white">Export my data</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white font-light text-lg mb-2">Support</h2>
              <p className="text-white/70 text-sm">We're here to help</p>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => router.push('/emergency')}
                className="group relative w-full text-left py-3"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
                <span className="relative text-white">🆘 Crisis Support</span>
              </button>
              
              <button
                onClick={() => {
                  // TODO: Contact support
                  console.log('Contacting support...');
                }}
                className="group relative w-full text-left py-3"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
                <span className="relative text-white">💬 Contact support</span>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <button
                onClick={handleLogout}
                className="group relative w-full py-3"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 group-active:bg-white/25 rounded-lg transition-all duration-300" />
                <span className="relative text-white">Sign Out</span>
              </button>
              
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="group relative w-full py-3"
              >
                <div className="absolute inset-0 bg-red-500/20 group-hover:bg-red-500/30 group-active:bg-red-500/35 rounded-lg transition-all duration-300" />
                <span className="relative text-white">
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </span>
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="text-center text-white/50 text-sm">
            <p>ALCHM v1.0.16</p>
            <p>Your digital sanctuary for healing</p>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/50 text-sm text-center">Your healing, your way</p>
      </div>
    </div>
  );
}