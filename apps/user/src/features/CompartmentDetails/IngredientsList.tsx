import React, { useState } from "react";
import IngredientAddButton from "../FridgeButtons.tsx";

// 식재료 타입 정의
interface Ingredient {
    id: string;
    name: string;
    emoji: string;
    // 추후 세부 정보용 필드들
    expiryDate?: string;
    quantity?: number;
    category?: string;
}

// Props 타입 정의
interface IngredientListProps {
    ingredients: Ingredient[];
    onIngredientClick: (ingredient: Ingredient) => void;
}

// 개별 식재료 컴포넌트
interface IngredientItemProps {
    ingredient: Ingredient;
    onClick: (ingredient: Ingredient) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, onClick }) => {
    return (
        <div
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200 p-1"
            onClick={() => onClick(ingredient)}
        >
            {/* 동그란 이모지 아이콘 */}
            <div className="w-[150px] h-[150px] overflow-hidden bg-white bg-opacity-30 border-4 border-gray-100 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                <span className="text-8xl pb-4" role="img" aria-label={ingredient.name}>
                    {ingredient.emoji}
                </span>
            </div>

            {/* 식재료 이름 */}
            <p className="mt-2 text-2xl font-semibold text-gray-800 text-center max-w-[150px] truncate">
                {ingredient.name}
            </p>
        </div>
    );
};

// 구분선 컴포넌트
const Divider: React.FC = () => {
    return <div className="w-full h-1 bg-sky-600 my-4"></div>;
};

// 메인 식재료 목록 컴포넌트
const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onIngredientClick }) => {
    // 4개씩 그룹으로 나누기
    const ingredientGroups: Ingredient[][] = [];
    for (let i = 0; i < ingredients.length; i += 4) {
        ingredientGroups.push(ingredients.slice(i, i + 4));
    }

    return (
        <div className="ingredient-list-container w-full max-w-4xl mx-auto p-4">
            {ingredientGroups.map((group, groupIndex) => (
                <React.Fragment key={`group-${groupIndex}`}>
                    {/* 4개씩 한 행에 배치 */}
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                        {group.map((ingredient) => (
                            <IngredientItem
                                key={ingredient.id}
                                ingredient={ingredient}
                                onClick={onIngredientClick}
                            />
                        ))}
                        {/* 마지막 그룹이면 + 버튼도 같이 추가 */}
                        {groupIndex === ingredientGroups.length - 1 && (
                            <IngredientAddButton onClick={() => console.log("새 식재료 추가")} />
                        )}
                    </div>
                    <Divider />
                </React.Fragment>
            ))}

            {/* 식재료가 없을 때 */}
            {ingredients.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-800">등록된 식재료가 없습니다</p>
                    <div className="mt-6 flex justify-center">
                        <IngredientAddButton onClick={() => console.log("새 식재료 추가")} />
                    </div>
                </div>
            )}
        </div>
    );
};



// 사용 예시 컴포넌트
const IngredientListExample: React.FC = () => {
    // 예시 식재료 데이터
    const [ingredients] = useState<Ingredient[]>([
        { id: "1", name: "사과", emoji: "🍎" },
        { id: "2", name: "바나나", emoji: "🍌" },
        { id: "3", name: "당근", emoji: "🥕" },
        { id: "4", name: "우유", emoji: "🥛" },
        { id: "5", name: "달걀", emoji: "🥚" },
        { id: "6", name: "치즈", emoji: "🧀" },
        { id: "7", name: "토마토", emoji: "🍅" },
        { id: "8", name: "양파", emoji: "🧅" },
        { id: "9", name: "감자", emoji: "🥔" },
        { id: "10", name: "브로콜리", emoji: "🥦" },
    ]);

    // 식재료 클릭 핸들러
    const handleIngredientClick = (ingredient: Ingredient): void => {
        console.log("클릭된 식재료:", ingredient);
        // TODO: 모달 컴포넌트 열기
        // setSelectedIngredient(ingredient);
        // setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-transparent py-5">
            <div className="container mx-auto">
                <IngredientList
                    ingredients={ingredients}
                    onIngredientClick={handleIngredientClick}
                />
            </div>
        </div>
    );
};


export default IngredientListExample;
export { IngredientList, type Ingredient, type IngredientListProps };