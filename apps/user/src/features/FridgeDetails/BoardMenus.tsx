import * as React from "react";

export const BoardMenus: React.FC = () => {
    return (
        <>
            <div className={"flex justify-between max-w-full md:max-w-full lg:max-w-full"}>
                <div className={"board_menu p-1.5 inline-block md:min-w-[70px] md:min-h-[15px] bg-amber-200 rounded-t-lg z-11"}>
                    <span className={"px-4"}> 메 모 </span>
                </div>
                <div className={"board_menu p-1.5 inline-block md:min-w-[70px] md:min-h-[15px] bg-amber-200 rounded-t-lg z-11"}>
                    <span className={"px-4"}>소비기한</span>
                </div>
                <div className={"board_menu p-1.5 inline-block md:min-w-[70px] md:min-h-[15px] bg-amber-200 rounded-t-lg z-11"}>
                    <span className={"px-4"}>최근 사용 식재료</span>
                </div>
            </div>
        </>
    );
}

