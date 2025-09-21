import recipickLogo from '../../../assets/logo_full_m.png';
const UserFooter = () => {
    return (
        <footer className="footer_wrap w-full text-left p-4 text-gray-700 text-sm mr-auto">
            <img src={recipickLogo} alt={"recipick_logo"} className={"mb-4 w-32 sm:w-40 md:w-48"} />
            <span>(주)Team No.1 | 대표 윤지연 | 서울특별시 구로구 경인로 557 삼영빌딩 4층</span><br />
            <span>사업자등록번호 421-17-39502</span><br />
            <span>통신판매업신고 2025-서울구로B-1423호</span><br />
            <br />
            <span>연락처 02-715-2294</span><br />
            <span>이메일 team_no1@recipick.co.kr</span><br />
            <br />
            <span>사업자정보 확인</span> | <span>이용약관</span> | <span>개인정보 처리방침</span>
            {/* <BizInfo />     <TermsOfService >   <Privacy /> */}
        </footer>
    );
}

export default UserFooter;