import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle, Sun, Moon } from 'lucide-react';

const FindPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleBackClick = () => {
        console.log('Navigate back to login page');
    };

    const handleEmailSubmit = async () => {
        if (!email.trim()) {
            setError('이메일을 입력해주세요');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('올바른 이메일 형식이 아닙니다');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Mock API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('비밀번호 재설정 이메일 발송:', email);
            setEmailSent(true);
        } catch (err) {
            setError('오류가 발생했습니다. 다시 시도해주세요');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setEmailSent(false);
        setEmail('');
        setError('');
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    // 최초 mount 시 body에 dark 클래스가 있으면 상태 동기화
    useEffect(() => {
        setIsDarkMode(document.body.classList.contains('dark'));
    }, []);

    // isDarkMode 변경 시 body 클래스 동기화 (더 안정적)
    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    if (emailSent) {
        return (
            <div className="min-h-screen w-full bg-[#FAF7F2] dark:bg-[#242424] flex flex-col justify-center items-center p-4">
                {isDarkMode && (
                    <style>{`
            .dark .text-[#4B4B4B] { color: #E0E0E0; }
            .dark .text-[#878787] { color: #A0A0A0; }
            .dark .bg-white { background-color: #333; }
            .dark .hover\\:bg-\\[\\#E0EBF7\\]:hover { background-color: #404040; }
            .dark .hover\\:text-\\[\\#6789A5\\]:hover { color: #8cb5e2; }
            .dark .bg-\\[\\#E0EBF7\\] { background-color: #404040; }
            .dark .bg-\\[\\#D1D1D1\\] { background-color: #404040; }
            .dark .border-\\[\\#D1D1D1\\] { border-color: #404040; }
          `}</style>
                )}

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none"
                    title={isDarkMode ? "라이트 모드" : "다크 모드"}
                >
                    {isDarkMode ? <Sun className="text-[#878787] dark:text-[#A0A0A0]" /> : <Moon className="text-[#878787]" />}
                </button>

                <div className="bg-white dark:bg-[#333] rounded-lg shadow-sm p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-[#E0EBF7] dark:bg-[#404040] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-[#6789A5] dark:text-[#8cb5e2]" />
                    </div>

                    <h2 className="text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-4">이메일이 발송되었습니다</h2>

                    <p className="text-[#878787] dark:text-[#A0A0A0] mb-6">
                        <span className="font-medium">{email}</span>로<br />
                        비밀번호 재설정 링크를 보내드렸습니다.<br />
                        이메일을 확인하여 비밀번호를 재설정해주세요.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleRetry}
                            className="w-full px-6 py-3 bg-[#6789A5] hover:bg-[#5A7E9D] text-white font-medium rounded-lg transition-colors"
                        >
                            다른 이메일로 시도
                        </button>

                        <button
                            onClick={handleBackClick}
                            className="w-full px-6 py-3 border border-[#D1D1D1] dark:border-[#404040] text-[#4B4B4B] dark:text-[#E0E0E0] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] font-medium rounded-lg transition-colors"
                        >
                            로그인 페이지로
                        </button>
                    </div>

                    <p className="text-sm text-[#878787] dark:text-[#A0A0A0] mt-6">
                        이메일이 오지 않았나요? 스팸 폴더를 확인해보세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAF7F2] dark:bg-[#242424] flex flex-col justify-center items-center p-4">
            {isDarkMode && (
                <style>{`
          .dark .text-[#4B4B4B] { color: #E0E0E0; }
          .dark .text-[#878787] { color: #A0A0A0; }
          .dark .bg-white { background-color: #333; }
          .dark .hover\\:bg-\\[\\#E0EBF7\\]:hover { background-color: #404040; }
          .dark .hover\\:text-\\[\\#6789A5\\]:hover { color: #8cb5e2; }
          .dark .bg-\\[\\#E0EBF7\\] { background-color: #404040; }
          .dark .bg-\\[\\#D1D1D1\\] { background-color: #404040; }
          .dark .border-\\[\\#D1D1D1\\] { border-color: #404040; }
          .dark .focus\\:ring-\\[\\#6789A5\\]:focus { --tw-ring-color: #8cb5e2; }
          .dark .text-red-500 { color: #FF7F7F; }
          .dark .bg-\\[\\#6789A5\\] { background-color: #5A7E9D; }
        `}</style>
            )}

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none"
                title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
                {isDarkMode ? <Sun className="text-[#878787] dark:text-[#A0A0A0]" /> : <Moon className="text-[#878787]" />}
            </button>

            {/* 헤더 */}
            <div className="w-full max-w-md mb-6">
                <button
                    onClick={handleBackClick}
                    className="flex items-center text-[#878787] dark:text-[#A0A0A0] hover:text-[#6789A5] dark:hover:text-[#8cb5e2] transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    로그인으로 돌아가기
                </button>
            </div>

            {/* 로고 섹션 */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#6789A5] dark:text-[#8cb5e2] mb-2">Recipick</h1>
                <p className="text-[#878787] dark:text-[#A0A0A0]">비밀번호를 잊으셨나요?</p>
            </div>

            {/* 비밀번호 찾기 카드 */}
            <div className="bg-white dark:bg-[#333] rounded-lg shadow-sm p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#E0EBF7] dark:bg-[#404040] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#6789A5] dark:text-[#8cb5e2]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">비밀번호 찾기</h2>
                    <p className="text-[#878787] dark:text-[#A0A0A0] text-sm">
                        가입할 때 사용한 이메일 주소를 입력하시면<br />
                        비밀번호 재설정 링크를 보내드립니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
                            이메일 주소
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            placeholder="example@recipick.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                error
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-[#D1D1D1] dark:border-[#404040] focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2]'
                            }`}
                        />
                        {error && (
                            <p className="text-red-500 dark:text-[#FF7F7F] text-xs mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleEmailSubmit}
                        disabled={loading}
                        className="w-full bg-[#6789A5] hover:bg-[#5A7E9D] disabled:bg-[#D1D1D1] disabled:text-[#878787] text-white font-medium py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {loading ? '전송 중...' : '재설정 링크 보내기'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#878787] dark:text-[#A0A0A0]">
                        계정이 없으시다면?{' '}
                        <button
                            onClick={() => console.log('Navigate to signup')}
                            className="text-[#6789A5] dark:text-[#8cb5e2] hover:text-[#5A7E9D] dark:hover:text-[#8cb5e2] font-medium"
                        >
                            회원가입
                        </button>
                    </p>
                </div>
            </div>

            {/* 푸터 */}
            <div className="mt-8 text-center text-[#878787] dark:text-[#A0A0A0]">
                <p>© 2024 Recipick. All rights reserved.</p>
            </div>
        </div>
    );
};

export default FindPasswordPage;
