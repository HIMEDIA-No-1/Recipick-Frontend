import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] dark:bg-[#242424] text-[#4B4B4B] dark:text-[#E0E0E0]">
      <AdminHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;