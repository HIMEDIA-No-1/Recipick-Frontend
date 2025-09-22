import { useState, useEffect } from "react";
import { X, Heart, Eye, Sun, Moon, Carrot, Utensils } from "lucide-react";
import type { Recipe } from "../../__mocks__/recipes.mock";
import { mockRecipes } from "../../__mocks__/recipes.mock";
import { myIngredients } from "../../__mocks__/ingredients.mock";

function RecipeModal({
                         recipe,
                         onClose,
                         onCook,
                     }: {
    recipe: Recipe;
    onClose: () => void;
    onCook: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl dark:bg-[#333] border-2 border-[#D1D1D1] dark:border-[#404040]">
                <button
                    onClick={onClose}
                    className="absolute p-2 transition-colors rounded-full top-3 right-3 text-[#878787] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] dark:text-[#A0A0A0]"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="mb-4 text-6xl text-center">{recipe.emoji}</div>
                <h2 className="mb-2 text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0]">
                    {recipe.title}
                </h2>
                <p className="mb-4 text-[#878787] dark:text-[#A0A0A0]">
                    {recipe.description}
                </p>
                <p className="mb-4 font-medium text-[#6789A5] dark:text-[#8cb5e2]">
                    난이도: {recipe.difficulty}
                </p>
                <div className="space-y-4">
                    <div>
                        <h3 className="flex items-center gap-2 mb-2 font-semibold text-[#6789A5] dark:text-[#8cb5e2]">
                            <Carrot className="w-5 h-5" /> 재료
                        </h3>
                        <ul className="pl-5 space-y-1 list-disc text-[#4B4B4B] dark:text-[#E0E0E0]">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="flex items-center gap-2 mb-2 font-semibold text-[#6789A5] dark:text-[#8cb5e2]">
                            <Utensils className="w-5 h-5" /> 조리 방법
                        </h3>
                        <ol className="pl-5 space-y-1 list-decimal text-[#4B4B4B] dark:text-[#E0E0E0]">
                            {recipe.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCook}
                        className="px-4 py-2 bg-[#6789A5] hover:bg-[#5A7E9D] text-white rounded-lg font-medium transition-colors"
                    >
                        요리하기
                    </button>
                </div>
            </div>
        </div>
    );
}

function CookingModal({
                          recipe,
                          onClose,
                      }: {
    recipe: Recipe;
    onClose: () => void;
}) {
    const [usedIngredients, setUsedIngredients] = useState<string[]>([]);

    const handleUseIngredient = (ingredient: string) => {
        if (!usedIngredients.includes(ingredient)) {
            setUsedIngredients([...usedIngredients, ingredient]);
        }
    };

    const hasIngredient = (ingredient: string) =>
        myIngredients.some((ing) => ing.name === ingredient);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl dark:bg-[#333] border-2 border-[#D1D1D1] dark:border-[#404040]">
                <button
                    onClick={onClose}
                    className="absolute p-2 transition-colors rounded-full top-3 right-3 text-[#878787] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] dark:text-[#A0A0A0]"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="mb-4 text-xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0]">
                    🧑‍🍳 {recipe.title} - 가지고 있는 재료
                </h2>

                <ul className="space-y-2">
                    {recipe.ingredients.map((ing, idx) => {
                        const isUsed = usedIngredients.includes(ing);
                        const available = hasIngredient(ing);

                        return (
                            <li
                                key={idx}
                                className={`flex justify-between items-center px-4 py-2 border rounded-lg ${
                                    isUsed
                                        ? "bg-gray-200 dark:bg-gray-600 opacity-50"
                                        : "bg-[#FAF7F2] dark:bg-[#444]"
                                }`}
                            >
                                <span>{ing}</span>
                                {available ? (
                                    <button
                                        disabled={isUsed}
                                        onClick={() => handleUseIngredient(ing)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            isUsed
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : "bg-[#6789A5] hover:bg-[#5A7E9D] text-white"
                                        }`}
                                    >
                                        {isUsed ? "사용됨" : "사용하기"}
                                    </button>
                                ) : (
                                    <span className="text-red-500 text-sm font-medium">
                                        ❌ 없음
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

const RecipeListPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState<Recipe | null>(null);
    const [showCooking, setShowCooking] = useState<Recipe | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        setRecipes([...mockRecipes]);
        setCurrentIndex(0);
    }, []);

    useEffect(() => {
        if (recipes.length > 0) {
            const current = recipes[currentIndex];
            setIsFavorite(favorites.some((fav) => fav.id === current.id));
        }
    }, [currentIndex, recipes, favorites]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % recipes.length);
    };

    const handleView = (recipe: Recipe) => {
        setShowModal(recipe);
    };

    const handleFavorite = (recipe: Recipe) => {
        if (favorites.some((fav) => fav.id === recipe.id)) {
            setFavorites(favorites.filter((fav) => fav.id !== recipe.id));
            setToastMessage("찜 해제했어요~");
        } else {
            setFavorites([...favorites, recipe]);
            setToastMessage("추가되었어요~");
        }
        setIsFavorite(!isFavorite);

        setTimeout(() => setToastMessage(null), 1500);
        setTimeout(() => handleNext(), 500);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle("dark", !isDarkMode);
    };

    if (recipes.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#242424]">
                <p className="text-[#878787] dark:text-[#A0A0A0]">레시피를 불러오는 중...</p>
            </div>
        );
    }

    const currentRecipe = recipes[currentIndex];

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex flex-col items-center justify-center p-6 transition-colors">
            {/* 다크모드 토글 */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none"
            >
                {isDarkMode ? (
                    <Sun className="text-[#878787] dark:text-[#A0A0A0]" />
                ) : (
                    <Moon className="text-[#878787]" />
                )}
            </button>

            {/* 레시피 카드 */}
            <div className="relative w-full max-w-md p-6 text-center bg-white shadow-xl rounded-2xl dark:bg-[#333] border-2 border-[#D1D1D1] dark:border-[#404040]">
                <div className="mb-4 text-8xl">{currentRecipe.emoji}</div>
                <h2 className="mb-2 text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0]">
                    {currentRecipe.title}
                </h2>
                <p className="mb-2 text-[#878787] dark:text-[#A0A0A0]">
                    {currentRecipe.description}
                </p>
                <p className="mb-6 text-sm text-[#6789A5] dark:text-[#8cb5e2]">
                    난이도: {currentRecipe.difficulty}
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-[#E0EBF7] hover:bg-[#6789A5] text-[#6789A5] hover:text-white font-medium rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                        다음
                    </button>
                    <button
                        onClick={() => handleView(currentRecipe)}
                        className="flex-1 flex items-center justify-center px-4 py-2 text-white font-medium bg-[#6789A5] hover:bg-[#5A7E9D] rounded-lg transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                        보기
                    </button>
                    <button
                        onClick={() => handleFavorite(currentRecipe)}
                        className={`flex-1 flex items-center justify-center px-4 py-2 text-white font-medium rounded-lg transition-colors ${
                            isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-[#D1D1D1] hover:bg-[#BDBDBD]"
                        }`}
                    >
                        <Heart className="w-5 h-5" />
                        찜하기
                    </button>
                </div>
            </div>

            {/* 토스트 메시지 */}
            {toastMessage && (
                <div className="fixed bottom-20 px-6 py-3 bg-[#6789A5] text-white font-medium rounded-lg shadow-lg animate-bounce">
                    {toastMessage}
                </div>
            )}

            {/* 상세 모달 */}
            {showModal && (
                <RecipeModal
                    recipe={showModal}
                    onClose={() => setShowModal(null)}
                    onCook={() => {
                        setShowModal(null);
                        setShowCooking(showModal);
                    }}
                />
            )}

            {/* 요리 모달 */}
            {showCooking && (
                <CookingModal recipe={showCooking} onClose={() => setShowCooking(null)} />
            )}

            {/* 배경 장식 */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-20 right-10 w-32 h-32 bg-[#E0EBF7] rounded-full opacity-30"></div>
                <div className="absolute top-40 left-20 w-24 h-24 bg-[#E0EBF7] rounded-full opacity-40"></div>
                <div className="absolute bottom-32 right-32 w-40 h-40 bg-[#E0EBF7] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-10 w-28 h-28 bg-[#E0EBF7] rounded-full opacity-30"></div>
            </div>
        </div>
    );
};

export default RecipeListPage;
