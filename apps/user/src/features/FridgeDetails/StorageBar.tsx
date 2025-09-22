export const StorageBarGreen = () => {
    return (
        <div className={"storage_bar_wrap flex-col"}>
            <div className={"compartment_name"}>
                <p className={"text-base font-bold text-blue-950 p-1"}>칸이름 여기</p>
            </div>
            <div className={"justify-items-center py-1"}>
                <div className={"storage_box w-[410px] h-[90px] bg-green-600 border-gray-50 border-4 rounded-2xl p-3"}>
                    여기에 식재료들
                </div>
                <div className={"storage_bar w-[430px] h-[20px] bg-amber-900 border-gray-50 border-2 rounded-md"}>

                </div>
            </div>
        </div>
    );
}

export const StorageBarBlue = () => {
    return (
        <div className={"storage_bar_wrap flex-col"}>
            <div className={"compartment_name"}>
                <p className={"text-base font-bold text-blue-950 p-1"}>칸이름 여기</p>
            </div>
            <div className={"justify-items-center py-1"}>
                <div className={"storage_box w-[410px] h-[90px] bg-sky-300 border-gray-50 border-4 rounded-2xl p-3"}>
                    여기에 식재료들
                </div>
                <div className={"storage_bar w-[430px] h-[20px] bg-amber-900 border-gray-50 border-2 rounded-md"}>

                </div>
            </div>
        </div>
    );
}
