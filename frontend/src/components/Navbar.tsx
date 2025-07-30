import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Menu, X } from 'lucide-react';

/**
 * Responsive Navigation Bar component
 * - Shows different nav options based on user's authentication status
 * - Includes mobile dropdown for smaller screens
 */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth(); // Custom context hook for auth
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false); // Controls mobile menu

  /**
   * Logs out the user and redirects to login page
   */
  const handleLogout = () => {
    logout(); // clears auth context
    navigate('/login');
    setMobileOpen(false); // Close mobile menu after logout
  };

  /**
   * Checks if a nav link is active (used for highlighting current page)
   */
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* App Logo (Clickable) */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700"
          >
            <Heart className="h-6 w-6" />
            <span>WellnessHub</span>
          </Link>

          {/* Hamburger icon - visible only on small screens */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-indigo-600"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation - visible on medium+ screens */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>

                {/* My Sessions Link */}
                <Link
                  to="/my-sessions"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/my-sessions')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  My Sessions
                </Link>

                {/* User Email & Logout Section */}
                <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login / Register for non-authenticated users */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown - visible only when menu is open on small screens */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {user ? (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>

              {/* My Sessions */}
              <Link
                to="/my-sessions"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/my-sessions')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                My Sessions
              </Link>

              {/* User Info + Logout */}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 mt-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login and Register Buttons for Mobile */}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
