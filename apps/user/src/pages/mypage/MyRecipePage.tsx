import { useEffect, useState } from "react";
// 라우팅을 위한 useNavigate 훅 추가

/* ---- 타입 정의 ---- */
interface Recipe {
    id: number;
    title: string;
    description: string;
    items: string[];
    imageUrl?: string;
}

interface MealCardProps {
    title: string;
    description: string;
    items?: string[];
    imageUrl?: string;
}

/* ---- 카드 컴포넌트 ---- */
function MealCard({ title, description, items = [], imageUrl }: MealCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition max-w-lg mx-auto">
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="h-64 w-full object-cover" />
            ) : (
                <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-400">
                    📷 이미지 없음
                </div>
            )}
            <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
                {items.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-gray-700">
                        {items.map((x, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                                {x}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

/* ---- 메인 컴포넌트 ---- */
function RecipeListPage() {
    const [recipe, setRecipe] = useState<Recipe | null>(null); // 단일 레시피만 관리
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    // const navigate = useNavigate(); // 라우팅 훅 사용

    // 방대한 Mock 데이터
    const baseMockRecipes: Omit<Recipe, 'imageUrl'>[] = [
        {
            id: 1,
            title: "김치볶음밥",
            description: "김치와 밥만 있으면 뚝딱 완성되는 한국인의 소울푸드.",
            items: ["김치", "밥", "달걀", "대파", "참기름", "간장", "김가루"],
        },
        {
            id: 2,
            title: "계란찜",
            description: "부드럽고 따뜻한 계란찜. 아침, 저녁 가리지 않고 잘 어울려요.",
            items: ["달걀", "물", "소금", "참기름", "쪽파"],
        },
        {
            id: 3,
            title: "된장찌개",
            description: "구수하고 진한 맛의 전통 한국 찌개.",
            items: ["된장", "두부", "애호박", "감자", "양파", "청양고추"],
        },
        {
            id: 4,
            title: "불고기",
            description: "달콤짭조름한 간장 양념이 배인 한국식 소불고기.",
            items: ["소고기", "간장", "설탕", "배", "마늘", "대파"],
        },
        {
            id: 5,
            title: "토마토 파스타",
            description: "상큼한 토마토 소스로 완성하는 이탈리안 감성 요리.",
            items: ["스파게티", "토마토 소스", "양파", "마늘", "올리브 오일", "바질"],
        },
        {
            id: 6,
            title: "샐러드",
            description: "가볍게 즐기는 건강한 한 끼 샐러드.",
            items: ["양상추", "방울토마토", "오이", "올리브", "드레싱"],
        },
        {
            id: 7,
            title: "라면",
            description: "5분 만에 완성하는 국민 간식.",
            items: ["라면", "계란", "대파", "김치"],
        },
        {
            id: 8,
            title: "닭볶음탕",
            description: "매콤달콤한 양념에 푹 졸인 닭요리.",
            items: ["닭고기", "감자", "양파", "당근", "고추장", "간장"],
        },
        {
            id: 9,
            title: "비빔밥",
            description: "여러 가지 나물과 고추장을 비벼먹는 한국 대표 음식.",
            items: ["밥", "고사리", "시금치", "도라지", "고추장", "계란"],
        },
        {
            id: 10,
            title: "샌드위치",
            description: "빵 사이에 재료를 가득 넣은 간단한 한 끼.",
            items: ["식빵", "햄", "치즈", "양상추", "토마토", "머스타드"],
        },
    ];

    const fetchRandomRecipe = async () => {
        try {
            setLoading(true);
            setErr("");

            // 딜레이 시뮬레이션
            await new Promise((res) => setTimeout(res, 800));

            // Mock 데이터에서 랜덤으로 1개 선택
            const randomIndex = Math.floor(Math.random() * baseMockRecipes.length);
            const selectedRecipe = baseMockRecipes[randomIndex];

            // 이미지 URL에 랜덤 쿼리 추가
            const query = selectedRecipe.title.replace(/\s/g, '-');
            const randomSeed = Math.floor(Math.random() * 1000000);
            const recipeWithRandomImage = {
                ...selectedRecipe,
                imageUrl: `https://source.unsplash.com/600x400/?${query}&random=${randomSeed}`,
            };

            setRecipe(recipeWithRandomImage);
        } catch (e) {
            setErr("레시피 추천 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomRecipe();
    }, []);

    const handleSkip = () => {
        console.log("다음 레시피 추천");
        fetchRandomRecipe(); // 다른 랜덤 레시피로 교체
    };

    const handleView = () => {
        if (recipe) {
            // 레시피 상세 페이지로 이동 (id를 URL 파라미터로 넘김)
            // 실제 라우팅이 필요합니다. 예: navigate(`/recipes/${recipe.id}`);
            console.log(`레시피 상세 보기: ${recipe.title}`);
        }
    };

    const handleFavorite = () => {
        if (recipe) {
            // 찜 목록 페이지로 이동 및 레시피 정보 전달
            console.log(`찜 목록에 ${recipe.title} 추가`);
            // 실제 라우팅 및 상태 관리가 필요합니다.
            // 예: navigate('/my-recipes', { state: { newFavorite: recipe } });
            // 여기서는 찜 목록 코드를 참고하여 console.log로 대체
            alert(`${recipe.title} (이)가 찜 목록에 추가되었습니다!`);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">AI 레시피 추천 (Mock)</h2>

            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">AI가 요리를 고민 중… 🤔</p>
                </div>
            )}

            {err && <div className="text-center text-red-500 font-medium py-12">{err}</div>}

            {!loading && !err && recipe && (
                <>
                    <MealCard {...recipe} />
                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={handleSkip}
                            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold shadow hover:bg-gray-300 transition"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleView}
                            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
                        >
                            보기
                        </button>
                        <button
                            onClick={handleFavorite}
                            className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
                        >
                            찜
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RecipeListPage;