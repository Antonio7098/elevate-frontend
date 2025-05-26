import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchTodaysReviews } from '../services/reviewService';
import type { ReviewItem } from '../types/review';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📋 [DashboardPage] Component mounted, starting data fetch');
    
    const loadTodaysReviews = async () => {
      console.log('🔍 [DashboardPage] Starting to fetch today\'s reviews');
      setIsLoading(true);
      setError(null);
      
      try {
        // Log the current auth token for debugging
        const token = localStorage.getItem('authToken');
        console.log('🔑 [DashboardPage] Current auth token:', token ? 'Token exists' : 'No token found');
        
        console.log('⏳ [DashboardPage] Calling fetchTodaysReviews API...');
        const data = await fetchTodaysReviews();
        
        console.log('✅ [DashboardPage] Successfully fetched reviews:', data);
        setReviews(data);
      } catch (err: any) {
        console.error('❌ [DashboardPage] Failed to load reviews:', err);
        
        // More detailed error handling
        if (err.response) {
          // The request was made and the server responded with a status code
          console.error('📊 [DashboardPage] Error response data:', err.response.data);
          console.error('🔑 [DashboardPage] Error headers:', err.response.headers);
          
          if (err.response.status === 401) {
            setError('Your session has expired. Please log in again.');
          } else {
            setError(`Error: ${err.response.status} - ${err.response.data?.message || 'Failed to load reviews'}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error('❌ [DashboardPage] No response received:', err.request);
          setError('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request
          console.error('❌ [DashboardPage] Request setup error:', err.message);
          setError(`Error: ${err.message}`);
        }
      } finally {
        console.log('🏁 [DashboardPage] Finished loading reviews');
        setIsLoading(false);
      }
    };

    loadTodaysReviews();
    
    // Cleanup function
    return () => {
      console.log('🧹 [DashboardPage] Cleaning up...');
    };
  }, []);
  
  console.log('DashboardPage: Rendering with state:', { isLoading, error, reviews });

  const handleStartReview = () => {
    if (reviews.length > 0) {
      navigate('/review');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#user-menu') && !target.closest('#user-menu-item-2')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Elevate Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Overview
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      U
                    </div>
                  </button>
                </div>
                {isUserMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    tabIndex={-1}
                  >
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
            <p className="mt-2 text-gray-600">Here's what's happening with your reviews today.</p>
          </div>

          {/* Review Queue Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Today's Review Queue</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {isLoading ? '...' : reviews.length} cards
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your review queue...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Try again
                  </button>
                </div>
              ) : reviews.length > 0 ? (
                <div>
                  <ul className="divide-y divide-gray-200">
                    {reviews.slice(0, 5).map((review) => (
                      <li key={review.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {review.question}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              Due: {format(new Date(review.dueDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {reviews.length > 5 && (
                    <p className="mt-2 text-sm text-gray-500">
                      +{reviews.length - 5} more cards to review
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews due today. Great job! 🎉</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={handleStartReview}
                disabled={isLoading || reviews.length === 0}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${reviews.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isLoading ? 'Loading...' : 'Start Review Session'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Create New Set</h3>
                <p className="mt-1 text-sm text-gray-500">Start a new set of flashcards</p>
                <div className="mt-5">
                  <Link
                    to="/sets/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Set
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Browse Folders</h3>
                <p className="mt-1 text-sm text-gray-500">View and organize your study materials</p>
                <div className="mt-5">
                  <Link
                    to="/folders"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Folders
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
                <p className="mt-1 text-sm text-gray-500">Track your learning progress</p>
                <div className="mt-5">
                  <Link
                    to="/stats"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Stats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
