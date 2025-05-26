import React, { useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiFolder, 
  FiPlusCircle, 
  FiMessageSquare, 
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Define a common class for icons if you want consistency
  const iconClassName: string = "h-6 w-6";
  
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }, [logout, navigate]); 

  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className={iconClassName} /> },
    { name: 'Folders', href: '/folders', icon: <FiFolder className={iconClassName} /> },
    { name: 'AI Chat', href: '/chat', icon: <FiMessageSquare className={iconClassName} /> },
    { name: 'Stats', href: '/stats', icon: <FiBarChart2 className={iconClassName} /> },
  ];

  const bottomNavItems: NavigationItem[] = [
    { name: 'Settings', href: '/settings', icon: <FiSettings className={iconClassName} /> },
  ];
  
  // The getIcon function is no longer needed with this approach

  return (
    <div className="fixed inset-y-0 left-0 z-30 flex h-full w-20 flex-col bg-slate-900 shadow-xl transition-all duration-300 hover:w-64 group">
      {/* Logo/Brand Area */}
      <div className="flex h-16 shrink-0 items-center justify-center">
        <div className="flex items-center space-x-3 px-4">
          {/* Placeholder for your actual logo icon if you have one */}
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            E 
          </div>
          <span className="text-white font-bold text-xl hidden group-hover:block transition-opacity duration-300">
            Elevate
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 flex flex-col overflow-y-auto px-2 py-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
            title={item.name}
          >
            <span className="flex-shrink-0">{item.icon}</span> {/* Render the icon component directly */}
            <span className="ml-3 hidden group-hover:block transition-opacity duration-300">
              {item.name}
            </span>
          </NavLink>
        ))}
        
        {/* Create New Button */}
        <button
          type="button"
          className="mt-4 w-full flex items-center rounded-lg px-3 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Create New"
          // onClick={() => {/* Handle create new action */}}
        >
          <FiPlusCircle className={`${iconClassName} flex-shrink-0`} /> {/* Use the icon component directly */}
          <span className="ml-3 hidden group-hover:block transition-opacity duration-300">
            Create New
          </span>
        </button>
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto px-2 py-4 border-t border-slate-800">
        <div className="flex flex-col group-hover:flex-row group-hover:items-center group-hover:space-x-2 space-y-1 group-hover:space-y-0">
          {/* Settings NavLink */}
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group/bottom-item flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors w-full group-hover:w-auto
                ${isActive 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
              title={item.name}
            >
              <span className="flex-shrink-0 mx-auto group-hover:mx-0">{item.icon}</span> {/* Render the icon component directly */}
              <span className="ml-3 hidden group-hover:block transition-opacity duration-300">
                {item.name}
              </span>
            </NavLink>
          ))}
          
          {/* User Profile */}
          <div className="flex flex-col group-hover:flex-row group-hover:items-center group-hover:space-x-2 w-full group-hover:w-auto">
            {/* User Profile Clickable Area */}
            <Link
              to="/profile"
              className="group/bottom-item flex items-center px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer w-full group-hover:w-auto"
              title="View Profile"
            >
              <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold flex-shrink-0 mx-auto group-hover:mx-0">
                <FiUser className="h-5 w-5" /> {/* Correct direct usage */}
              </div>
              <div className="ml-3 hidden group-hover:block transition-opacity duration-300">
                <p className="text-sm font-medium text-white">User</p> {/* Replace with actual user name later */}
              </div>
            </Link>
            
            {/* Logout Button */}
            <button
              type="button"
              className="group/bottom-item w-full group-hover:w-auto flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors"
              title="Logout"
              onClick={handleLogout}
            >
              <FiLogOut className="h-5 w-5 flex-shrink-0 mx-auto group-hover:mx-0" /> {/* Correct direct usage */}
              <span className="ml-3 hidden group-hover:block transition-opacity duration-300">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;