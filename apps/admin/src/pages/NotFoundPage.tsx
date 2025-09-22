import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode);
  };

  useEffect(() => {
    if (document.body.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  // @ts-ignore
    return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex flex-col justify-center items-center p-4">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none hover:bg-[#D1D1D1] dark:hover:bg-[#404040]"
        title={isDarkMode ? "라이트 모드" : "다크 모드"}
      >
        {isDarkMode ? (
          <svg className="w-5 h-5 text-[#878787] dark:text-[#A0A0A0]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#878787]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-[#F0EEEB] dark:text-[#383838] select-none">404</div>
            {/* Admin Badge */}
            <div className="absolute top-4 right-0 bg-[#6789A5] text-white px-3 py-1 rounded-full text-sm font-medium transform rotate-12">
              Admin
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-4">
            관리자 페이지를 찾을 수 없습니다
          </h1>
          <p className="text-[#878787] dark:text-[#A0A0A0] mb-2">
            요청하신 관리자 페이지가 존재하지 않거나 접근 권한이 없을 수 있습니다.
          </p>
          <p className="text-sm text-[#878787] dark:text-[#A0A0A0]">
            URL을 다시 확인하시거나 아래 버튼을 이용해 주세요.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#6789A5] hover:bg-[#5A7E9D] text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            관리자 대시보드로 이동
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#D1D1D1] dark:border-[#404040] text-[#4B4B4B] dark:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전 페이지
            </button>

            <button
              onClick={() => navigate('/auth')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#6789A5] text-[#6789A5] hover:bg-[#6789A5] hover:text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그인
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-[#333] rounded-lg p-4 border border-[#D1D1D1] dark:border-[#404040]">
            <p className="text-sm text-[#878787] dark:text-[#A0A0A0] mb-2">
              기술적 문제가 지속되시면 시스템 관리자에게 문의해 주세요.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-[#878787] dark:text-[#A0A0A0]">
              <span>admin@recipick.com</span>
              <span>•</span>
              <span>내선: 1234</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#E0EBF7] dark:bg-[#404040] rounded-full opacity-30"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-[#E0EBF7] dark:bg-[#404040] rounded-full opacity-40"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#E0EBF7] dark:bg-[#404040] rounded-full opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-28 h-28 bg-[#E0EBF7] dark:bg-[#404040] rounded-full opacity-30"></div>

        {/* Admin-specific decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-[#6789A5] rounded-lg opacity-20 transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-[#6789A5] rounded-full opacity-30"></div>
      </div>

      {/* Custom styles for better dark mode support */}
      <style>{`
        .dark .text-[#4B4B4B] { color: #E0E0E0; }
        .dark .text-[#878787] { color: #A0A0A0; }
        .dark .bg-[#FAF7F2] { background-color: #242424; }
        .dark .border-[#D1D1D1] { border-color: #404040; }
        .dark .bg-white { background-color: #333; }
        .dark .shadow-md { box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06); }
      `}</style>
    </div>
  );
};

export default NotFoundPage;