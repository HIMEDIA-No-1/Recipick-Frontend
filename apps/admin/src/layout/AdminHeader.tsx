import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const AdminHeader: React.FC = () => {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const storedState = localStorage.getItem('admin_state');
    if (storedState) {
      const adminState = JSON.parse(storedState);
      setAdminInfo(adminState.adminInfo);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('admin_state');
      navigate('/auth');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: '대시보드' },
    { path: '/users', label: '사용자 관리' },
    { path: '/contents', label: '콘텐츠 관리' }
  ];

  return (
    <header className="bg-[#FAF7F2] dark:bg-[#333333] shadow-sm border-b border-[#D1D1D1] dark:border-[#404040]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-[#6789A5] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="ml-2 text-xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0]">
                Recipick Admin
              </span>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex space-x-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#6789A5] text-white'
                    : 'text-[#878787] hover:text-[#4B4B4B] dark:text-[#A0A0A0] dark:hover:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* 관리자 정보 및 액션 */}
          <div className="flex items-center space-x-3">
            {/* 다크모드 토글 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#878787] hover:text-[#4B4B4B] dark:text-[#A0A0A0] dark:hover:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] rounded-lg transition-colors"
              title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {adminInfo && (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0]">
                    {adminInfo.name}
                  </div>
                  <div className="text-xs text-[#878787] dark:text-[#A0A0A0]">
                    관리자
                  </div>
                </div>
                <div className="h-8 w-8 bg-[#E0EBF7] dark:bg-[#404040] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-[#6789A5]">
                    {adminInfo.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="md:hidden border-t border-[#D1D1D1] dark:border-[#404040] pt-4 pb-3">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#6789A5] text-white'
                    : 'text-[#878787] hover:text-[#4B4B4B] dark:text-[#A0A0A0] dark:hover:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;