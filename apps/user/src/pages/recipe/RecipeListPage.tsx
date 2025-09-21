import React, { useState, useEffect } from 'react';
import { Heart, Utensils } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

// Firestore와 Gemini API를 위한 전역 변수 설정
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

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

const RecipeList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [difficulty, setDifficulty] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userIngredients, setUserIngredients] = useState<string[]>([]);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // AI에게 레시피를 요청하는 비동기 함수
    const fetchRecipesFromAI = async (ingredients: string[]) => {
        setLoading(true);
        const userQuery = `냉장고에 있는 재료는 다음과 같습니다: ${ingredients.join(', ')}. 이 재료를 활용해 만들 수 있는 요리 레시피 3개를 추천해줘. 난이도는 쉬움, 보통, 어려움으로 구분하고, 필요한 재료 목록과 보유 재료 목록을 JSON 형식으로 제공해줘. 각 레시피마다 평점을 1.0~5.0 사이로 부여하고, 재료 일치율(matchRate)을 0~100 사이의 숫자로 계산해줘. 추천해준 레시피는 다음과 같은 TypeScript 인터페이스를 가진 JSON 배열 형식으로 만들어줘: { id: number; title: string; description: string; difficulty: string; cookingTime: number; servings: number; rating: number; imageUrl: string; matchRate: number; availableIngredients: Array<{ name: string; required: string; available: string }>; missingIngredients: Array<{ name: string; required: string }>; isFavorite: boolean; } 이미지 주소는 임시로 고화질 음식 이미지 URL을 넣어줘.`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            "id": { "type": "NUMBER" },
                            "title": { "type": "STRING" },
                            "description": { "type": "STRING" },
                            "difficulty": { "type": "STRING" },
                            "cookingTime": { "type": "NUMBER" },
                            "servings": { "type": "NUMBER" },
                            "rating": { "type": "NUMBER" },
                            "imageUrl": { "type": "STRING" },
                            "matchRate": { "type": "NUMBER" },
                            "availableIngredients": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "name": { "type": "STRING" },
                                        "required": { "type": "STRING" },
                                        "available": { "type": "STRING" }
                                    }
                                }
                            },
                            "missingIngredients": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "name": { "type": "STRING" },
                                        "required": { "type": "STRING" }
                                    }
                                }
                            },
                            "isFavorite": { "type": "BOOLEAN" }
                        }
                    }
                }
            }
        };

        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (jsonText) {
                const newRecipes = JSON.parse(jsonText);
                setRecipes(newRecipes);
            } else {
                console.error("No recipes returned from API.");
                setRecipes([]);
            }
        } catch (error) {
            console.error("Failed to fetch recipes from AI:", error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // Firebase 초기화 및 사용자 재료 데이터 가져오기
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);

            const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);

                    const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/ingredients`, "my-ingredients");
                    onSnapshot(userDocRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            const ingredients = data.list || [];
                            setUserIngredients(ingredients);
                        } else {
                            setUserIngredients([]);
                        }
                    });
                } else {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                }
            });

            return () => unsubscribeAuth();
        } catch (e) {
            console.error("Firebase initialization or authentication error:", e);
        }
    }, []);

    // 재료 목록이 업데이트될 때마다 AI에게 레시피 요청
    useEffect(() => {
        if (isAuthReady && userIngredients.length > 0) {
            fetchRecipesFromAI(userIngredients);
        } else if (isAuthReady) {
            setLoading(false);
        }
    }, [userIngredients, isAuthReady]);

    // 즐겨찾기 상태 토글
    const handleFavoriteToggle = (recipeId: number) => {
        setRecipes(prev =>
            prev.map(recipe =>
                recipe.id === recipeId
                    ? { ...recipe, isFavorite: !recipe.isFavorite }
                    : recipe
            )
        );
    };

    // 다음 레시피로 이동
    const handleSwipeNext = () => {
        if (currentIndex < recipes.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // 이전 레시피로 이동
    const handleSwipePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // 난이도에 따른 색상 반환
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'EASY': return 'text-green-700 bg-green-100';
            case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
            case 'HARD': return 'text-red-700 bg-red-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    // 스켈레톤 UI 컴포넌트
    const SkeletonCard = () => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 animate-pulse">
            <div className="w-full h-64 bg-gray-200"></div>
            <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="mt-6 h-12 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAF7F2] font-sans pb-12">

            <main className="pt-12">
                <div className="max-w-4xl mx-auto px-4 py-4">

                    {/* 필터 */}
                    <div className="bg-[#FAF7F2] border-b border-gray-200 shadow-sm sticky top-0 z-10">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4 -my-4">
                            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors shadow-sm ${
                                        difficulty === level
                                            ? 'bg-[#6789A5] text-white'
                                            : 'bg-white text-gray-700 hover:bg-[#E0EBF7]'
                                    }`}
                                >
                                    {level === 'ALL' ? '전체' : level === 'EASY' ? '쉬움' : level === 'MEDIUM' ? '보통' : '어려움'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 py-6">
                        {loading ? (
                            <SkeletonCard />
                        ) : recipes.length > 0 ? (
                            <div className="relative">
                                {/* 현재 레시피 카드 */}
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                                    <div className="relative">
                                        {recipes[currentIndex].imageUrl ? (
                                            <img
                                                src={recipes[currentIndex].imageUrl}
                                                alt={recipes[currentIndex].title}
                                                className="w-full h-64 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400">
                                                <Utensils size={64} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipes[currentIndex].difficulty)}`}>
                                                {recipes[currentIndex].difficulty === 'EASY' ? '쉬움' :
                                                    recipes[currentIndex].difficulty === 'MEDIUM' ? '보통' : '어려움'}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-[#6789A5] text-white px-3 py-1 rounded-full text-sm font-bold">
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
                                        <h2 className="text-2xl font-bold text-[#4B4B4B] mb-2">{recipes[currentIndex].title}</h2>
                                        <p className="text-[#7A7E7B] mb-4">{recipes[currentIndex].description}</p>
                                        <div className="flex items-center gap-4 mb-4 text-sm text-[#878787]">
                                            <span>⏰ {recipes[currentIndex].cookingTime}분</span>
                                            <span>👥 {recipes[currentIndex].servings}인분</span>
                                            <span>⭐ {recipes[currentIndex].rating}</span>
                                        </div>
                                        {recipes[currentIndex].availableIngredients.length > 0 && (
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-[#4B4B4B] mb-2">보유 재료</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {recipes[currentIndex].availableIngredients.map((ingredient, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                            {ingredient.name} ({ingredient.available})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {recipes[currentIndex].missingIngredients.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-[#4B4B4B] mb-2">추가 필요 재료</h3>
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
                                            // 존재하지 않는 함수를 호출하는 오류를 수정했습니다.
                                            className="w-full bg-[#6789A5] hover:bg-[#5A7B9B] text-white font-semibold py-3 rounded-lg transition-colors"
                                        >
                                            레시피 자세히 보기
                                        </button>
                                    </div>
                                </div>
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
                                        <span className="text-sm text-[#878787]">
                                            {currentIndex + 1} / {recipes.length}
                                        </span>
                                        <div className="flex justify-center gap-2 mt-2">
                                            {recipes.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                        idx === currentIndex ? 'bg-[#6789A5]' : 'bg-gray-300'
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
                                                : 'bg-[#6789A5] hover:bg-[#5A7B9B] text-white'
                                        }`}
                                    >
                                        다음 레시피
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🍽️</div>
                                <h2 className="text-xl font-semibold text-[#4B4B4B] mb-2">추천할 레시피가 없어요</h2>
                                <p className="text-[#7A7E7B]">냉장고에 재료를 추가해보세요!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecipeList;
