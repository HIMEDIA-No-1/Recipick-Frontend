export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  isDeleted: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  userId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  state: 'FRESH' | 'NEAR_EXPIRY' | 'EXPIRED' | 'DISPOSED';
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteRecipe {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'user1@example.com',
    name: '김철수',
    profileImage: 'https://via.placeholder.com/150',
    isDeleted: false,
    createdAt: '2024-01-15T09:30:00.000Z',
    lastLoginAt: '2024-01-20T14:25:00.000Z'
  },
  {
    id: 'user-002',
    email: 'user2@example.com',
    name: '이영희',
    isDeleted: false,
    createdAt: '2024-01-18T11:15:00.000Z',
    lastLoginAt: '2024-01-21T08:45:00.000Z'
  },
  {
    id: 'user-003',
    email: 'user3@example.com',
    name: '박민수',
    isDeleted: false,
    createdAt: '2024-01-20T16:20:00.000Z',
    lastLoginAt: '2024-01-21T19:30:00.000Z'
  },
  {
    id: 'user-004',
    email: 'user4@example.com',
    name: '최지은',
    isDeleted: true,
    createdAt: '2024-01-12T13:45:00.000Z',
    lastLoginAt: '2024-01-19T10:15:00.000Z'
  },
  {
    id: 'user-005',
    email: 'user5@example.com',
    name: '정현우',
    isDeleted: false,
    createdAt: '2024-01-22T07:30:00.000Z',
    lastLoginAt: '2024-01-22T20:45:00.000Z'
  }
];

export const mockRecipes: Recipe[] = [
  {
    id: 'recipe-001',
    title: '김치볶음밥',
    description: '집에 있는 김치로 만드는 간단한 볶음밥',
    imageUrl: 'https://via.placeholder.com/300x200',
    ingredients: ['밥', '김치', '돼지고기', '달걀', '대파', '참기름'],
    instructions: [
      '팬에 기름을 두르고 돼지고기를 볶는다',
      '김치를 넣고 함께 볶는다',
      '밥을 넣고 잘 섞어가며 볶는다',
      '달걀을 풀어 넣고 볶는다',
      '대파와 참기름을 넣고 마무리한다'
    ],
    cookingTime: 15,
    difficulty: 'easy',
    category: '한식',
    tags: ['간단요리', '볶음밥', '김치'],
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z'
  },
  {
    id: 'recipe-002',
    title: '토마토 파스타',
    description: '신선한 토마토로 만드는 이탈리안 파스타',
    imageUrl: 'https://via.placeholder.com/300x200',
    ingredients: ['스파게티면', '토마토', '마늘', '바질', '올리브오일', '파마산 치즈'],
    instructions: [
      '끓는 물에 스파게티면을 삶는다',
      '팬에 올리브오일과 마늘을 볶는다',
      '토마토를 넣고 졸인다',
      '삶은 면을 넣고 소스와 섞는다',
      '바질과 파마산 치즈를 올려 완성한다'
    ],
    cookingTime: 25,
    difficulty: 'medium',
    category: '양식',
    tags: ['파스타', '토마토', '이탈리안'],
    createdAt: '2024-01-11T14:30:00.000Z',
    updatedAt: '2024-01-11T14:30:00.000Z'
  },
  {
    id: 'recipe-003',
    title: '치킨 샐러드',
    description: '건강한 닭가슴살 샐러드',
    imageUrl: 'https://via.placeholder.com/300x200',
    ingredients: ['닭가슴살', '양상추', '토마토', '오이', '올리브오일', '레몬'],
    instructions: [
      '닭가슴살을 삶아서 찢는다',
      '야채들을 적당한 크기로 자른다',
      '모든 재료를 그릇에 담는다',
      '올리브오일과 레몬즙으로 드레싱을 만든다',
      '드레싱을 뿌려 완성한다'
    ],
    cookingTime: 20,
    difficulty: 'easy',
    category: '샐러드',
    tags: ['건강식', '다이어트', '단백질'],
    createdAt: '2024-01-12T16:15:00.000Z',
    updatedAt: '2024-01-12T16:15:00.000Z'
  }
];

export const mockIngredients: Ingredient[] = [
  {
    id: 'ingredient-001',
    userId: 'user-001',
    name: '우유',
    category: '유제품',
    quantity: 1,
    unit: '리터',
    expiryDate: '2024-01-25T00:00:00.000Z',
    state: 'FRESH',
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z'
  },
  {
    id: 'ingredient-002',
    userId: 'user-001',
    name: '토마토',
    category: '채소',
    quantity: 3,
    unit: '개',
    expiryDate: '2024-01-23T00:00:00.000Z',
    state: 'NEAR_EXPIRY',
    createdAt: '2024-01-19T15:30:00.000Z',
    updatedAt: '2024-01-19T15:30:00.000Z'
  },
  {
    id: 'ingredient-003',
    userId: 'user-002',
    name: '양파',
    category: '채소',
    quantity: 2,
    unit: '개',
    expiryDate: '2024-01-21T00:00:00.000Z',
    state: 'EXPIRED',
    createdAt: '2024-01-18T12:00:00.000Z',
    updatedAt: '2024-01-18T12:00:00.000Z'
  },
  {
    id: 'ingredient-004',
    userId: 'user-003',
    name: '당근',
    category: '채소',
    quantity: 1,
    unit: '개',
    expiryDate: '2024-01-20T00:00:00.000Z',
    state: 'DISPOSED',
    createdAt: '2024-01-17T09:15:00.000Z',
    updatedAt: '2024-01-20T14:30:00.000Z'
  },
  {
    id: 'ingredient-005',
    userId: 'user-001',
    name: '닭가슴살',
    category: '육류',
    quantity: 500,
    unit: '그램',
    expiryDate: '2024-01-24T00:00:00.000Z',
    state: 'FRESH',
    createdAt: '2024-01-21T18:45:00.000Z',
    updatedAt: '2024-01-21T18:45:00.000Z'
  },
  {
    id: 'ingredient-006',
    userId: 'user-002',
    name: '계란',
    category: '유제품',
    quantity: 10,
    unit: '개',
    expiryDate: '2024-01-28T00:00:00.000Z',
    state: 'FRESH',
    createdAt: '2024-01-16T11:20:00.000Z',
    updatedAt: '2024-01-16T11:20:00.000Z'
  }
];

export const mockFavoriteRecipes: FavoriteRecipe[] = [
  {
    id: 'favorite-001',
    userId: 'user-001',
    recipeId: 'recipe-001',
    createdAt: '2024-01-20T10:30:00.000Z'
  },
  {
    id: 'favorite-002',
    userId: 'user-002',
    recipeId: 'recipe-001',
    createdAt: '2024-01-20T14:15:00.000Z'
  },
  {
    id: 'favorite-003',
    userId: 'user-003',
    recipeId: 'recipe-001',
    createdAt: '2024-01-21T09:45:00.000Z'
  },
  {
    id: 'favorite-004',
    userId: 'user-001',
    recipeId: 'recipe-002',
    createdAt: '2024-01-21T16:20:00.000Z'
  },
  {
    id: 'favorite-005',
    userId: 'user-002',
    recipeId: 'recipe-002',
    createdAt: '2024-01-22T08:10:00.000Z'
  },
  {
    id: 'favorite-006',
    userId: 'user-001',
    recipeId: 'recipe-003',
    createdAt: '2024-01-22T12:30:00.000Z'
  }
];