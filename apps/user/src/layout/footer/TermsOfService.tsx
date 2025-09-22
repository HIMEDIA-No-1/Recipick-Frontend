import TosTitles from "./TosTitles.tsx";

const TermsOfService = () => {
    return (
        <div className="tos_container">
            <div className={"tos_top_title text-gray-950 font-bold text-2xl"}>
                <p className={"m-10 text-center"}>서비스 이용약관</p>
            </div>
            <div className={"tos_content divide-y-2 divide-gray-500 mx-auto"}>
                <TosTitles />
            </div>
        </div>
    );
  
}
export default TermsOfService;