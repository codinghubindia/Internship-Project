import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';
import { PlusCircle, FileText, Search } from 'lucide-react';
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
 * My Sessions Page Component
 * Displays user's own sessions (drafts and published)
 */
const MySessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch user's sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${API_URL}/my-sessions`);
        setSessions(response.data.sessions);
        setFilteredSessions(response.data.sessions);
      } catch (error: any) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load your sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [API_URL]);

  // Filter sessions based on search term and status
  useEffect(() => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter]);

  const handleEditSession = (sessionId: string) => {
    navigate(`/session-editor/${sessionId}`);
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
  };

  const handlePublishSession = async (sessionId: string) => {
    try {
      await axios.post(`${API_URL}/sessions/my-sessions/publish`, {
        sessionId
      });

      // Update local state
      setSessions(prevSessions =>
        prevSessions.map(session =>
          session._id === sessionId
            ? { ...session, status: 'published' as const }
            : session
        )
      );

      toast.success('Session published successfully!');
    } catch (error: any) {
      console.error('Error publishing session:', error);
      toast.error('Failed to publish session');
    }
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  const draftCount = sessions.filter(s => s.status === 'draft').length;
  const publishedCount = sessions.filter(s => s.status === 'published').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your wellness sessions and drafts
            </p>
          </div>
          <button
            onClick={() => navigate('/session-editor')}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Session</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Sessions
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {sessions.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Drafts
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {draftCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Published
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {publishedCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Sessions
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search by title or tags..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Sessions</option>
                <option value="draft">Drafts Only</option>
                <option value="published">Published Only</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredSessions.length} of {sessions.length} sessions
            </span>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {sessions.length === 0 ? 'No sessions yet' : 'No sessions found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {sessions.length === 0 
                ? 'Get started by creating your first wellness session.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {sessions.length === 0 && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/session-editor')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create your first session
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map(session => (
              <div key={session._id} className="relative">
                <SessionCard
                  session={session}
                  onEdit={handleEditSession}
                  onView={handleViewSession}
                />
                {session.status === 'draft' && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handlePublishSession(session._id)}
                      className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      Publish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Session Details
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="py-4">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedSession.title}
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSession.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSession.status}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Tags:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedSession.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">JSON File URL:</span>
                    <a 
                      href={selectedSession.json_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-600 hover:text-indigo-700 break-all"
                    >
                      {selectedSession.json_file_url}
                    </a>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(selectedSession.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {selectedSession.updated_at !== selectedSession.created_at && (
                    <div>
                      <span className="font-medium text-gray-700">Last Updated:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(selectedSession.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                {selectedSession.status === 'draft' && (
                  <button
                    onClick={() => {
                      handlePublishSession(selectedSession._id);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => {
                    handleEditSession(selectedSession._id);
                    closeModal();
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;