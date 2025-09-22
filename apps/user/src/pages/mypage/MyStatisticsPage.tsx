import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Trash2, ChefHat, ShoppingCart } from 'lucide-react';

interface IngredientStat {
    name: string;
    category: string;
    count: number;
    percentage?: number;
}

interface PeriodData {
    totalAdded: number;
    totalConsumed: number;
    totalDisposed: number;
    wasteRate: number;
}

interface RecipeStat {
    recipeId: number;
    title: string;
    imageUrl: string;
    cookCount: number;
    averageRating: number;
    lastCookedAt: string;
}

const MyStatisticsPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
    const [periodData, setPeriodData] = useState<PeriodData>({
        totalAdded: 0,
        totalConsumed: 0,
        totalDisposed: 0,
        wasteRate: 0
    });
    const [frequentlyAdded, setFrequentlyAdded] = useState<IngredientStat[]>([]);
    const [frequentlyUsed, setFrequentlyUsed] = useState<IngredientStat[]>([]);
    const [frequentlyWasted, setFrequentlyWasted] = useState<IngredientStat[]>([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeStat[]>([]);
    const [loading, setLoading] = useState(true);

    const periods = [
        { key: 'WEEKLY', label: '주간' },
        { key: 'MONTHLY', label: '월간' },
        { key: 'YEARLY', label: '연간' }
    ];

    useEffect(() => {
        loadStatistics();
    }, [selectedPeriod]);

    const loadStatistics = () => {
        setLoading(true);

        // Mock 데이터 로드
        const mockPeriodData: PeriodData = {
            totalAdded: 45,
            totalConsumed: 38,
            totalDisposed: 7,
            wasteRate: 15.6
        };

        const mockFrequentlyAdded: IngredientStat[] = [
            { name: '양파', category: '채소류', count: 8, percentage: 25 },
            { name: '계란', category: '기타', count: 6, percentage: 19 },
            { name: '우유', category: '유제품', count: 5, percentage: 16 },
            { name: '당근', category: '채소류', count: 4, percentage: 13 },
            { name: '대파', category: '채소류', count: 3, percentage: 9 }
        ];

        const mockFrequentlyUsed: IngredientStat[] = [
            { name: '계란', category: '기타', count: 12, percentage: 32 },
            { name: '양파', category: '채소류', count: 10, percentage: 26 },
            { name: '대파', category: '채소류', count: 8, percentage: 21 },
            { name: '마늘', category: '채소류', count: 6, percentage: 16 },
            { name: '당근', category: '채소류', count: 2, percentage: 5 }
        ];

        const mockFrequentlyWasted: IngredientStat[] = [
            { name: '상추', category: '채소류', count: 5, percentage: 71 },
            { name: '우유', category: '유제품', count: 3, percentage: 60 },
            { name: '토마토', category: '채소류', count: 2, percentage: 50 },
            { name: '바나나', category: '과일류', count: 1, percentage: 33 }
        ];

        const mockFavoriteRecipes: RecipeStat[] = [
            {
                recipeId: 1,
                title: '김치볶음밥',
                imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
                cookCount: 5,
                averageRating: 4.8,
                lastCookedAt: '2024-01-15T11:00:00Z'
            },
            {
                recipeId: 2,
                title: '계란말이',
                imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=200&fit=crop',
                cookCount: 4,
                averageRating: 4.5,
                lastCookedAt: '2024-01-10T18:30:00Z'
            },
            {
                recipeId: 3,
                title: '된장찌개',
                imageUrl: 'https://images.unsplash.com/photo-1559847844-d9c3ad5e4a3c?w=300&h=200&fit=crop',
                cookCount: 3,
                averageRating: 4.7,
                lastCookedAt: '2024-01-08T19:15:00Z'
            }
        ];

        setTimeout(() => {
            setPeriodData(mockPeriodData);
            setFrequentlyAdded(mockFrequentlyAdded);
            setFrequentlyUsed(mockFrequentlyUsed);
            setFrequentlyWasted(mockFrequentlyWasted);
            setFavoriteRecipes(mockFavoriteRecipes);
            setLoading(false);
        }, 500);
    };

    const handleBack = () => {
        console.log('Go back to previous page');
    };

    const handleRecipeClick = (recipeId: number) => {
        console.log('Navigate to recipe detail:', recipeId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    const getProgressBarColor = (percentage: number) => {
        if (percentage >= 70) return 'bg-red-500';
        if (percentage >= 40) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">통계를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            뒤로
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">나의 통계</h1>
                        <div className="w-20" />
                    </div>

                    {/* 기간 필터 */}
                    <div className="flex gap-2">
                        {periods.map((period) => (
                            <button
                                key={period.key}
                                onClick={() => setSelectedPeriod(period.key as any)}
                                className={`px-4 py-2 rounded-full transition-colors ${
                                    selectedPeriod === period.key
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* 요약 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{periodData.totalAdded}</p>
                        <p className="text-sm text-gray-600">추가한 식재료</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                            <ChefHat className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{periodData.totalConsumed}</p>
                        <p className="text-sm text-gray-600">소비한 식재료</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-2">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{periodData.totalDisposed}</p>
                        <p className="text-sm text-gray-600">폐기한 식재료</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mx-auto mb-2">
                            <TrendingDown className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{periodData.wasteRate}%</p>
                        <p className="text-sm text-gray-600">폐기율</p>
                    </div>
                </div>

                {/* 자주 추가한 식재료 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 추가한 식재료</h2>
                    <div className="space-y-3">
                        {frequentlyAdded.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6 text-center">
                    {index + 1}
                  </span>
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-right">
                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">{item.count}번</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 자주 사용하는 식재료 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">자주 사용하는 식재료</h2>
                    <div className="space-y-3">
                        {frequentlyUsed.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-6 text-center">
                    {index + 1}
                  </span>
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 text-right">
                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">{item.count}번</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 자주 버리는 식재료 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">자주 버리는 식재료</h2>
                        <div className="flex items-center gap-1 text-orange-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">개선 필요</span>
                        </div>
                    </div>

                    {frequentlyWasted.length > 0 ? (
                        <div className="space-y-3">
                            {frequentlyWasted.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-6 text-center">
                      {index + 1}
                    </span>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-right">
                                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${getProgressBarColor(item.percentage || 0)}`}
                                                    style={{ width: `${item.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 w-12">{item.count}번</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">🎉</div>
                            <p className="text-gray-600">버린 식재료가 없어요!</p>
                            <p className="text-sm text-gray-500">정말 잘하고 계세요</p>
                        </div>
                    )}
                </div>

                {/* 즐겨 만드는 레시피 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">즐겨 만드는 레시피</h2>

                    {favoriteRecipes.length > 0 ? (
                        <div className="space-y-4">
                            {favoriteRecipes.map((recipe, index) => (
                                <div
                                    key={recipe.recipeId}
                                    onClick={() => handleRecipeClick(recipe.recipeId)}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                  <span className="text-sm font-medium text-gray-500 w-6 text-center">
                    {index + 1}
                  </span>

                                    <img
                                        src={recipe.imageUrl}
                                        alt={recipe.title}
                                        className="w-16 h-16 object-cover rounded-xl"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800 mb-1">{recipe.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{recipe.cookCount}번 요리</span>
                                            <span>★ {recipe.averageRating}</span>
                                            <span>최근: {formatDate(recipe.lastCookedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">👨‍🍳</div>
                            <p className="text-gray-600">아직 요리 기록이 없어요</p>
                            <p className="text-sm text-gray-500">레시피로 요리해보세요!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyStatisticsPage;