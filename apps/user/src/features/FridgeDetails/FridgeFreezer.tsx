import { useRef } from "react";
import { StorageBoxBlue } from "./StorageBox.tsx";

const FridgeFreezer = () => {
    const carouselRef = useRef<HTMLDivElement>(null);

    // 예시: 자식 요소 배열
    const items = [1, 2, 3, 4, 5, 6, 7]; // 추후에 props로 받아오기

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -430, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 430, behavior: "smooth" });
        }
    };

    return (
        <div className="relative fridge_freezer_wrap h-72 md:w-[450px] p-3 bg-gray-200 m-2 rounded">
            {items.length > 2 && (
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
                className="carousel h-64 md:w-[430px] bg-gray-200 flex flex-nowrap rounded overflow-x-auto scroll-smooth scrollbar-hide px-1 gap-4"
            >
                {items.map((_, idx) => (
                    <StorageBoxBlue key={idx} />
                ))}
            </div>

            {items.length > 2 && (
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

export default FridgeFreezer;