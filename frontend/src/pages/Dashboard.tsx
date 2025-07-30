import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';
import { Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface Session {
  _id: string;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id?: {
    email: string;
  };
}

/**
 * Dashboard Page Component
 * Displays all published wellness sessions
 */
const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch published sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${API_URL}/sessions`);
        setSessions(response.data.sessions);
        setFilteredSessions(response.data.sessions);
      } catch (error: any) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [API_URL]);

  // Filter sessions based on search term and selected tag
  useEffect(() => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(session =>
        session.tags.includes(selectedTag)
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, selectedTag]);

  // Get all unique tags
  const allTags = Array.from(
    new Set(sessions.flatMap(session => session.tags))
  ).sort();

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

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
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Wellness Sessions
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Welcome back, {user?.email}! Explore wellness sessions created by our community.
          </p>
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

            {/* Filter by Tag */}
            <div>
              <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Tag
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="tag-filter"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredSessions.length} of {sessions.length} sessions
            </span>
            {(searchTerm || selectedTag) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
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
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No published sessions available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map(session => (
              <SessionCard
                key={session._id}
                session={session}
                showAuthor={true}
                onView={handleViewSession}
              />
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
                    <span className="font-medium text-gray-700">Author:</span>
                    <span className="ml-2 text-gray-600">{selectedSession.user_id?.email ?? 'Unknown'}</span>
                  </div>
                  
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
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
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

export default Dashboard;