'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBetaAccess } from '@/hooks/useBetaAccess';
import { feedbackService } from '@/lib/beta/feedbackService';
import { betaUserService } from '@/lib/beta/betaUserService';
import { BetaFeedback, BetaUser, FeedbackResponse } from '@/types/beta';

interface BetaDashboardProps {
  userRole?: 'beta_user' | 'developer' | 'admin';
}

export function BetaDashboard({ userRole = 'beta_user' }: BetaDashboardProps) {
  const { isBetaUser, betaUser, canAccessFeature } = useBetaAccess();
  const [feedback, setFeedback] = useState<BetaFeedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<BetaFeedback | null>(null);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });
  const [newResponse, setNewResponse] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  if (!isBetaUser) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Beta Access Required
        </h3>
        <p className="text-gray-600">
          You need to be a beta tester to access this dashboard.
        </p>
      </Card>
    );
  }

  useEffect(() => {
    loadFeedback();
  }, [filter, isBetaUser]);

  useEffect(() => {
    if (selectedFeedback) {
      loadResponses(selectedFeedback.id);
    }
  }, [selectedFeedback]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      
      // Regular users can only see their own feedback
      if (userRole === 'beta_user' && betaUser) {
        filters.userId = betaUser.uid;
      }
      
      if (filter.type !== 'all') {
        filters.type = filter.type;
      }
      
      if (filter.status !== 'all') {
        filters.status = filter.status;
      }
      
      if (filter.priority !== 'all') {
        filters.priority = filter.priority;
      }
      
      filters.limit = 50;
      
      const feedbackList = await feedbackService.getFeedback(filters);
      setFeedback(feedbackList);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (feedbackId: string) => {
    try {
      const responseList = await feedbackService.getFeedbackResponses(feedbackId);
      setResponses(responseList);
    } catch (error) {
      console.error('Failed to load responses:', error);
    }
  };

  const handleStatusUpdate = async (feedbackId: string, status: string) => {
    if (userRole === 'beta_user') return; // Only developers/admins can update status
    
    try {
      await feedbackService.updateFeedbackStatus(feedbackId, status as any);
      await loadFeedback();
      
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleVote = async (feedbackId: string, increment: number) => {
    try {
      await feedbackService.voteFeedback(feedbackId, increment);
      await loadFeedback();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedFeedback || !newResponse.trim()) return;
    
    try {
      setSubmittingResponse(true);
      
      await feedbackService.addFeedbackResponse(selectedFeedback.id, {
        authorId: betaUser?.uid || 'unknown',
        authorType: userRole === 'beta_user' ? 'beta_user' : 'developer',
        content: newResponse.trim(),
        createdAt: new Date(),
        isInternal: false
      });
      
      setNewResponse('');
      await loadResponses(selectedFeedback.id);
    } catch (error) {
      console.error('Failed to add response:', error);
    } finally {
      setSubmittingResponse(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'feature_request': return '✨';
      case 'usability': return '😖';
      case 'general': return '💬';
      default: return '📄';
    }
  };

  const filteredFeedback = feedback.filter(item => {
    if (filter.type !== 'all' && item.type !== filter.type) return false;
    if (filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.priority !== 'all' && item.priority !== filter.priority) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Beta Testing Dashboard
        </h1>
        <p className="text-gray-600">
          {userRole === 'beta_user' 
            ? 'Track your feedback submissions and responses'
            : 'Manage beta feedback and bug reports'
          }
        </p>
      </div>

      {/* Stats */}
      {betaUser && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {betaUser.metrics.bugsReported}
            </div>
            <div className="text-sm text-gray-600">Bugs Reported</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {betaUser.metrics.feedbackSubmitted}
            </div>
            <div className="text-sm text-gray-600">Feedback Submitted</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {betaUser.metrics.surveysCompleted}
            </div>
            <div className="text-sm text-gray-600">Surveys Completed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {betaUser.metrics.engagementScore}
            </div>
            <div className="text-sm text-gray-600">Engagement Score</div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Feedback & Issues
              </h2>
              
              {/* Filters */}
              <div className="flex gap-2">
                <select
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="bug">Bugs</option>
                  <option value="feature_request">Features</option>
                  <option value="usability">Usability</option>
                  <option value="general">General</option>
                </select>
                
                <select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                
                <select
                  value={filter.priority}
                  onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredFeedback.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No feedback found matching the selected filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFeedback.map(item => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFeedback?.id === item.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFeedback(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getTypeIcon(item.type)}</span>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(item.id, 1);
                            }}
                            className="text-gray-400 hover:text-green-600"
                          >
                            ▲
                          </button>
                          <span className="text-sm font-medium">{item.votes}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Feedback Detail */}
        <div>
          {selectedFeedback ? (
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getTypeIcon(selectedFeedback.type)}</span>
                  <h3 className="font-semibold text-gray-900">{selectedFeedback.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedFeedback.status)}`}>
                    {selectedFeedback.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedFeedback.priority)}`}>
                    {selectedFeedback.priority}
                  </span>
                </div>

                {/* Status Update (Developer/Admin only) */}
                {userRole !== 'beta_user' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Update Status:
                    </label>
                    <select
                      value={selectedFeedback.status}
                      onChange={(e) => handleStatusUpdate(selectedFeedback.id, e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedFeedback.description}
                  </p>
                </div>

                {selectedFeedback.attachments && selectedFeedback.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
                    <div className="space-y-2">
                      {selectedFeedback.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{attachment.name}</span>
                          {attachment.type === 'screenshot' && (
                            <img
                              src={attachment.url}
                              alt="Screenshot"
                              className="max-w-full h-32 object-contain border rounded"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFeedback.context && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Context:</h4>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Page: {selectedFeedback.context.page}</div>
                      <div>URL: {selectedFeedback.context.url}</div>
                      <div>Device: {selectedFeedback.context.device.type} ({selectedFeedback.context.device.os})</div>
                      <div>Browser: {selectedFeedback.context.device.browser}</div>
                      <div>Viewport: {selectedFeedback.context.viewport.width}x{selectedFeedback.context.viewport.height}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Responses */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Responses ({responses.length})</h4>
                
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {responses.map(response => (
                    <div key={response.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {response.authorType === 'developer' ? 'Developer' : 'Beta User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {response.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Response */}
                <div>
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    rows={3}
                    placeholder="Add a response..."
                  />
                  <Button
                    onClick={handleAddResponse}
                    disabled={submittingResponse || !newResponse.trim()}
                    className="mt-2 w-full"
                    size="sm"
                  >
                    {submittingResponse ? 'Sending...' : 'Add Response'}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">Select feedback to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}