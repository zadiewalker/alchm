'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ReferralData {
  betaCode: string;
  invitesRemaining: number;
  totalReferrals: number;
  successfulReferrals: number;
  referralRewards: Array<{
    type: 'badge' | 'xp' | 'streak_boost';
    value: string;
    unlocked: boolean;
  }>;
}

export default function ReferralSystem() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    // Mock data - in production this would come from Firebase
    const mockData: ReferralData = {
      betaCode: 'ALCHM-XY7Z9B2K',
      invitesRemaining: 2,
      totalReferrals: 1,
      successfulReferrals: 1,
      referralRewards: [
        { type: 'badge', value: 'Community Builder', unlocked: true },
        { type: 'xp', value: '100 XP Bonus', unlocked: true },
        { type: 'streak_boost', value: '2x Grace Tokens', unlocked: false }
      ]
    };
    
    setReferralData(mockData);
    setShareUrl(`https://alchmapp.web.app/beta?ref=${mockData.betaCode}`);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join me on ALCHM - Your AI Journaling Companion');
    const body = encodeURIComponent(
      `I've been using ALCHM for my wellness journey and thought you'd love it too!\n\n` +
      `ALCHM is a trauma-informed AI journaling platform that helps with emotional processing and mental wellness.\n\n` +
      `Join the beta here: ${shareUrl}\n\n` +
      `Looking forward to supporting each other's growth! 💜`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (!referralData) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Share the Healing Journey
        </h2>
        <p className="text-gray-600">
          Help others discover trauma-informed wellness with ALCHM
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {referralData.invitesRemaining}
          </div>
          <div className="text-sm text-gray-600">Invites Left</div>
        </div>
        <div className="text-center bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {referralData.totalReferrals}
          </div>
          <div className="text-sm text-gray-600">Invited</div>
        </div>
        <div className="text-center bg-white p-4 rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {referralData.successfulReferrals}
          </div>
          <div className="text-sm text-gray-600">Joined</div>
        </div>
      </div>

      {/* Share Options */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="px-4 py-3"
          >
            {copySuccess ? '✅ Copied!' : '📋 Copy'}
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={shareViaEmail}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3"
          >
            📧 Share via Email
          </Button>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Join ALCHM - AI-Powered Wellness Journaling',
                  text: 'Discover trauma-informed journaling with AI insights',
                  url: shareUrl
                });
              } else {
                copyToClipboard();
              }
            }}
            variant="outline"
            className="flex-1 py-3"
          >
            🔗 Share
          </Button>
        </div>
      </div>

      {/* Referral Rewards */}
      <div className="bg-white p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Referral Rewards</h3>
        <div className="space-y-2">
          {referralData.referralRewards.map((reward, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                reward.unlocked 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  reward.unlocked ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={`font-medium ${
                  reward.unlocked ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {reward.value}
                </span>
              </div>
              {reward.unlocked && (
                <span className="text-green-600 font-semibold">Unlocked!</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compassionate Messaging */}
      <div className="mt-6 text-center text-sm text-gray-600 bg-white p-4 rounded-lg">
        <p className="mb-2">
          💜 <strong>Sharing is caring</strong> — but only invite those who are ready for growth.
        </p>
        <p>
          ALCHM works best when users genuinely want to explore their inner world with compassion.
        </p>
      </div>
    </div>
  );
}