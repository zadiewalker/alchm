'use client';

import React from 'react';
import { Shield, Heart, Users, Eye } from 'lucide-react';

export const SafeSpaceIndicator: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <Shield className="text-green-600" size={20} />
          <span className="text-sm font-medium text-green-800 tracking-wide">
            Safe Space Active
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Heart className="text-pink-600" size={20} />
          <span className="text-sm font-medium text-pink-800 tracking-wide">
            Trauma-Informed
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Eye className="text-blue-600" size={20} />
          <span className="text-sm font-medium text-blue-800 tracking-wide">
            Anonymous by Default
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="text-purple-600" size={20} />
          <span className="text-sm font-medium text-purple-800 tracking-wide">
            Consent-Based
          </span>
        </div>
      </div>
      
      <p className="text-center text-xs text-slate-600 mt-2 tracking-wide">
        This space is moderated 24/7 with crisis detection and immediate support resources
      </p>
    </div>
  );
};

export default SafeSpaceIndicator;