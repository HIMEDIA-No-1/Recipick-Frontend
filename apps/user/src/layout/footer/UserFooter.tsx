import recipickLogo from '../../../assets/logo_full_m.png';

const UserFooter = () => {
    return (
        <footer className="footer_wrap w-full p-6 text-gray-700 text-sm bg-[#FAF7F2] border-t border-gray-200">
            <div className="max-w-6xl mx-auto flex flex-col items-center space-y-3 text-center">
                {/* 로고 (왼쪽 정렬 X, 그대로 중앙 위에 배치) */}
                <img
                    src={recipickLogo}
                    alt="recipick_logo"
                    className="mb-4 w-32 sm:w-40 md:w-48"
                />

                {/* 회사 정보 */}
                <div className="space-y-1">
                    <p>(주)Team No.1 | 대표 윤지연 | 서울특별시 구로구 경인로 557 삼영빌딩 4층</p>
                    <p>사업자등록번호 421-17-39502</p>
                    <p>통신판매업신고 2025-서울구로B-1423호</p>
                </div>

                {/* 연락처 */}
                <div className="space-y-1 mt-2">
                    <p>연락처 02-715-2294</p>
                    <p>이메일 team_no1@recipick.co.kr</p>
                </div>

                {/* 하단 링크 */}
                <div className="mt-3 space-x-2 text-gray-600">
                    <a href="#" className="hover:underline">사업자정보 확인</a> |
                    <a href="#" className="hover:underline"> 이용약관</a> |
                    <a href="#" className="hover:underline"> 개인정보 처리방침</a>
                </div>
            </div>
        </footer>
    );
};

export default UserFooter;
