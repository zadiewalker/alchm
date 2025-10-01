'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Lock, Send, Shield } from 'lucide-react';

export const SecureCommunication: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-slate-800 tracking-wide">
          Secure Communication
        </h3>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <Shield size={16} />
          <span>End-to-End Encrypted</span>
        </div>
      </div>

      <Card className="p-6 border-sage-200">
        <div className="text-center py-8 text-slate-500">
          <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg tracking-wide">Secure messaging system coming soon</p>
          <p className="text-sm mt-2">HIPAA-compliant communication with clients</p>
        </div>
      </Card>
    </div>
  );
};

export default SecureCommunication;