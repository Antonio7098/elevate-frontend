import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Sets', value: '12', change: '+2', changeType: 'increase' },
          { title: 'Folders', value: '5', change: '+1', changeType: 'increase' },
          { title: 'Due Today', value: '3', change: '0', changeType: 'neutral' },
          { title: 'Study Time', value: '1.5h', change: '+0.5h', changeType: 'increase' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              {stat.change !== '0' && (
                <span className={`ml-2 text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { id: 1, action: 'Created new set', name: 'Spanish Verbs', time: '2 hours ago' },
            { id: 2, action: 'Studied', name: 'French Vocabulary', time: '1 day ago' },
            { id: 3, action: 'Created folder', name: 'Language Learning', time: '2 days ago' },
          ].map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}: {activity.name}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-4 text-right">
          <Link to="/activity" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all activity
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;