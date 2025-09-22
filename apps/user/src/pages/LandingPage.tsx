import fridgeImg from "../../assets/fridge.jpg";
import shoppingCart from "../../assets/shopping.jpg";
import bestBy from "../../assets/bestby.jpg";
import webApp from "../../assets/webapp.jpg";
import register from "../../assets/register.jpg";


const LandingPage = () => {
    return (
        <>
            <div className="page1_wrap relative flex flex-col md:flex-row items-center md:justify-between md:items-center">
                {/* 텍스트 영역 */}
                <div className="title_text_wrap relative z-10 w-full min-h-96 md:w-4/7 p-7 text-center mix-blend-normal">
                    <div className="title_text text-4xl md:text-7xl text-gray-800 font-bold md:leading-relaxed md:m-10 text-center md:text-center">
                        냉장고 속 잠든 재료<br />더는 버리지 마세요
                    </div>
                    <div className="subtitle_text text-lg md:text-2xl text-gray-400 font-bold text-center md:text-center mt-6">
                        식재료 관리부터 레시피 추천까지 한번에 해결하세요
                    </div>
                    <div className="start_button bg-gray-400 hover:bg-gray-500 transition text-blue-950 font-bold text-center md:text-center py-4 px-10 rounded mt-8 inline-block">
                        지금 바로 Recipick 시작하기
                    </div>
                </div>

                {/* 이미지 영역 */}
                <div className="title_img_wrap absolute inset-0 md:relative md:w-[900px] md:max-w-[900px] min-h-96 md:right-0">
                    <img
                        src={fridgeImg}
                        alt="fridge"
                        className="w-full h-full opacity-75 md:h-auto object-cover md:object-contain"
                    />
                </div>
            </div>

            <div className={"page2_wrap my-20"}>
                <div className={"problem_title"}>
                    <p className={"text-center font-bold text-4xl m-10 mt-20"}>지긋지긋한 냉장고 정리, 매번 버리기만 하세요?</p>
                    <p className={"text-center my-5"}>냉장고가 가벼워지는 기적을 경험해보세요!</p>
                </div>
                <div className={"problem_img flex flex-col md:flex-row md:justify-around items-center px-20"}>
                    <img className={"max-w-72 min-w-72 max-h-72 min-h-72 object-cover"} src={shoppingCart} alt="shoppingcart" />
                    <p className={"text-center font-bold text-9xl text-green-700 m-5"}>+</p>
                    <img className={"max-w-72 min-w-72 max-h-72 min-h-72 object-cover"} src={bestBy} alt="emptyfridge" />
                    <p className={"text-center font-bold text-9xl text-green-700 m-5"}>=</p>
                    <img className={"max-w-72 min-w-72 max-h-72 min-h-72 object-cover"} src={webApp} alt="cellphone" />
                </div>
            </div>

            <div className={"page3_wrap my-20 flex flex-col md:flex-row md:justify-between items-center"}>
                <div className={"register_left"}>
                    <div className={"register_title pl-20 pr-52"}>
                        <p className={"text-left text-6xl font-bold text-gray-900 leading-normal py-16"}>세상에서 제일 쉬운<br/>제품 등록</p>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>바코드</a>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>명세표/영수증</a>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>직접 입력</a>
                    </div>
                    <div className={"register_content pl-20"}>
                        <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>바코드만 쓱! 바로 스캔해서 등록하세요</p>
                        {/*                      <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>영수증만 찍어주면 한 번에 등록 가능!</p>
                      <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>용도에 따라 내가 원하는 대로 입력해요</p>*/}
                    </div>
                </div>
                <div className={"register_right justify-center items-center px-20"}>
                    <img className={"max-w-sm min-w-sm rounded"} src={register} alt={"register"} />
                </div>
            </div>


            <div className={"page4_wrap my-20 flex flex-col md:flex-row md:justify-between items-center"}>
                <div className={"share_left justify-center items-center px-20"}>
                    <img className={"max-w-sm min-w-sm rounded"} src={register} alt={"share"} />
                </div>
                <div className={"share_right"}>
                    <div className={"share_title text-right pr-20 pl-52"}>
                        <p className={"text-right text-6xl font-bold text-gray-900 leading-normal py-16"}>원하는 상품,<br/>원하는 멤버끼리!</p>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>냉장고 추가</a>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>냉장고 공유</a>
                    </div>
                    <div className={"share_content text-right pr-20"}>
                        <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>보관 위치, 상품, 용도별로<br />냉장고를 무제한으로 추가해서 관리하세요!</p>
                        {/*                      <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>가족, 친구, 룸메이트..<br />모두와 냉장고를 실시간으로 공유하고 함께 관리하세요</p>*/}
                    </div>
                </div>
            </div>

            <div className={"page5_wrap my-20 flex flex-col md:flex-row md:justify-between items-center"}>
                <div className={"notification_left"}>
                    <div className={"notification_title pl-20 pr-52"}>
                        <p className={"text-left text-6xl font-bold text-gray-900 leading-normal py-16"}>똑똑한 알림 기능</p>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>대신등록 알림</a>
                        <a className={"text-center text-xl text-gray-900 focus-within:text-blue-700 px-5"}>유통기한 임박 알림</a>
                    </div>
                    <div className={"notification_content pl-20"}>
                        <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>스토어에서 구매한 제품 정보가 자동으로 등록 완료!</p>
                        {/*                      <p className={"text-gray-800 justify-center p-5 py-20 text-lg"}>원하는 날짜, 원하는 시간에 유통기한 임박 알림을 보내드려요!</p>*/}
                    </div>
                </div>
                <div className={"notification_right justify-center items-center px-20"}>
                    <img className={"max-w-sm min-w-sm rounded"} src={register} alt={"notification"} />
                </div>
            </div>

        </>
    );
}

export default LandingPage;