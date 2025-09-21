import * as React from "react";
import PrivacyTitles from "./PrivacyTitles.tsx";

const Privacy: React.FC = () => {
    return (
        <div className={"privacy_container"}>
            <div className={"privacy_top_title text-gray-950 font-bold text-2xl"}>
                <p className={"m-10 text-center"}>개인정보처리방침</p>
            </div>
            <div className={"privacy_content divide-y-2 divide-gray-500 mx-auto"}>
                <PrivacyTitles />
            </div>
        </div>
    );
}

export { Privacy };