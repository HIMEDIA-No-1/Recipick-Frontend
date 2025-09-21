import { useRef } from "react";
import { StorageBoxBlue } from "./StorageBox.tsx";

const FridgeRefrigerator = () => {
    const carouselRef = useRef<HTMLDivElement>(null);

    // 예시: 자식 요소 배열
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 7개로 늘림 (2x2 그리드가 2페이지)

    // 아이템들을 2x2 그리드 단위로 그룹화
    const itemGroups = [];
    for (let i = 0; i < items.length; i += 4) {
        itemGroups.push(items.slice(i, i + 4));
    }

    const scrollLeft = () => {
        if (carouselRef.current) {
            // 한 그리드 전체 너비만큼 스크롤 (그리드 너비 + gap)
            carouselRef.current.scrollBy({ left: -445, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 445, behavior: "smooth" });
        }
    };

    return (
        <div className="relative fridge_refrigerator_wrap h-[550px] md:w-[450px] overflow-y-hidden p-2 bg-gray-200 m-2 rounded">
            {itemGroups.length > 1 && (
                <button
                    type="button"
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full z-10"
                    onClick={scrollLeft}
                >
                    ◀
                </button>
            )}

            {/* 캐러셀 영역 */}
            <div
                ref={carouselRef}
                className="carousel h-[520px] md:w-[420px] bg-gray-200 flex flex-nowrap rounded overflow-x-auto scroll-smooth scrollbar-hide gap-4"
            >
                {itemGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="flex-shrink-0 grid grid-cols-2 h-[420px] w-[430px] px-2">
                        {group.map((_, idx) => (
                            <div className={"py-2 px-1"}>
                                <StorageBoxBlue key={`${groupIdx}-${idx}`} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {itemGroups.length > 1 && (
                <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full z-10"
                    onClick={scrollRight}
                >
                    ▶
                </button>
            )}
        </div>
    );
};

export default FridgeRefrigerator;