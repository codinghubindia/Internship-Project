import React from 'react';
import { Calendar, Tag, User, Eye, Edit3 } from 'lucide-react';

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

interface SessionCardProps {
  session: Session;
  showAuthor?: boolean;
  onEdit?: (sessionId: string) => void;
  onView?: (session: Session) => void;
}

/**
 * Session Card Component
 * Displays session information in a card format
 */
const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  showAuthor = false, 
  onEdit, 
  onView 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {session.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
            {session.status}
          </span>
        </div>

        {/* Tags */}
        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {session.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {session.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{session.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Author (if showing author) */}
        {showAuthor && session.user_id && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <User className="h-4 w-4 mr-1" />
            <span>{session.user_id.email}</span>
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            Created {formatDate(session.created_at)}
            {session.updated_at !== session.created_at && (
              <span className="ml-2">• Updated {formatDate(session.updated_at)}</span>
            )}
          </span>
        </div>

        {/* JSON URL Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 truncate">
            <strong>URL:</strong> {session.json_file_url}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={() => onView?.(session)}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </button>
          
          {onEdit && (
            <button
              onClick={() => onEdit(session._id)}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;