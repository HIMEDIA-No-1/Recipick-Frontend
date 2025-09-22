import { useState, useEffect } from 'react';
import { Heart, Calendar, Star, ChefHat, ArrowLeft, Plus, Folder } from 'lucide-react';

interface Recipe {
    id: number;
    title: string;
    imageUrl: string;
    rating: number;
    difficulty: string;
    cookingTime: number;
    isFavorite: boolean;
}

interface CookingHistory {
    id: number;
    recipeId: number;
    recipeTitle: string;
    recipeImageUrl: string;
    cookedAt: string;
    rating: number;
    usedIngredients: Array<{ name: string; quantity: string }>;
}

interface RecipeFolder {
    id: number;
    name: string;
    recipeCount: number;
    createdAt: string;
    recentRecipes: Recipe[];
}

const MyRecipePage = () => {
    const [activeTab, setActiveTab] = useState<'folders' | 'history'>('folders');
    const [folders, setFolders] = useState<RecipeFolder[]>([]);
    const [cookingHistory, setCookingHistory] = useState<CookingHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Mock 데이터 로드
        const mockFolders: RecipeFolder[] = [
            {
                id: 1,
                name: '한식 레시피',
                recipeCount: 5,
                createdAt: '2024-01-15T10:30:00Z',
                recentRecipes: [
                    {
                        id: 1,
                        title: '김치볶음밥',
                        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
                        rating: 4.5,
                        difficulty: 'EASY',
                        cookingTime: 15,
                        isFavorite: true
                    },
                    {
                        id: 2,
                        title: '된장찌개',
                        imageUrl: 'https://images.unsplash.com/photo-1559847844-d9c3ad5e4a3c?w=300&h=200&fit=crop',
                        rating: 4.3,
                        difficulty: 'MEDIUM',
                        cookingTime: 25,
                        isFavorite: true
                    }
                ]
            },
            {
                id: 2,
                name: '간단 요리',
                recipeCount: 3,
                createdAt: '2024-01-14T15:20:00Z',
                recentRecipes: [
                    {
                        id: 3,
                        title: '계란말이',
                        imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=200&fit=crop',
                        rating: 4.7,
                        difficulty: 'EASY',
                        cookingTime: 10,
                        isFavorite: true
                    }
                ]
            },
            {
                id: 3,
                name: '디저트',
                recipeCount: 0,
                createdAt: '2024-01-13T09:15:00Z',
                recentRecipes: []
            }
        ];

        const mockHistory: CookingHistory[] = [
            {
                id: 1,
                recipeId: 1,
                recipeTitle: '김치볶음밥',
                recipeImageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
                cookedAt: '2024-01-15T11:00:00Z',
                rating: 5,
                usedIngredients: [
                    { name: '김치', quantity: '200g' },
                    { name: '계란', quantity: '2개' }
                ]
            },
            {
                id: 2,
                recipeId: 3,
                recipeTitle: '계란말이',
                recipeImageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=200&fit=crop',
                cookedAt: '2024-01-14T18:30:00Z',
                rating: 4,
                usedIngredients: [
                    { name: '계란', quantity: '3개' },
                    { name: '대파', quantity: '1대' }
                ]
            },
            {
                id: 3,
                recipeId: 2,
                recipeTitle: '된장찌개',
                recipeImageUrl: 'https://images.unsplash.com/photo-1559847844-d9c3ad5e4a3c?w=300&h=200&fit=crop',
                cookedAt: '2024-01-12T19:00:00Z',
                rating: 5,
                usedIngredients: [
                    { name: '두부', quantity: '1/2모' },
                    { name: '양파', quantity: '1개' },
                    { name: '대파', quantity: '1대' }
                ]
            }
        ];

        setTimeout(() => {
            setFolders(mockFolders);
            setCookingHistory(mockHistory);
            setLoading(false);
        }, 500);
    };

    const handleBack = () => {
        console.log('Go back to previous page');
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) {
            alert('폴더 이름을 입력해주세요');
            return;
        }

        if (folders.some(folder => folder.name === newFolderName)) {
            alert('이미 존재하는 폴더 이름입니다');
            return;
        }

        const newFolder: RecipeFolder = {
            id: Date.now(),
            name: newFolderName,
            recipeCount: 0,
            createdAt: new Date().toISOString(),
            recentRecipes: []
        };

        setFolders([...folders, newFolder]);
        setNewFolderName('');
        setShowNewFolderModal(false);
    };

    const handleFolderClick = (folderId: number) => {
        console.log('Navigate to folder detail:', folderId);
    };

    const handleRecipeClick = (recipeId: number) => {
        console.log('Navigate to recipe detail:', recipeId);
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return '오늘';
        } else if (diffDays === 1) {
            return '어제';
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return date.toLocaleDateString('ko-KR');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터를 불러오는 중...</p>
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
                        <h1 className="text-2xl font-bold text-gray-800">나의 레시픽</h1>
                        <div className="w-20" />
                    </div>

                    {/* 탭 */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('folders')}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                                activeTab === 'folders'
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Heart className="w-5 h-5" />
                            찜한 레시피
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                                activeTab === 'history'
                                    ? 'border-emerald-500 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Calendar className="w-5 h-5" />
                            요리 기록
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {activeTab === 'folders' ? (
                    <div>
                        {/* 새 폴더 추가 버튼 */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowNewFolderModal(true)}
                                className="flex items-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                새 폴더 만들기
                            </button>
                        </div>

                        {/* 폴더 목록 */}
                        {folders.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {folders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        onClick={() => handleFolderClick(folder.id)}
                                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-emerald-100 rounded-lg">
                                                <Folder className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{folder.name}</h3>
                                                <p className="text-sm text-gray-500">{folder.recipeCount}개 레시피</p>
                                            </div>
                                        </div>

                                        {/* 최근 레시피 미리보기 */}
                                        {folder.recentRecipes.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {folder.recentRecipes.slice(0, 2).map((recipe) => (
                                                    <div key={recipe.id} className="relative">
                                                        <img
                                                            src={recipe.imageUrl}
                                                            alt={recipe.title}
                                                            className="w-full h-20 object-cover rounded-lg"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                                            <Heart className="w-4 h-4 text-white fill-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                                {folder.recipeCount > 2 && (
                                                    <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-500 text-sm">
                                                        +{folder.recipeCount - 2}개 더
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-lg p-4 mb-3 text-center">
                                                <p className="text-gray-400 text-sm">아직 레시피가 없어요</p>
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-400">{formatDate(folder.createdAt)} 생성</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📁</div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">아직 폴더가 없어요</h2>
                                <p className="text-gray-600 mb-4">첫 번째 폴더를 만들어보세요!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {/* 요리 기록 */}
                        {cookingHistory.length > 0 ? (
                            <div className="space-y-4">
                                {cookingHistory.map((history) => (
                                    <div
                                        key={history.id}
                                        onClick={() => handleRecipeClick(history.recipeId)}
                                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={history.recipeImageUrl}
                                                alt={history.recipeTitle}
                                                className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                        {history.recipeTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < history.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <ChefHat className="w-4 h-4" />
                                                        {formatDate(history.cookedAt)} 요리함
                                                    </div>
                                                </div>

                                                <div className="mb-2">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">사용한 재료:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {history.usedIngredients.map((ingredient, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs"
                                                            >
                                {ingredient.name} ({ingredient.quantity})
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👨‍🍳</div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">요리 기록이 없어요</h2>
                                <p className="text-gray-600">레시피로 요리를 완료하면 기록이 남아요!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 새 폴더 생성 모달 */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">새 폴더 만들기</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                폴더 이름
                            </label>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="예: 한식 레시피, 간단 요리"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                maxLength={20}
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-1">20자 이내로 입력해주세요</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowNewFolderModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRecipePage;