export const StorageBoxGreen = () => {
    return (
        <div className={"storage_box_wrap max-w-52 h-60"}>
            <div className={"compartment_name"}>
                <span className={"text-base font-bold text-blue-950 p-1 inline-block"}>칸이름 여기</span>
            </div>
            <div className={"storage_box w-[200px] h-[220px] bg-green-600 border-gray-50 border-4 rounded-xl p-3"}>
                여기에 식재료들
            </div>
        </div>
    );
}

export const StorageBoxBlue = () => {
    return (
        <div className={"storage_box_wrap max-w-52 h-60"}>
            <div className={"compartment_name"}>
                <span className={"text-base font-bold text-blue-950 p-1 inline-block"}>칸이름 여기</span>
            </div>
            <div className={"storage_box w-[200px] h-[220px] bg-sky-300 border-gray-50 border-4 rounded-xl p-3"}>
                여기에 식재료들
            </div>
        </div>
    );
}
