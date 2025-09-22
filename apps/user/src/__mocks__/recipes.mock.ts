export interface Recipe {
    id: number;
    title: string;
    description: string;
    emoji: string;
    ingredients: string[];
    steps: string[];
    difficulty: "쉬움" | "중간" | "어려움";
}

export const mockRecipes: Recipe[] = [
    {
        id: 1,
        title: "김치볶음밥",
        description: "김치와 밥만 있으면 뚝딱 완성되는 한국인의 소울푸드.",
        emoji: "🍛",
        ingredients: ["김치", "밥", "달걀", "대파", "참기름"],
        steps: ["김치를 볶는다.", "밥 넣고 볶는다.", "계란후라이 올려 마무리."],
        difficulty: "쉬움",
    },
    {
        id: 2,
        title: "토마토 파스타",
        description: "상큼한 토마토 소스로 만드는 이탈리아 감성 파스타.",
        emoji: "🍝",
        ingredients: ["파스타면", "토마토소스", "올리브유", "마늘", "바질"],
        steps: ["면을 삶는다.", "소스를 데운다.", "면과 소스를 섞는다."],
        difficulty: "중간",
    },
    {
        id: 3,
        title: "초밥",
        description: "정성껏 쥔 한입 크기의 초밥.",
        emoji: "🍣",
        ingredients: ["밥", "식초", "생선", "김"],
        steps: ["밥을 식초에 비빈다.", "생선을 썬다.", "밥 위에 올려 쥔다."],
        difficulty: "어려움",
    },
    {
        id: 4,
        title: "피자",
        description: "치즈 듬뿍 얹은 바삭한 도우의 이탈리아 정통 피자.",
        emoji: "🍕",
        ingredients: ["도우", "토마토소스", "치즈", "토핑"],
        steps: ["도우에 소스를 바른다.", "치즈와 토핑을 올린다.", "오븐에 굽는다."],
        difficulty: "중간",
    },
    {
        id: 5,
        title: "햄버거",
        description: "패티와 채소, 소스가 조화를 이루는 간편식의 왕.",
        emoji: "🍔",
        ingredients: ["빵", "소고기 패티", "양상추", "토마토", "소스"],
        steps: ["패티를 굽는다.", "빵 사이에 재료를 넣는다.", "소스를 뿌린다."],
        difficulty: "쉬움",
    },
    {
        id: 6,
        title: "라멘",
        description: "진한 국물과 쫄깃한 면발의 일본 대표 요리.",
        emoji: "🍜",
        ingredients: ["라멘면", "육수", "차슈", "달걀"],
        steps: ["육수를 끓인다.", "면을 삶는다.", "재료를 올린다."],
        difficulty: "중간",
    },
    {
        id: 7,
        title: "샐러드",
        description: "가볍게 즐기는 신선한 야채 샐러드.",
        emoji: "🥗",
        ingredients: ["양상추", "토마토", "오이", "드레싱"],
        steps: ["야채를 씻는다.", "먹기 좋게 자른다.", "드레싱을 뿌린다."],
        difficulty: "쉬움",
    },
    {
        id: 8,
        title: "스테이크",
        description: "겉은 바삭, 속은 촉촉한 고급스러운 요리.",
        emoji: "🥩",
        ingredients: ["소고기", "소금", "후추", "버터", "허브"],
        steps: ["고기를 굽는다.", "버터와 허브로 향을 낸다.", "먹기 좋게 썬다."],
        difficulty: "어려움",
    },
    {
        id: 9,
        title: "샌드위치",
        description: "간단하게 만들 수 있는 한 끼 식사.",
        emoji: "🥪",
        ingredients: ["식빵", "햄", "치즈", "야채"],
        steps: ["식빵에 재료를 올린다.", "소스를 뿌린다.", "덮어 자른다."],
        difficulty: "쉬움",
    },
    {
        id: 10,
        title: "라자냐",
        description: "치즈와 고기소스가 층층이 쌓인 오븐 요리.",
        emoji: "🍲",
        ingredients: ["라자냐면", "토마토소스", "고기", "치즈"],
        steps: ["면과 소스를 번갈아 올린다.", "치즈를 듬뿍 올린다.", "오븐에 굽는다."],
        difficulty: "어려움",
    },
    {
        id: 11,
        title: "도넛",
        description: "달콤하고 부드러운 간식.",
        emoji: "🍩",
        ingredients: ["밀가루", "설탕", "버터", "기름"],
        steps: ["반죽을 한다.", "도넛 모양을 만든다.", "기름에 튀긴다."],
        difficulty: "중간",
    },
    {
        id: 12,
        title: "초콜릿 케이크",
        description: "진한 달콤함이 가득한 디저트.",
        emoji: "🍰",
        ingredients: ["밀가루", "코코아", "계란", "버터"],
        steps: ["반죽을 만든다.", "틀에 붓는다.", "오븐에 굽는다."],
        difficulty: "어려움",
    },
];
