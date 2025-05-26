import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiSave, FiUser, FiMail, FiCalendar, FiClock } from 'react-icons/fi';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update profile logic
    console.log('Updating profile with:', formData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const memberSince = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FiEdit2 style={{ marginRight: '0.5rem' }} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 bg-slate-800 p-2 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors">
                  <FiEdit2 size={16} style={{ color: '#cbd5e1' }} />
                </button>
              )}
            </div>
            <div className="text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white text-xl font-semibold w-full"
                    autoFocus
                  />
                  <div className="text-slate-400 text-sm flex items-center justify-center sm:justify-start">
                    <FiMail size={16} style={{ marginRight: '0.5rem' }} />
                    {user?.email}
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
                  <p className="text-slate-300 mt-1">{user?.email || 'user@example.com'}</p>
                  <div className="mt-2 text-sm text-slate-400 flex items-center justify-center sm:justify-start">
                    <FiCalendar size={16} style={{ marginRight: '0.375rem' }} />
                    Member since {memberSince}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser size={20} style={{ color: '#64748b' }} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 block w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail size={20} style={{ color: '#64748b' }} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="pl-10 block w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-3 text-slate-400 cursor-not-allowed"
                        placeholder="Email address"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Contact support to change your email address
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || ''
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <div className="flex items-center">
                    <FiSave size={16} style={{ marginRight: '0.5rem' }} />
                    Save Changes
                  </div>
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-slate-700/50">
              <div className="py-4">
                <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Full Name</h4>
                    <p className="text-white">{user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Email Address</h4>
                    <p className="text-white">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Member Since</h4>
                    <div className="flex items-center text-white">
                      <FiCalendar size={16} style={{ marginRight: '0.5rem', color: '#94a3b8' }} />
                      {memberSince}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Last Active</h4>
                    <div className="flex items-center text-white">
                      <FiClock size={16} style={{ marginRight: '0.5rem', color: '#94a3b8' }} />
                      Just now
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <h3 className="text-lg font-medium text-white mb-4">Account Security</h3>
                <div className="space-y-3">
                  <button className="w-full flex justify-between items-center p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <div>
                      <h4 className="text-sm font-medium text-white text-left">Change Password</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Update your account password</p>
                    </div>
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex justify-between items-center p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <div>
                      <h4 className="text-sm font-medium text-white text-left">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security</p>
                    </div>
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
