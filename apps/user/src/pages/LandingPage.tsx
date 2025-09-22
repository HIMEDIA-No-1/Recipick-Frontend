import React, { useState, useEffect, useRef } from "react";
import {
    Scan,
    Receipt,
    Pencil,
    Users,
    Refrigerator,
    Bell,
    BellDot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import fridgeImg from "../../assets/fridge.jpg";
import shoppingCart from "../../assets/shopping.jpg";
import bestBy from "../../assets/bestby.jpg";
import webApp from "../../assets/webapp.jpg";
import register from "../../assets/register.jpg";

// CSS 애니메이션 정의
const animations = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes popIn {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
`;

const LandingPage = () => {
    const navigate = useNavigate();

    const page1Ref = useRef(null);
    const page2Ref = useRef(null);
    const page3Ref = useRef(null);
    const page4Ref = useRef(null);
    const page5Ref = useRef(null);

    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isVisible4, setIsVisible4] = useState(false);
    const [isVisible5, setIsVisible5] = useState(false);
    const [activeTab3, setActiveTab3] = useState(0);
    const [activeTab4, setActiveTab4] = useState(0);
    const [activeTab5, setActiveTab5] = useState(0);

    const tabs3 = [
        { title: "바코드", content: "바코드만 쓱! 바로 스캔해서 등록하세요", icon: Scan },
        { title: "명세표/영수증", content: "영수증만 찍어주면 한 번에 등록 가능!", icon: Receipt },
        { title: "직접 입력", content: "용도에 따라 내가 원하는 대로 입력해요", icon: Pencil },
    ];

    const tabs4 = [
        { title: "냉장고 추가", content: "보관 위치, 상품, 용도별로 냉장고를 무제한으로 추가해서 관리하세요!", icon: Refrigerator },
        { title: "냉장고 공유", content: "가족, 친구, 룸메이트.. 모두와 냉장고를 실시간으로 공유하고 함께 관리하세요", icon: Users },
    ];

    const tabs5 = [
        { title: "대신등록 알림", content: "스토어에서 구매한 제품 정보가 자동으로 등록 완료!", icon: Bell },
        { title: "유통기한 임박 알림", content: "원하는 날짜, 원하는 시간에 유통기한 임박 알림을 보내드려요!", icon: BellDot },
    ];

    useEffect(() => {
        const observerOptions = { root: null, rootMargin: "0px", threshold: 0.3 };

        const createObserver = (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
            new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setter(true);
                }
            }, observerOptions);

        const obs1 = createObserver(setIsVisible1);
        const obs2 = createObserver(setIsVisible2);
        const obs3 = createObserver(setIsVisible3);
        const obs4 = createObserver(setIsVisible4);
        const obs5 = createObserver(setIsVisible5);

        if (page1Ref.current) obs1.observe(page1Ref.current);
        if (page2Ref.current) obs2.observe(page2Ref.current);
        if (page3Ref.current) obs3.observe(page3Ref.current);
        if (page4Ref.current) obs4.observe(page4Ref.current);
        if (page5Ref.current) obs5.observe(page5Ref.current);

        return () => {
            if (page1Ref.current) obs1.unobserve(page1Ref.current);
            if (page2Ref.current) obs2.unobserve(page2Ref.current);
            if (page3Ref.current) obs3.unobserve(page3Ref.current);
            if (page4Ref.current) obs4.unobserve(page4Ref.current);
            if (page5Ref.current) obs5.unobserve(page5Ref.current);
        };
    }, []);

    // 애니메이션 클래스
    const getAnimClasses = (isVisible: boolean) =>
        `transition-all duration-1000 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`;

    return (
        <>
            <style>{animations}</style>

            {/* Page 1: 메인 히어로 섹션 */}
            <div
                ref={page1Ref}
                className={`page1_wrap relative flex flex-col md:flex-row items-center md:justify-between min-h-screen px-4 py-20 ${getAnimClasses(isVisible1)}`}
            >
                {/* 텍스트 영역 */}
                <div className={`title_text_wrap relative z-10 w-full md:w-4/7 p-7 text-center ${getAnimClasses(isVisible1)}`}>
                    <div className="title_text text-4xl md:text-7xl font-bold text-gray-800 dark:text-gray-200 md:leading-relaxed md:m-10">
                        냉장고 속 잠든 재료<br />더는 버리지 마세요
                    </div>
                    <div className="subtitle_text text-lg md:text-2xl text-gray-400 dark:text-gray-500 font-bold mt-6">
                        식재료 관리부터 레시피 추천까지 한번에 해결하세요
                    </div>
                    <button
                        onClick={() => navigate("/auth/login")}
                        className="start_button bg-[#6789A5] hover:bg-[#5a7690] transition-all duration-300 text-white font-bold text-center py-4 px-10 rounded-full mt-8 inline-block transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        지금 바로 Recipick 시작하기
                    </button>
                </div>
                {/* 이미지 영역 */}
                <div className={`title_img_wrap absolute inset-0 md:relative md:w-[900px] md:max-w-[900px] min-h-96 md:right-0 ${getAnimClasses(isVisible1)}`}>
                    <img src={fridgeImg} alt="fridge" className="w-full h-full opacity-75 md:h-auto object-cover md:object-contain" />
                </div>
            </div>

            {/* Page 2: 문제 해결 */}
            <div ref={page2Ref} className={`page2_wrap my-20 ${getAnimClasses(isVisible2)}`}>
                <div className="problem_title">
                    <p className="text-center font-bold text-4xl m-10 mt-20 text-gray-800 dark:text-gray-200">
                        지긋지긋한 냉장고 정리, 매번 버리기만 하세요?
                    </p>
                    <p className="text-center my-5 text-gray-600 dark:text-gray-400">
                        냉장고가 가벼워지는 기적을 경험해보세요!
                    </p>
                </div>
                <div className="problem_img flex flex-col md:flex-row md:justify-around items-center px-4 md:px-20 mt-10">
                    <img className={`max-w-72 min-w-72 max-h-72 min-h-72 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300 ${isVisible2 ? "animate-popIn" : ""}`} src={shoppingCart} alt="shoppingcart" />
                    <p className="text-center font-bold text-9xl text-[#6789A5] m-5">+</p>
                    <img className={`max-w-72 min-w-72 max-h-72 min-h-72 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300 ${isVisible2 ? "animate-popIn delay-200" : ""}`} src={bestBy} alt="emptyfridge" />
                    <p className="text-center font-bold text-9xl text-[#6789A5] m-5">=</p>
                    <img className={`max-w-72 min-w-72 max-h-72 min-h-72 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300 ${isVisible2 ? "animate-popIn delay-400" : ""}`} src={webApp} alt="cellphone" />
                </div>
            </div>

            {/* Page 3: 제품 등록 */}
            <div ref={page3Ref} className={`page3_wrap my-20 flex flex-col md:flex-row md:justify-between items-center ${getAnimClasses(isVisible3)}`}>
                <div className={`register_left ${getAnimClasses(isVisible3)}`}>
                    <div className="register_title pl-4 md:pl-20 pr-4 md:pr-52">
                        <p className="text-left text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-200 leading-normal py-8 md:py-16">
                            세상에서 제일 쉬운<br />제품 등록
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {tabs3.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab3(index)}
                                    className={`flex items-center gap-2 text-lg md:text-xl font-semibold px-2 md:px-5 py-2 rounded-lg transition-colors duration-300 ${
                                        activeTab3 === index
                                            ? "text-[#6789A5] dark:text-[#8cb5e2] bg-[#E0EBF7] dark:bg-[#404040]"
                                            : "text-gray-500 dark:text-gray-400 hover:text-[#6789A5] dark:hover:text-[#8cb5e2]"
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="register_content pl-4 md:pl-20">
                        <p className="text-gray-800 dark:text-gray-300 p-5 py-10 md:py-20 text-md md:text-lg">
                            {tabs3[activeTab3].content}
                        </p>
                    </div>
                </div>
                <div className={`register_right justify-center items-center px-4 md:px-20 ${getAnimClasses(isVisible3)}`}>
                    <img className="max-w-full md:max-w-sm rounded-2xl shadow-xl" src={register} alt="register" />
                </div>
            </div>

            {/* Page 4: 공유 */}
            <div ref={page4Ref} className={`page4_wrap my-20 flex flex-col-reverse md:flex-row md:justify-between items-center ${getAnimClasses(isVisible4)}`}>
                <div className={`share_left justify-center items-center px-4 md:px-20 ${getAnimClasses(isVisible4)}`}>
                    <img className="max-w-full md:max-w-sm rounded-2xl shadow-xl" src={register} alt="share" />
                </div>
                <div className={`share_right ${getAnimClasses(isVisible4)}`}>
                    <div className="share_title text-right pl-4 md:pl-52 pr-4 md:pr-20">
                        <p className="text-right text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-200 leading-normal py-8 md:py-16">
                            원하는 상품,<br />원하는 멤버끼리!
                        </p>
                        <div className="flex justify-end space-x-4 mt-4">
                            {tabs4.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab4(index)}
                                    className={`flex items-center gap-2 text-lg md:text-xl font-semibold px-2 md:px-5 py-2 rounded-lg transition-colors duration-300 ${
                                        activeTab4 === index
                                            ? "text-[#6789A5] dark:text-[#8cb5e2] bg-[#E0EBF7] dark:bg-[#404040]"
                                            : "text-gray-500 dark:text-gray-400 hover:text-[#6789A5] dark:hover:text-[#8cb5e2]"
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="share_content text-right pr-4 md:pr-20">
                        <p className="text-gray-800 dark:text-gray-300 p-5 py-10 md:py-20 text-md md:text-lg">
                            {tabs4[activeTab4].content}
                        </p>
                    </div>
                </div>
            </div>

            {/* Page 5: 알림 */}
            <div ref={page5Ref} className={`page5_wrap my-20 flex flex-col md:flex-row md:justify-between items-center ${getAnimClasses(isVisible5)}`}>
                <div className={`notification_left ${getAnimClasses(isVisible5)}`}>
                    <div className="notification_title pl-4 md:pl-20 pr-4 md:pr-52">
                        <p className="text-left text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-200 leading-normal py-8 md:py-16">
                            똑똑한 알림 기능
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {tabs5.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab5(index)}
                                    className={`flex items-center gap-2 text-lg md:text-xl font-semibold px-2 md:px-5 py-2 rounded-lg transition-colors duration-300 ${
                                        activeTab5 === index
                                            ? "text-[#6789A5] dark:text-[#8cb5e2] bg-[#E0EBF7] dark:bg-[#404040]"
                                            : "text-gray-500 dark:text-gray-400 hover:text-[#6789A5] dark:hover:text-[#8cb5e2]"
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="notification_content pl-4 md:pl-20">
                        <p className="text-gray-800 dark:text-gray-300 p-5 py-10 md:py-20 text-md md:text-lg">
                            {tabs5[activeTab5].content}
                        </p>
                    </div>
                </div>
                <div className={`notification_right justify-center items-center px-4 md:px-20 ${getAnimClasses(isVisible5)}`}>
                    <img className="max-w-full md:max-w-sm rounded-2xl shadow-xl" src={register} alt="notification" />
                </div>
            </div>
        </>
    );
};

export default LandingPage;
