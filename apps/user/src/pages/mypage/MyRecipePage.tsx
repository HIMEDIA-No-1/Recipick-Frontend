import { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { mockRecipes } from "../../__mocks__/recipes.mock";
import type { Recipe } from "../../__mocks__/recipes.mock";


const MyRecipePage = () => {
    const [favorites, setFavorites] = useState<Recipe[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        const ids: number[] = stored ? JSON.parse(stored) : [];
        const favs = mockRecipes.filter((r) => ids.includes(r.id));
        setFavorites(favs);
    }, []);

    const handleBack = () => {
        console.log("뒤로가기 (라우터 연결 시 navigate 사용)");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        뒤로
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">찜한 레시피</h1>
                    <div className="w-10" />
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {favorites.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {favorites.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            >
                                {/* 이모지 + 하트 */}
                                <div className="relative text-6xl text-center">
                                    {recipe.emoji}
                                    <div className="absolute top-0 right-0 bg-white rounded-full p-1 shadow">
                                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                    </div>
                                </div>
                                <h3 className="mt-3 font-semibold text-gray-800 text-lg text-center">
                                    {recipe.title}
                                </h3>
                                <p className="text-sm text-[#6789A5] text-center mb-2">
                                    난이도: {recipe.difficulty}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-3 text-center flex-1">
                                    {recipe.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💔</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            아직 찜한 레시피가 없어요
                        </h2>
                        <p className="text-gray-600">마음에 드는 레시피를 찜해보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRecipePage;
