import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface Recipe {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    cookingTime: number;
    servings: number;
    rating: number;
    imageUrl: string;
    matchRate: number;
    availableIngredients: Array<{ name: string; required: string; available: string }>;
    missingIngredients: Array<{ name: string; required: string }>;
    isFavorite: boolean;
}

const RecipeListPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [difficulty, setDifficulty] = useState('ALL');
    const [loading, setLoading] = useState(true);

    const handleRecipeDetail = (recipeId: number) => {
        // 레시피 상세 페이지로 이동
        console.log('Navigate to recipe detail:', recipeId);
    };

    useEffect(() => {
        // Mock 데이터 로드
        const mockRecipes: Recipe[] = [
            {
                id: 1,
                title: '김치볶음밥',
                description: '간단하게 만드는 김치볶음밥',
                difficulty: 'EASY',
                cookingTime: 15,
                servings: 2,
                rating: 4.5,
                imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
                matchRate: 85,
                availableIngredients: [
                    { name: '김치', required: '200g', available: '300g' },
                    { name: '계란', required: '2개', available: '5개' }
                ],
                missingIngredients: [{ name: '참기름', required: '1큰술' }],
                isFavorite: false
            },
            {
                id: 2,
                title: '계란말이',
                description: '부드러운 계란말이',
                difficulty: 'EASY',
                cookingTime: 10,
                servings: 1,
                rating: 4.3,
                imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop',
                matchRate: 95,
                availableIngredients: [
                    { name: '계란', required: '3개', available: '5개' },
                    { name: '대파', required: '1대', available: '2대' }
                ],
                missingIngredients: [],
                isFavorite: true
            },
            {
                id: 3,
                title: '된장찌개',
                description: '집에서 끓이는 진짜 된장찌개',
                difficulty: 'MEDIUM',
                cookingTime: 25,
                servings: 3,
                rating: 4.7,
                imageUrl: 'https://images.unsplash.com/photo-1559847844-d9c3ad5e4a3c?w=400&h=300&fit=crop',
                matchRate: 70,
                availableIngredients: [
                    { name: '양파', required: '1개', available: '2개' },
                    { name: '두부', required: '1/2모', available: '1모' }
                ],
                missingIngredients: [
                    { name: '된장', required: '2큰술' },
                    { name: '멸치', required: '10마리' }
                ],
                isFavorite: false
            }
        ];

        setTimeout(() => {
            setRecipes(mockRecipes);
            setLoading(false);
        }, 500);
    }, []);

    const handleFavoriteToggle = (recipeId: number) => {
        setRecipes(prev =>
            prev.map(recipe =>
                recipe.id === recipeId
                    ? { ...recipe, isFavorite: !recipe.isFavorite }
                    : recipe
            )
        );
    };

    const handleSwipeNext = () => {
        if (currentIndex < recipes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSwipePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'EASY': return 'text-green-600 bg-green-100';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
            case 'HARD': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">레시피를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-800">추천 레시피</h1>
                    <p className="text-gray-600 mt-1">냉장고 속 재료로 만들 수 있는 레시피를 추천해드려요</p>
                </div>
            </header>

            {/* 필터 */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                    difficulty === level
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {level === 'ALL' ? '전체' : level === 'EASY' ? '쉬움' : level === 'MEDIUM' ? '보통' : '어려움'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 레시피 카드 스와이퍼 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {recipes.length > 0 ? (
                    <div className="relative">
                        {/* 현재 레시피 카드 */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative">
                                <img
                                    src={recipes[currentIndex].imageUrl}
                                    alt={recipes[currentIndex].title}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipes[currentIndex].difficulty)}`}>
                    {recipes[currentIndex].difficulty === 'EASY' ? '쉬움' :
                        recipes[currentIndex].difficulty === 'MEDIUM' ? '보통' : '어려움'}
                  </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {recipes[currentIndex].matchRate}% 매치
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFavoriteToggle(recipes[currentIndex].id)}
                                    className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Heart
                                        className={`w-6 h-6 ${
                                            recipes[currentIndex].isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipes[currentIndex].title}</h2>
                                <p className="text-gray-600 mb-4">{recipes[currentIndex].description}</p>

                                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                    <span>⏰ {recipes[currentIndex].cookingTime}분</span>
                                    <span>👥 {recipes[currentIndex].servings}인분</span>
                                    <span>⭐ {recipes[currentIndex].rating}</span>
                                </div>

                                {/* 보유 재료 */}
                                {recipes[currentIndex].availableIngredients.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">보유 재료</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {recipes[currentIndex].availableIngredients.map((ingredient, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {ingredient.name} ({ingredient.available})
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 부족한 재료 */}
                                {recipes[currentIndex].missingIngredients.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-2">추가 필요 재료</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {recipes[currentIndex].missingIngredients.map((ingredient, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {ingredient.name} ({ingredient.required})
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleRecipeDetail(recipes[currentIndex].id)}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    레시피 자세히 보기
                                </button>
                            </div>
                        </div>

                        {/* 네비게이션 버튼 */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handleSwipePrev}
                                disabled={currentIndex === 0}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    currentIndex === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                이전 레시피
                            </button>

                            <div className="text-center">
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} / {recipes.length}
                </span>
                                <div className="flex gap-2 mt-2">
                                    {recipes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                idx === currentIndex ? 'bg-emerald-500' : 'bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSwipeNext}
                                disabled={currentIndex === recipes.length - 1}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    currentIndex === recipes.length - 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                }`}
                            >
                                다음 레시피
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">추천할 레시피가 없어요</h2>
                        <p className="text-gray-600">냉장고에 재료를 추가해보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeListPage;