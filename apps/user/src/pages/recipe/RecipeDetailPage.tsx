import { useState, useEffect } from 'react';
import { Heart, Clock, Users, Star, ArrowLeft, ChefHat } from 'lucide-react';

interface RecipeIngredient {
    name: string;
    quantity: string;
}

interface Recipe {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    cookingTime: number;
    servings: number;
    rating: number;
    imageUrl: string;
    ingredients: RecipeIngredient[];
    instructions: string[];
    author: string;
    sourceUrl: string;
    isFavorite: boolean;
    myRating?: number;
}

const RecipeDetailPage = () => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [showCookingModal, setShowCookingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        // Mock 데이터 로드
        const mockRecipe: Recipe = {
            id: 1,
            title: '김치볶음밥',
            description: '간단하게 만드는 김치볶음밥입니다. 냉장고에 남은 김치와 밥으로 맛있는 한 끼를 완성해보세요.',
            difficulty: 'EASY',
            cookingTime: 15,
            servings: 2,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
            ingredients: [
                { name: '김치', quantity: '200g' },
                { name: '밥', quantity: '2공기' },
                { name: '계란', quantity: '2개' },
                { name: '대파', quantity: '1대' },
                { name: '참기름', quantity: '1큰술' },
                { name: '식용유', quantity: '2큰술' },
                { name: '김', quantity: '적당량' }
            ],
            instructions: [
                '김치는 한 입 크기로 자르고, 대파는 송송 썰어주세요.',
                '팬에 식용유를 두르고 김치를 볶아주세요.',
                '김치가 볶아지면 밥을 넣고 함께 볶아주세요.',
                '밥이 고루 볶아지면 계란을 풀어서 넣고 섞어주세요.',
                '마지막에 참기름과 대파를 넣고 한 번 더 볶아주세요.',
                '그릇에 담고 김을 올려 완성해주세요.'
            ],
            author: '만개의레시피',
            sourceUrl: 'https://10000recipe.com/recipe/123',
            isFavorite: false
        };

        setTimeout(() => {
            setRecipe(mockRecipe);
            setLoading(false);
        }, 500);
    }, []);

    const handleBack = () => {
        console.log('Go back to recipe list');
    };

    const handleFavoriteToggle = () => {
        if (recipe) {
            setRecipe({ ...recipe, isFavorite: !recipe.isFavorite });
        }
    };

    const handleIngredientToggle = (ingredientName: string) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredientName)
                ? prev.filter(name => name !== ingredientName)
                : [...prev, ingredientName]
        );
    };

    const handleStartCooking = () => {
        if (selectedIngredients.length === 0) {
            alert('사용할 재료를 선택해주세요!');
            return;
        }
        setShowCookingModal(true);
    };

    const handleFinishCooking = () => {
        if (userRating === 0) {
            alert('요리 평가를 선택해주세요!');
            return;
        }

        console.log('Recipe completed with rating:', userRating);
        console.log('Used ingredients:', selectedIngredients);
        setShowCookingModal(false);
        alert('요리 완료 기록이 저장되었습니다!');
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

    if (!recipe) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">레시피를 찾을 수 없어요</h2>
                    <button
                        onClick={handleBack}
                        className="text-emerald-500 hover:text-emerald-600"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

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
                        목록으로
                    </button>
                    <button
                        onClick={handleFavoriteToggle}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Heart
                            className={`w-6 h-6 ${
                                recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                            }`}
                        />
                    </button>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 레시피 이미지 */}
                <div className="relative mb-6">
                    <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-64 object-cover rounded-2xl"
                    />
                    <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty === 'EASY' ? '쉬움' :
                  recipe.difficulty === 'MEDIUM' ? '보통' : '어려움'}
            </span>
                    </div>
                </div>

                {/* 레시피 정보 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</h1>
                    <p className="text-gray-600 mb-4">{recipe.description}</p>

                    <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center text-gray-600">
                            <Clock className="w-5 h-5 mr-2" />
                            <span>{recipe.cookingTime}분</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="w-5 h-5 mr-2" />
                            <span>{recipe.servings}인분</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                            <span>{recipe.rating}</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500">
                        출처: {recipe.author}
                    </div>
                </div>

                {/* 재료 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">재료</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recipe.ingredients.map((ingredient, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                    selectedIngredients.includes(ingredient.name)
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleIngredientToggle(ingredient.name)}
                            >
                                <span className="font-medium text-gray-800">{ingredient.name}</span>
                                <span className="text-gray-600">{ingredient.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        💡 요리에 사용할 재료를 클릭하여 선택하세요
                    </p>
                </div>

                {/* 요리 순서 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">요리 순서</h2>
                    <div className="space-y-4">
                        {recipe.instructions.map((instruction, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{instruction}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 요리 시작 버튼 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <button
                        onClick={handleStartCooking}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <ChefHat className="w-5 h-5" />
                        요리 시작하기 ({selectedIngredients.length}개 재료 선택됨)
                    </button>
                </div>
            </div>

            {/* 요리 완료 모달 */}
            {showCookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">요리 완료!</h3>
                        <p className="text-gray-600 mb-6">맛있게 드셨나요? 이 레시피를 평가해주세요.</p>

                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">평점을 선택해주세요</p>
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setUserRating(rating)}
                                        className="p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                rating <= userRating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2">사용된 재료</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedIngredients.map((ingredient) => (
                                    <span
                                        key={ingredient}
                                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                                    >
                    {ingredient}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCookingModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleFinishCooking}
                                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeDetailPage;