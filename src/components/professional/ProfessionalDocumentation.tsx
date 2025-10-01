'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Lock, Calendar, Search, Plus, Eye } from 'lucide-react';

interface ClinicalNote {
  id: string;
  clientInitials: string;
  date: Date;
  sessionType: 'individual' | 'assessment' | 'consultation';
  duration: number;
  summary: string;
  interventions: string[];
  goals: string[];
  nextSteps: string;
  encrypted: boolean;
}

export const ProfessionalDocumentation: React.FC = () => {
  const [notes] = useState<ClinicalNote[]>([
    {
      id: '1',
      clientInitials: 'A.B.',
      date: new Date(),
      sessionType: 'individual',
      duration: 50,
      summary: 'Client presented with improved mood regulation. Discussed workplace boundaries.',
      interventions: ['Cognitive restructuring', 'Mindfulness techniques'],
      goals: ['Practice daily mindfulness', 'Implement boundary-setting'],
      nextSteps: 'Continue boundary practice, introduce assertiveness training',
      encrypted: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-slate-800 tracking-wide">
          Clinical Documentation
        </h3>
        <Button className="bg-sage-600 hover:bg-sage-700 text-white">
          <Plus size={16} className="mr-2" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search notes by client, date, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes List */}
        <div className="space-y-4">
          {notes.map(note => (
            <Card 
              key={note.id} 
              className="p-4 cursor-pointer hover:shadow-sm border-sage-200"
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="text-sage-600" size={16} />
                  <span className="font-medium">Client {note.clientInitials}</span>
                  {note.encrypted && <Lock className="text-green-600" size={14} />}
                </div>
                <span className="text-sm text-slate-500">
                  {note.date.toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-700 mb-2">{note.summary}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{note.sessionType} • {note.duration} min</span>
                <span>HIPAA Compliant</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Note Details */}
        {selectedNote && (
          <Card className="p-6 border-sage-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-slate-800">Session Note</h4>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="outline">Export</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Client</label>
                  <p className="text-slate-800">{selectedNote.clientInitials}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <p className="text-slate-800">{selectedNote.date.toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Summary</label>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm">
                  {selectedNote.summary}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Next Steps</label>
                <p className="text-slate-800 bg-sage-50 p-3 rounded-lg text-sm">
                  {selectedNote.nextSteps}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDocumentation;