import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            U
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">User Name</h2>
            <p className="text-slate-400">user@example.com</p>
          </div>
        </div>
        <p className="text-slate-300">Your profile information will be displayed here.</p>
      </div>
    </div>
  );
};

export default ProfilePage;
