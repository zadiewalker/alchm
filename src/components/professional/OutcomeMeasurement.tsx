'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart, Calendar } from 'lucide-react';

export const OutcomeMeasurement: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-slate-800 tracking-wide">
        Outcome Measurement
      </h3>

      <Card className="p-6 border-sage-200">
        <div className="text-center py-8 text-slate-500">
          <BarChart size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg tracking-wide">Clinical outcome tracking coming soon</p>
          <p className="text-sm mt-2">PHQ-9, GAD-7, and other standardized measures</p>
        </div>
      </Card>
    </div>
  );
};

export default OutcomeMeasurement;