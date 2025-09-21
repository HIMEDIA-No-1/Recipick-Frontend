import { useState } from "react";

const Categories: string[] = [
    "전체",
    "채소",
    "과일",
    "육류",
    "해산물",
    "유제품",
    "난류",
    "곡물류",
    "통조림",
    "과자(간식)",
    "면",
    "음료",
    "조미료/양념/잼",
    "냉동식품",
    "조리한 식품(반찬)",
    "기타"
];

export default function CategoryButtons() {
    const [selected, setSelected] = useState<string[]>(
        Categories.filter((c) => c !== "전체")
    );

    const handleClick = (category: string) => {
        if (category === "전체") {
            if (selected.length === Categories.length - 1) {
                // 이미 모든 항목이 선택되어 있으면 전체 해제
                setSelected([]);
            } else {
                // 전체 선택
                setSelected(Categories.filter((c) => c !== "전체"));
            }
        } else {
            if (selected.includes(category)) {
                // 해당 항목 해제
                const newSelected = selected.filter((c) => c !== category);
                setSelected(newSelected);
            } else {
                // 해당 항목 추가
                const newSelected = [...selected, category];
                setSelected(newSelected);
            }
        }
    };

    // "전체" 버튼 활성화 여부는 나머지 전부 선택됐는지로 판별
    const isAllSelected = selected.length === Categories.length - 1;

    return (
        <div className="flex flex-wrap gap-2 pt-4 pb-0 justify-center">
            {Categories.map((category, idx) => {
                const isSelected =
                    category === "전체" ? isAllSelected : selected.includes(category);

                return (
                    <button
                        key={idx}
                        onClick={() => handleClick(category)}
                        className={`py-1 px-4 rounded-full font-bold transition-colors 
              ${
                            isSelected
                                ? "bg-blue-800 text-white"
                                : "bg-blue-100 text-blue-950 hover:bg-blue-300"
                        }`}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
}
