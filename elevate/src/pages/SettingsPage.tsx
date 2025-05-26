import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <div className="bg-slate-800 rounded-lg p-6">
        <p className="text-slate-300">Application settings will be configured here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
