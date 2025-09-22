import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  errorMessage?: string;
  errorCode?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorMessage = "예상치 못한 시스템 오류가 발생했습니다.",
  errorCode = "ERROR_500"
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReportError = () => {
    console.log('Report error:', {
      errorCode,
      errorMessage,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-[#E0EBF7] dark:bg-[#404040] rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-[#6789A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          {/* Admin Badge */}
          <div className="mt-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-block">
            System Error
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-4">
            시스템 오류 발생
          </h1>
          <p className="text-[#878787] dark:text-[#A0A0A0] text-lg mb-2">
            {errorMessage}
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              오류 코드: <span className="font-mono font-semibold">{errorCode}</span>
            </p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              발생 시간: {new Date().toLocaleString('ko-KR')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#6789A5] hover:bg-[#5A7E9D] text-white font-medium rounded-lg transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            페이지 새로고침
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#D1D1D1] dark:border-[#404040] text-[#4B4B4B] dark:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              대시보드
            </button>

            <button
              onClick={handleReportError}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              오류 신고
            </button>
          </div>
        </div>

        {/* Help Information */}
        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-[#333] rounded-lg p-4 border border-[#D1D1D1] dark:border-[#404040]">
            <h3 className="text-sm font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
              즉시 지원이 필요하신가요?
            </h3>
            <p className="text-sm text-[#878787] dark:text-[#A0A0A0] mb-3">
              시스템 관리자에게 직접 문의하시면 빠른 지원을 받으실 수 있습니다.
            </p>
            <div className="flex flex-col gap-2 text-xs text-[#878787] dark:text-[#A0A0A0]">
              <div className="flex items-center justify-between">
                <span>긴급 지원:</span>
                <span className="font-mono">admin@recipick.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span>내선 번호:</span>
                <span className="font-mono">1234</span>
              </div>
              <div className="flex items-center justify-between">
                <span>운영 시간:</span>
                <span>평일 09:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#333] rounded-lg shadow-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-3">
                오류 신고 완료
              </h2>
              <p className="text-[#878787] dark:text-[#A0A0A0] mb-6 text-sm">
                오류 신고가 시스템 관리자에게 전송되었습니다.<br />
                빠른 시일 내에 문제를 해결하겠습니다.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 bg-[#6789A5] hover:bg-[#5A7E9D] text-white font-medium rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#E0EBF7] dark:bg-[#404040] rounded-full opacity-20"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#E0EBF7] dark:bg-[#404040] rounded-full opacity-15"></div>
        <div className="absolute bottom-20 left-10 w-28 h-28 bg-red-100 dark:bg-red-900/20 rounded-full opacity-25"></div>

        {/* Warning patterns */}
        <div className="absolute top-1/3 left-1/3 w-8 h-8 border-2 border-red-300 dark:border-red-800 rounded-lg opacity-20 transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 border-2 border-red-300 dark:border-red-800 rounded-full opacity-30"></div>
      </div>
    </div>
  );
};

export default ErrorPage;