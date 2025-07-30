import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, Send, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Session {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

/**
 * Session Editor Page Component
 * Allows creating and editing wellness sessions with auto-save functionality
 */
const SessionEditor: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    json_file_url: ''
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load existing session if editing
  useEffect(() => {
    if (sessionId) {
      const fetchSession = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/my-sessions/${sessionId}`);
          const session: Session = response.data.session;
          
          setFormData({
            title: session.title,
            tags: session.tags.join(', '),
            json_file_url: session.json_file_url
          });
          setCurrentSessionId(session._id);
          setLastSaved(new Date(session.updated_at));
        } catch (error: any) {
          console.error('Error fetching session:', error);
          toast.error('Failed to load session');
          navigate('/my-sessions');
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      };

      fetchSession();
    } else {
      setInitialLoad(false);
    }
  }, [sessionId, API_URL, navigate]);

  // Auto-save functionality with debouncing
  const saveDraft = useCallback(async (data: typeof formData, showToast = false) => {
    if (!data.title.trim() || !data.json_file_url.trim()) {
      return; // Don't save empty sessions
    }

    try {
      setSaving(true);
      const response = await axios.post(`${API_URL}/my-sessions/save-draft`, {
        title: data.title.trim(),
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        json_file_url: data.json_file_url.trim(),
        sessionId: currentSessionId
      });

      if (!currentSessionId) {
        setCurrentSessionId(response.data.session._id);
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      if (showToast) {
        toast.success('Draft saved successfully!');
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      if (showToast) {
        toast.error('Failed to save draft');
      }
    } finally {
      setSaving(false);
    }
  }, [API_URL, currentSessionId]);

  // Debounced auto-save effect
  useEffect(() => {
    if (initialLoad || (!formData.title.trim() && !formData.json_file_url.trim())) {
      return;
    }

    setHasUnsavedChanges(true);
    
    const timeoutId = setTimeout(() => {
      saveDraft(formData);
    }, 5000); // Auto-save after 5 seconds of no typing

    return () => clearTimeout(timeoutId);
  }, [formData, saveDraft, initialLoad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.json_file_url.trim()) {
      toast.error('Please fill in title and JSON file URL');
      return;
    }

    await saveDraft(formData, true);
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.json_file_url.trim()) {
      toast.error('Please fill in title and JSON file URL');
      return;
    }

    try {
      setPublishing(true);

      // Save as draft first if there are unsaved changes
      if (hasUnsavedChanges) {
        await saveDraft(formData);
      }

      // Then publish
      await axios.post(`${API_URL}/my-sessions/publish`, {
        sessionId: currentSessionId
      });

      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (error: any) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/my-sessions')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to My Sessions</span>
            </button>
          </div>
          
          {/* Auto-save Status */}
          <div className="flex items-center space-x-4">
            {saving && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span>Saving...</span>
              </div>
            )}
            
            {hasUnsavedChanges && !saving && (
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            
            {lastSaved && !hasUnsavedChanges && !saving && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Clock className="h-4 w-4" />
                <span>
                  Saved {lastSaved.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {sessionId ? 'Edit Session' : 'Create New Session'}
            </h1>
            <p className="text-gray-600 mt-1">
              {sessionId 
                ? 'Update your wellness session details below.' 
                : 'Fill in the details below to create your wellness session.'}
            </p>
          </div>

          <div className="p-6">
            <form className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter a descriptive title for your session"
                  maxLength={200}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.title.length}/200 characters
                </p>
              </div>

              {/* Tags Field */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="yoga, meditation, mindfulness (separate with commas)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Add tags to help others discover your session. Separate multiple tags with commas.
                </p>
              </div>

              {/* JSON File URL Field */}
              <div>
                <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700 mb-2">
                  JSON File URL *
                </label>
                <textarea
                  id="json_file_url"
                  name="json_file_url"
                  required
                  rows={3}
                  value={formData.json_file_url}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="https://example.com/path/to/your/session-data.json"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide the URL to your JSON file containing the session data and instructions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving || (!formData.title.trim() || !formData.json_file_url.trim())}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save as Draft</span>
                </button>
                
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing || saving || (!formData.title.trim() || !formData.json_file_url.trim())}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {publishing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Publish Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Auto-save Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Auto-save Enabled
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your work is automatically saved as a draft every 5 seconds after you stop typing. 
                  You can manually save at any time or publish when ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionEditor;