import { Outlet } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AuthenticatedLayoutProps {
  children?: ReactNode;
}

const AuthenticatedLayout: FC<AuthenticatedLayoutProps> = () => {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 ml-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
