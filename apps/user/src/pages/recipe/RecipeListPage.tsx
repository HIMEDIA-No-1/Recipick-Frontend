import { useEffect, useState } from "react";

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
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
            {imageUrl ? (
                <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
            ) : (
                <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                    📷 이미지 없음
                </div>
            )}
            <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
                {items.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-gray-700">
                        {items.map((x, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
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
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // 방대한 Mock 데이터 (AI인 척 😎)
    const mockRecipes: Recipe[] = [
        {
            id: 1,
            title: "김치볶음밥",
            description: "김치와 밥만 있으면 뚝딱 완성되는 한국인의 소울푸드.",
            items: ["김치", "밥", "달걀", "대파", "참기름", "간장", "김가루"],
            imageUrl: "https://source.unsplash.com/600x400/?kimchi-fried-rice",
        },
        {
            id: 2,
            title: "계란찜",
            description: "부드럽고 따뜻한 계란찜. 아침, 저녁 가리지 않고 잘 어울려요.",
            items: ["달걀", "물", "소금", "참기름", "쪽파"],
            imageUrl: "https://source.unsplash.com/600x400/?steamed-egg",
        },
        {
            id: 3,
            title: "된장찌개",
            description: "구수하고 진한 맛의 전통 한국 찌개.",
            items: ["된장", "두부", "애호박", "감자", "양파", "청양고추"],
            imageUrl: "https://source.unsplash.com/600x400/?doenjang-stew",
        },
        {
            id: 4,
            title: "불고기",
            description: "달콤짭조름한 간장 양념이 배인 한국식 소불고기.",
            items: ["소고기", "간장", "설탕", "배", "마늘", "대파"],
            imageUrl: "https://source.unsplash.com/600x400/?bulgogi",
        },
        {
            id: 5,
            title: "토마토 파스타",
            description: "상큼한 토마토 소스로 완성하는 이탈리안 감성 요리.",
            items: ["스파게티", "토마토 소스", "양파", "마늘", "올리브 오일", "바질"],
            imageUrl: "https://source.unsplash.com/600x400/?tomato-pasta",
        },
        {
            id: 6,
            title: "샐러드",
            description: "가볍게 즐기는 건강한 한 끼 샐러드.",
            items: ["양상추", "방울토마토", "오이", "올리브", "드레싱"],
            imageUrl: "https://source.unsplash.com/600x400/?salad",
        },
        {
            id: 7,
            title: "라면",
            description: "5분 만에 완성하는 국민 간식.",
            items: ["라면", "계란", "대파", "김치"],
            imageUrl: "https://source.unsplash.com/600x400/?ramen",
        },
        {
            id: 8,
            title: "닭볶음탕",
            description: "매콤달콤한 양념에 푹 졸인 닭요리.",
            items: ["닭고기", "감자", "양파", "당근", "고추장", "간장"],
            imageUrl: "https://source.unsplash.com/600x400/?dakbokkeumtang",
        },
        {
            id: 9,
            title: "비빔밥",
            description: "여러 가지 나물과 고추장을 비벼먹는 한국 대표 음식.",
            items: ["밥", "고사리", "시금치", "도라지", "고추장", "계란"],
            imageUrl: "https://source.unsplash.com/600x400/?bibimbap",
        },
        {
            id: 10,
            title: "샌드위치",
            description: "빵 사이에 재료를 가득 넣은 간단한 한 끼.",
            items: ["식빵", "햄", "치즈", "양상추", "토마토", "머스타드"],
            imageUrl: "https://source.unsplash.com/600x400/?sandwich",
        },
    ];

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            setErr("");
            // 실제 AI API 대신 딜레이 + 랜덤 추천
            await new Promise((res) => setTimeout(res, 800));
            setRecipes(mockRecipes.sort(() => 0.5 - Math.random()).slice(0, 3));
        } catch (e) {
            setErr("레시피 추천 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">AI 레시피 추천 (Mock)</h2>
                <button
                    onClick={fetchRecipes}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {loading ? "불러오는 중…" : "다시 추천"}
                </button>
            </div>

            {err && <div className="text-red-500 font-medium">{err}</div>}
            {loading && <div className="text-gray-500">AI가 요리를 고민 중… 🤔</div>}

            {!loading && !err && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((r) => (
                        <MealCard key={r.id} {...r} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecipeListPage;
