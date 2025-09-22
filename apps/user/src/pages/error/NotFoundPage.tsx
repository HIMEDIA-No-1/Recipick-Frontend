import { useState, useEffect } from 'react';
import { Home, Sun, Moon } from 'lucide-react';

const NotFoundPage = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);


    const handleGoHome = () => {
        window.location.href = '/';
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

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex flex-col justify-center items-center p-4">
            {isDarkMode && (
                <style>{`
                    .dark .text-[#4B4B4B] { color: #E0E0E0; }
                    .dark .text-[#878787] { color: #A0A0A0; }
                    .dark .bg-[#FAF7F2] { background-color: #242424; }
                    .dark .border-[#D1D1D1] { border-color: #404040; }
                    .dark .bg-white { background-color: #333; }
                    .dark .shadow-sm { box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.05); }
                    .dark .hover:bg-[#E0EBF7]:hover { background-color: #404040; }
                    .dark .hover\\:text-\\[\\#6789A5\\]:hover { color: #8cb5e2; }
                `}</style>
            )}

            {/* 다크모드 토글 */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none"
                title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
                {isDarkMode ? <Sun className="text-[#878787] dark:text-[#A0A0A0]" /> : <Moon className="text-[#878787]" />}
            </button>

            <div className="max-w-lg w-full text-center">
                {/* 404 숫자 */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="text-9xl font-bold text-[#F0EEEB] dark:text-[#383838] select-none">404</div>
                    </div>
                </div>
                {/* 메시지 */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-4">페이지를 찾을 수 없어요</h1>
                    <p className="text-[#878787] dark:text-[#A0A0A0] mb-2">
                        요청하신 페이지가 존재하지 않거나 이동되었을 수 있어요.
                    </p>
                    <p className="text-sm text-[#878787] dark:text-[#A0A0A0]">
                        주소를 다시 확인해주시거나 아래 버튼을 이용해주세요.
                    </p>
                </div>
                {/* 버튼들 */}
                <button
                    onClick={handleGoHome}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#6789A5] hover:bg-[#5A7E9D] text-white font-medium rounded-lg transition-colors"
                >
                    <Home className="w-5 h-5" />
                    홈으로 이동
                </button>
                {/* 도움말 */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-[#878787] dark:text-[#A0A0A0]">
                        여전히 문제가 있으시면 고객센터로 문의해 주세요.
                    </p>
                    <p className="text-xs text-[#878787] dark:text-[#A0A0A0] mt-2">
                        support@recipick.com
                    </p>
                </div>
            </div>
            {/* 배경 장식 */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 right-10 w-32 h-32 bg-[#E0EBF7] rounded-full opacity-30"></div>
                <div className="absolute top-40 left-20 w-24 h-24 bg-[#E0EBF7] rounded-full opacity-40"></div>
                <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#E0EBF7] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-10 w-28 h-28 bg-[#E0EBF7] rounded-full opacity-30"></div>
            </div>
        </div>
    );
};

export default NotFoundPage;
