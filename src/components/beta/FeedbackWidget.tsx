'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBetaAccess } from '@/hooks/useBetaAccess';
import { feedbackService } from '@/lib/beta/feedbackService';
import { BetaFeedback } from '@/types/beta';

interface FeedbackWidgetProps {
  trigger?: 'floating' | 'inline' | 'contextual';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  contextualTriggers?: {
    errorBoundary?: boolean;
    idleTime?: number;
    pageTime?: number;
    frustrationDetection?: boolean;
  };
  onFeedbackSubmitted?: (feedback: BetaFeedback) => void;
}

export function FeedbackWidget({
  trigger = 'floating',
  position = 'bottom-right',
  contextualTriggers = {},
  onFeedbackSubmitted
}: FeedbackWidgetProps) {
  const { isBetaUser, canAccessFeature } = useBetaAccess();
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature_request' | 'usability' | 'general'>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [includeConsoleLog, setIncludeConsoleLog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShow, setShouldShow] = useState(false);

  // Don't render if user doesn't have beta access
  if (!isBetaUser || !canAccessFeature('bug_reporting')) {
    return null;
  }

  // Contextual triggering logic
  useEffect(() => {
    let showTimer: NodeJS.Timeout;
    let idleTimer: NodeJS.Timeout;
    let pageTimer: NodeJS.Timeout;
    
    // Page time trigger
    if (contextualTriggers.pageTime) {
      pageTimer = setTimeout(() => {
        setShouldShow(true);
      }, contextualTriggers.pageTime * 1000);
    }

    // Idle time trigger
    if (contextualTriggers.idleTime) {
      let lastActivity = Date.now();
      
      const resetIdleTimer = () => {
        lastActivity = Date.now();
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (Date.now() - lastActivity >= (contextualTriggers.idleTime! * 1000)) {
            setShouldShow(true);
          }
        }, contextualTriggers.idleTime * 1000);
      };

      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
      });

      resetIdleTimer();

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetIdleTimer, true);
        });
        clearTimeout(idleTimer);
      };
    }

    // Frustration detection
    if (contextualTriggers.frustrationDetection) {
      let rapidClicks = 0;
      let lastClickTime = 0;
      
      const detectFrustration = (event: MouseEvent) => {
        const now = Date.now();
        if (now - lastClickTime < 500) {
          rapidClicks++;
          if (rapidClicks >= 5) {
            setShouldShow(true);
            setFeedbackType('usability');
            setTitle('Usability Issue Detected');
            setDescription('I experienced difficulty with this interface.');
          }
        } else {
          rapidClicks = 0;
        }
        lastClickTime = now;
      };

      document.addEventListener('click', detectFrustration);
      
      return () => {
        document.removeEventListener('click', detectFrustration);
      };
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(pageTimer);
    };
  }, [contextualTriggers]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a title and description');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const feedback = await feedbackService.submitFeedback({
        type: feedbackType,
        title: title.trim(),
        description: description.trim(),
        priority,
        tags,
        userId: 'current-user', // This should come from auth context
        includeScreenshot,
        includeConsoleLog
      });

      setSuccess(true);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(feedback);
      }

      // Reset form after successful submission
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setTitle('');
        setDescription('');
        setTags([]);
        setShouldShow(false);
      }, 2000);

    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShouldShow(false);
    setError(null);
    setSuccess(false);
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const commonTags = {
    bug: ['ui-bug', 'performance', 'data-loss', 'crash', 'browser-specific'],
    feature_request: ['enhancement', 'new-feature', 'improvement', 'accessibility'],
    usability: ['confusing', 'slow', 'hard-to-find', 'mobile-issue'],
    general: ['suggestion', 'question', 'compliment', 'other']
  };

  if (trigger === 'floating') {
    return (
      <>
        {/* Floating Trigger Button */}
        {(shouldShow || trigger === 'floating') && !isOpen && (
          <div className={`fixed ${positionClasses[position]} z-50`}>
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
              title="Send Feedback"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V18a2 2 0 01-2 2H9a2 2 0 01-2-2V8m4 0V4a2 2 0 00-2-2H9a2 2 0 00-2 2v4m0 0h6" />
              </svg>
            </Button>
          </div>
        )}

        {/* Feedback Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-900">
                    {success ? 'Feedback Sent!' : 'Send Feedback'}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClose}
                  >
                    ×
                  </Button>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-4xl mb-4">✓</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Thank you for your feedback!
                    </h3>
                    <p className="text-gray-600">
                      Your feedback helps us improve the experience for everyone.
                    </p>
                  </div>
                ) : (
                  <FeedbackForm
                    feedbackType={feedbackType}
                    setFeedbackType={setFeedbackType}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    priority={priority}
                    setPriority={setPriority}
                    tags={tags}
                    addTag={addTag}
                    removeTag={removeTag}
                    includeScreenshot={includeScreenshot}
                    setIncludeScreenshot={setIncludeScreenshot}
                    includeConsoleLog={includeConsoleLog}
                    setIncludeConsoleLog={setIncludeConsoleLog}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                    error={error}
                    commonTags={commonTags[feedbackType]}
                  />
                )}
              </div>
            </Card>
          </div>
        )}
      </>
    );
  }

  // Inline trigger
  if (trigger === 'inline') {
    return (
      <div className="w-full">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            className="w-full"
          >
            📝 Send Feedback
          </Button>
        ) : (
          <Card className="p-4">
            <FeedbackForm
              feedbackType={feedbackType}
              setFeedbackType={setFeedbackType}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              priority={priority}
              setPriority={setPriority}
              tags={tags}
              addTag={addTag}
              removeTag={removeTag}
              includeScreenshot={includeScreenshot}
              setIncludeScreenshot={setIncludeScreenshot}
              includeConsoleLog={includeConsoleLog}
              setIncludeConsoleLog={setIncludeConsoleLog}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
              commonTags={commonTags[feedbackType]}
              onCancel={handleClose}
            />
          </Card>
        )}
      </div>
    );
  }

  return null;
}

// Feedback Form Component
interface FeedbackFormProps {
  feedbackType: 'bug' | 'feature_request' | 'usability' | 'general';
  setFeedbackType: (type: 'bug' | 'feature_request' | 'usability' | 'general') => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  priority: 'low' | 'medium' | 'high' | 'critical';
  setPriority: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  includeScreenshot: boolean;
  setIncludeScreenshot: (include: boolean) => void;
  includeConsoleLog: boolean;
  setIncludeConsoleLog: (include: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
  commonTags: string[];
  onCancel?: () => void;
}

function FeedbackForm({
  feedbackType,
  setFeedbackType,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  tags,
  addTag,
  removeTag,
  includeScreenshot,
  setIncludeScreenshot,
  includeConsoleLog,
  setIncludeConsoleLog,
  onSubmit,
  submitting,
  error,
  commonTags,
  onCancel
}: FeedbackFormProps) {
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Feedback Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feedback Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'bug', label: '🐛 Bug Report' },
            { value: 'feature_request', label: '✨ Feature Request' },
            { value: 'usability', label: '😖 Usability Issue' },
            { value: 'general', label: '💬 General Feedback' }
          ].map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFeedbackType(type.value as any)}
              className={`p-2 text-sm border rounded-md text-left ${
                feedbackType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of your feedback..."
          maxLength={100}
        />
        <div className="text-xs text-gray-500 mt-1">
          {title.length}/100 characters
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Please provide as much detail as possible..."
          maxLength={1000}
        />
        <div className="text-xs text-gray-500 mt-1">
          {description.length}/1000 characters
        </div>
      </div>

      {/* Priority (for bugs) */}
      {feedbackType === 'bug' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low - Minor issue</option>
            <option value="medium">Medium - Noticeable problem</option>
            <option value="high">High - Major issue</option>
            <option value="critical">Critical - Blocks functionality</option>
          </select>
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {commonTags.filter(tag => !tags.includes(tag)).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs hover:bg-gray-200"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeScreenshot}
            onChange={(e) => setIncludeScreenshot(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            Include screenshot (recommended for visual issues)
          </span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeConsoleLog}
            onChange={(e) => setIncludeConsoleLog(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            Include console logs (for technical issues)
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={onSubmit}
          disabled={submitting || !title.trim() || !description.trim()}
          className="flex-1"
        >
          {submitting ? 'Sending...' : 'Send Feedback'}
        </Button>
      </div>
    </div>
  );
}