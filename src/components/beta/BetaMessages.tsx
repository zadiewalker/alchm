'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBetaAccess } from '@/hooks/useBetaAccess';
import { messagingService } from '@/lib/beta/messagingService';
import { BetaMessage } from '@/types/beta';

interface BetaMessagesProps {
  showUnreadOnly?: boolean;
  maxMessages?: number;
  compact?: boolean;
}

export function BetaMessages({ showUnreadOnly = false, maxMessages = 10, compact = false }: BetaMessagesProps) {
  const { isBetaUser, betaUser } = useBetaAccess();
  const [messages, setMessages] = useState<BetaMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<BetaMessage | null>(null);
  const [filter, setFilter] = useState({
    type: 'all',
    priority: 'all',
    unreadOnly: showUnreadOnly
  });

  if (!isBetaUser || !betaUser) {
    return null;
  }

  useEffect(() => {
    loadMessages();
  }, [filter, betaUser]);

  const loadMessages = async () => {
    if (!betaUser) return;
    
    try {
      setLoading(true);
      
      const filters: any = {
        limit: maxMessages
      };
      
      if (filter.type !== 'all') {
        filters.type = filter.type;
      }
      
      if (filter.priority !== 'all') {
        filters.priority = filter.priority;
      }
      
      if (filter.unreadOnly) {
        filters.unreadOnly = true;
      }
      
      const messageList = await messagingService.getMessagesForUser(betaUser.uid, filters);
      setMessages(messageList);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    if (!betaUser) return;
    
    try {
      await messagingService.markMessageAsRead(messageId, betaUser.uid);
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, readBy: [...msg.readBy, betaUser.uid] }
          : msg
      ));
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const isUnread = (message: BetaMessage) => {
    return !message.readBy.includes(betaUser!.uid);
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'update': return '🔄';
      case 'survey': return '📋';
      case 'interview': return '🎤';
      case 'reminder': return '⏰';
      default: return '💬';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Recent Messages</h3>
          <Button variant="outline" size="sm" onClick={() => setFilter(prev => ({ ...prev, unreadOnly: !prev.unreadOnly }))}>
            {filter.unreadOnly ? 'Show All' : 'Unread Only'}
          </Button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            {filter.unreadOnly ? 'No unread messages' : 'No messages'}
          </p>
        ) : (
          <div className="space-y-2">
            {messages.slice(0, 5).map(message => (
              <div
                key={message.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  isUnread(message) 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (isUnread(message)) {
                    handleMarkAsRead(message.id);
                  }
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{getMessageIcon(message.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {message.title}
                      </h4>
                      {isUnread(message) && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(message.sentAt || message.scheduledAt).toLocaleDateString()}
                      </span>
                      <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {messages.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm">
                  View All ({messages.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-gray-900 mb-2">
          Beta Messages
        </h1>
        <p className="text-gray-600">
          Stay updated with announcements, surveys, and important information from the development team.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="announcement">Announcements</option>
              <option value="update">Updates</option>
              <option value="survey">Surveys</option>
              <option value="interview">Interviews</option>
              <option value="reminder">Reminders</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filter.unreadOnly}
                onChange={(e) => setFilter(prev => ({ ...prev, unreadOnly: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Messages ({messages.length})
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {filter.unreadOnly ? 'No unread messages' : 'No messages found'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-blue-500 bg-blue-50'
                        : isUnread(message)
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (isUnread(message)) {
                        handleMarkAsRead(message.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getMessageIcon(message.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{message.title}</h3>
                          {isUnread(message) && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                          {message.actionRequired && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                              Action Required
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {message.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.priority === 'high' ? 'bg-red-100 text-red-800' :
                              message.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.priority}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {message.type.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(message.sentAt || message.scheduledAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Message Detail */}
        <div>
          {selectedMessage ? (
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getMessageIcon(selectedMessage.type)}</span>
                  <h3 className="font-medium text-gray-900">{selectedMessage.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMessage.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedMessage.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedMessage.priority} priority
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {selectedMessage.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedMessage.content}
                  </p>
                </div>

                {selectedMessage.actionRequired && selectedMessage.actionUrl && (
                  <div className="mb-4">
                    <Button
                      onClick={() => window.location.href = selectedMessage.actionUrl!}
                      className="w-full"
                    >
                      Take Action
                    </Button>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    Sent: {new Date(selectedMessage.sentAt || selectedMessage.scheduledAt).toLocaleString()}
                  </div>
                  {selectedMessage.expiresAt && (
                    <div>
                      Expires: {new Date(selectedMessage.expiresAt).toLocaleString()}
                    </div>
                  )}
                  <div>
                    Status: {isUnread(selectedMessage) ? 'Unread' : 'Read'}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">Select a message to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Message Composer for Admins/Developers
export function MessageComposer() {
  const [message, setMessage] = useState({
    type: 'announcement' as const,
    title: '',
    content: '',
    priority: 'medium' as const,
    deliveryMethod: ['in_app'] as ('email' | 'in_app' | 'push')[],
    scheduledAt: new Date(),
    actionRequired: false,
    actionUrl: '',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.title.trim() || !message.content.trim() || targetUsers.length === 0) {
      setError('Please fill in all required fields and select target users');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await messagingService.createMessage({
        ...message,
        targetUsers
      });

      setSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setMessage({
          type: 'announcement',
          title: '',
          content: '',
          priority: 'medium',
          deliveryMethod: ['in_app'],
          scheduledAt: new Date(),
          actionRequired: false,
          actionUrl: '',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        setTargetUsers([]);
        setSuccess(false);
      }, 2000);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Message creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">
        Compose Message
      </h2>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-800">Message sent successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Message Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Type
          </label>
          <select
            value={message.type}
            onChange={(e) => setMessage(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="announcement">Announcement</option>
            <option value="update">Update</option>
            <option value="survey">Survey</option>
            <option value="interview">Interview</option>
            <option value="reminder">Reminder</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={message.title}
            onChange={(e) => setMessage(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Message title..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={message.content}
            onChange={(e) => setMessage(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="Message content..."
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={message.priority}
            onChange={(e) => setMessage(prev => ({ ...prev, priority: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Delivery Methods */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Methods
          </label>
          <div className="space-y-2">
            {['email', 'in_app', 'push'].map(method => (
              <label key={method} className="flex items-center">
                <input
                  type="checkbox"
                  checked={message.deliveryMethod.includes(method as any)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMessage(prev => ({
                        ...prev,
                        deliveryMethod: [...prev.deliveryMethod, method as any]
                      }));
                    } else {
                      setMessage(prev => ({
                        ...prev,
                        deliveryMethod: prev.deliveryMethod.filter(m => m !== method)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 capitalize">{method.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Required */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={message.actionRequired}
              onChange={(e) => setMessage(prev => ({ ...prev, actionRequired: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Action Required</span>
          </label>
          
          {message.actionRequired && (
            <input
              type="url"
              value={message.actionUrl}
              onChange={(e) => setMessage(prev => ({ ...prev, actionUrl: e.target.value }))}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Action URL..."
            />
          )}
        </div>

        {/* Target Users - This would need to be populated with actual beta users */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Users * (This would be a user selector in production)
          </label>
          <textarea
            value={targetUsers.join('\n')}
            onChange={(e) => setTargetUsers(e.target.value.split('\n').filter(id => id.trim()))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter user IDs, one per line..."
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </Card>
  );
}