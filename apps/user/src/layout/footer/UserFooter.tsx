import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
// 이미지가 로컬 파일 시스템에 없어 컴파일 오류가 발생하므로, 임시로 플레이스홀더를 사용합니다.
const recipickLogo = "https://placehold.co/160x40/6789A5/FFFFFF?text=Recipick";

const UserFooter = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

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
        <footer className="footer_wrap w-full p-6 text-sm text-center bg-[#FAF7F2] dark:bg-[#242424] border-t border-[#D1D1D1] dark:border-[#404040]">
            {isDarkMode && (
                <style>{`
                    .dark .text-gray-700 { color: #E0E0E0; }
                    .dark .text-gray-400 { color: #A0A0A0; }
                `}</style>
            )}

            {/* 다크 모드 토글 버튼 */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none"
                title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
                {isDarkMode ? <Sun className="text-[#878787] dark:text-[#A0A0A0]" /> : <Moon className="text-[#878787]" />}
            </button>

            <div className="max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
                <img
                    src={recipickLogo}
                    alt="recipick_logo"
                    className="mb-4 mx-auto w-32 sm:w-40 md:w-48"
                />
                <div className="leading-6">
                    <span>(주)Team No.1 | 대표 윤지연 | 서울특별시 구로구 경인로 557 삼영빌딩 4층</span><br />
                    <span>사업자등록번호 421-17-39502</span><br />
                    <span>통신판매업신고 2025-서울구로B-1423호</span><br />
                    <br />
                    <span>연락처 02-715-2294</span><br />
                    <span>이메일 team_no1@recipick.co.kr</span><br />
                    <br />
                    <span className="cursor-pointer hover:text-[#6789A5] dark:hover:text-[#8cb5e2] transition-colors">사업자정보 확인</span> | <span className="cursor-pointer hover:text-[#6789A5] dark:hover:text-[#8cb5e2] transition-colors">이용약관</span> | <span className="cursor-pointer hover:text-[#6789A5] dark:hover:text-[#8cb5e2] transition-colors">개인정보 처리방침</span>
                </div>
            </div>
        </footer>
    );
}

export default UserFooter;
