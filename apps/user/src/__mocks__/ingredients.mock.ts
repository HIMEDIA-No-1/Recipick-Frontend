export interface Ingredient {
    id: number;
    name: string;
    quantity?: string; // 선택: 몇 개, 몇 g 등
}

export const myIngredients: Ingredient[] = [
    { id: 1, name: "감자", quantity: "3개" },
    { id: 2, name: "당근", quantity: "2개" },
    { id: 3, name: "양파", quantity: "1개" },
    { id: 4, name: "달걀", quantity: "4개" },
    { id: 5, name: "밀가루", quantity: "200g" },
    { id: 6, name: "소금", quantity: "약간" },
    { id: 7, name: "간장", quantity: "2큰술" },
    { id: 8, name: "치즈", quantity: "조금" },
    { id: 9, name: "닭고기", quantity: "300g" },
    { id: 10, name: "밥", quantity: "1공기" },
];
