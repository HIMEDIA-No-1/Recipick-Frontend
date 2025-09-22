import React from 'react';

const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 Recipick. All rights reserved.
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Admin Panel v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;