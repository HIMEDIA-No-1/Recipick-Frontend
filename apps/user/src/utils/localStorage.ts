// 로컬 스토리지 키 정의
export const STORAGE_KEYS = {
  USER_STATE: 'user_state',
  USER_ACCOUNTS: 'user_accounts', // 회원가입한 계정들 저장
  FRIDGES_DATA: 'fridges_data',
  INGREDIENTS_DATA: 'ingredients_data',
  RECIPES_DATA: 'recipes_data',
  FAVORITE_RECIPES_DATA: 'favorite_recipes_data',
  NOTIFICATIONS_DATA: 'notifications_data',
  APP_SETTINGS: 'app_settings',
  USER_STATISTICS: 'user_statistics',
} as const;

// 타입 정의
export interface UserState {
  isAuthenticated: boolean;
  userId: string;
  nickname: string;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
  isInitialSetupCompleted: boolean;
  credentialType: 'GOOGLE' | 'NAVER' | 'KAKAO' | 'EMAIL';
}

// 회원가입된 계정 정보
export interface UserAccount {
  userId: string;
  email: string;
  password: string; // 실제로는 해시되어야 하지만 프론트엔드 테스트용
  nickname: string;
  profileImage: string;
  credentialType: 'EMAIL';
  createdAt: string;
}

// 모든 계정들을 저장하는 구조
export interface UserAccounts {
  accounts: UserAccount[];
}

export interface FridgeMember {
  userId: string;
  nickname: string;
  role: 'owner' | 'member';
}

export interface Compartment {
  compartmentId: string;
  name: string;
  type: 'COOL' | 'FREEZE' | 'PANTRY';
}

export interface Fridge {
  fridgeId: string;
  name: string;
  isDefault: boolean;
  isFavorite: boolean;
  memo: string;
  members: FridgeMember[];
  compartments: Compartment[];
}

export interface FridgesData {
  allFridges: Fridge[];
  defaultFridgeId: string;
}

export interface Ingredient {
  ingredientId: string;
  compartmentId: string;
  name: string;
  quantity: number;
  expirationDate: string;
  state: 'FRESH' | 'NEAR_EXPIRY' | 'EXPIRED' | 'CONSUMED' | 'DISPOSED';
  memo: string;
  category: string;
  createdAt: string;
}

export interface IngredientsData {
  allIngredients: Ingredient[];
}

export interface Recipe {
  recipeId: string;
  name: string;
  image: string;
  difficulty: string;
  missingIngredientsCount: number;
}

export interface FavoriteRecipe {
  recipeId: string;
  addedAt: string;
}

export interface CookingHistory {
  historyId: string;
  recipeId: string;
  cookedAt: string;
  rating: number;
}

export interface RecipesData {
  recipesList: Recipe[];
  favoriteRecipes: FavoriteRecipe[];
  cookingHistory: CookingHistory[];
}

export interface Notification {
  notificationId: string;
  type: 'MESSAGE' | 'INVITE_FRIDGE';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsData {
  allNotifications: Notification[];
}

export interface IngredientStats {
  weekly: { added: number; consumed: number; disposed: number };
  monthly: { added: number; consumed: number; disposed: number };
  yearly: { added: number; consumed: number; disposed: number };
}

export interface MostUsedFridge {
  fridgeId: string;
  name: string;
  count: number;
}

export interface UserStatistics {
  ingredientStats: IngredientStats;
  mostUsedFridge: MostUsedFridge;
}

export interface AppSettings {
  darkMode: boolean;
  notificationEnabled: boolean;
  language: string;
}

// 로컬 스토리지 유틸리티 함수들
export const StorageUtil = {
  // 저장
  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
    }
  },

  // 불러오기
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to load from localStorage (${key}):`, error);
      return null;
    }
  },

  // 삭제
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage (${key}):`, error);
    }
  },

  // 모든 앱 데이터 초기화
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  },

  // 사용자 상태 저장/불러오기
  saveUserState(userState: UserState): void {
    this.set(STORAGE_KEYS.USER_STATE, userState);
  },

  getUserState(): UserState | null {
    return this.get<UserState>(STORAGE_KEYS.USER_STATE);
  },

  // 냉장고 데이터 저장/불러오기
  saveFridgesData(fridgesData: FridgesData): void {
    this.set(STORAGE_KEYS.FRIDGES_DATA, fridgesData);
  },

  getFridgesData(): FridgesData | null {
    return this.get<FridgesData>(STORAGE_KEYS.FRIDGES_DATA);
  },

  // 식재료 데이터 저장/불러오기
  saveIngredientsData(ingredientsData: IngredientsData): void {
    this.set(STORAGE_KEYS.INGREDIENTS_DATA, ingredientsData);
  },

  getIngredientsData(): IngredientsData | null {
    return this.get<IngredientsData>(STORAGE_KEYS.INGREDIENTS_DATA);
  },

  // 레시피 데이터 저장/불러오기
  saveRecipesData(recipesData: RecipesData): void {
    this.set(STORAGE_KEYS.RECIPES_DATA, recipesData);
  },

  getRecipesData(): RecipesData | null {
    return this.get<RecipesData>(STORAGE_KEYS.RECIPES_DATA);
  },

  // 알림 데이터 저장/불러오기
  saveNotificationsData(notificationsData: NotificationsData): void {
    this.set(STORAGE_KEYS.NOTIFICATIONS_DATA, notificationsData);
  },

  getNotificationsData(): NotificationsData | null {
    return this.get<NotificationsData>(STORAGE_KEYS.NOTIFICATIONS_DATA);
  },

  // 앱 설정 저장/불러오기
  saveAppSettings(appSettings: AppSettings): void {
    this.set(STORAGE_KEYS.APP_SETTINGS, appSettings);
  },

  getAppSettings(): AppSettings | null {
    return this.get<AppSettings>(STORAGE_KEYS.APP_SETTINGS);
  },

  // 사용자 통계 저장/불러오기
  saveUserStatistics(userStatistics: UserStatistics): void {
    this.set(STORAGE_KEYS.USER_STATISTICS, userStatistics);
  },

  getUserStatistics(): UserStatistics | null {
    return this.get<UserStatistics>(STORAGE_KEYS.USER_STATISTICS);
  },

  // 계정 관련 함수들
  saveUserAccounts(userAccounts: UserAccounts): void {
    this.set(STORAGE_KEYS.USER_ACCOUNTS, userAccounts);
  },

  getUserAccounts(): UserAccounts | null {
    return this.get<UserAccounts>(STORAGE_KEYS.USER_ACCOUNTS);
  },

  // 새 계정 등록
  registerAccount(accountData: Omit<UserAccount, 'userId' | 'createdAt'>): UserAccount {
    const accounts = this.getUserAccounts() || { accounts: [] };

    // 이메일 중복 체크
    const existingAccount = accounts.accounts.find(acc => acc.email === accountData.email);
    if (existingAccount) {
      throw new Error('이미 등록된 이메일입니다.');
    }

    const newAccount: UserAccount = {
      ...accountData,
      userId: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    accounts.accounts.push(newAccount);
    this.saveUserAccounts(accounts);

    return newAccount;
  },

  // 로그인 검증
  authenticateUser(email: string, password: string): UserAccount | null {
    const accounts = this.getUserAccounts();
    if (!accounts) return null;

    const account = accounts.accounts.find(
      acc => acc.email === email && acc.password === password
    );

    return account || null;
  },

  // 계정 정보 업데이트
  updateUserAccount(userId: string, updates: Partial<Pick<UserAccount, 'nickname' | 'profileImage' | 'password'>>): boolean {
    const accounts = this.getUserAccounts();
    if (!accounts) return false;

    const accountIndex = accounts.accounts.findIndex(acc => acc.userId === userId);
    if (accountIndex === -1) return false;

    accounts.accounts[accountIndex] = {
      ...accounts.accounts[accountIndex],
      ...updates,
    };

    this.saveUserAccounts(accounts);
    return true;
  },

  // 현재 로그인된 사용자의 계정 정보 가져오기
  getCurrentUserAccount(): UserAccount | null {
    const userState = this.getUserState();
    if (!userState || !userState.isAuthenticated) return null;

    const accounts = this.getUserAccounts();
    if (!accounts) return null;

    return accounts.accounts.find(acc => acc.userId === userState.userId) || null;
  },
};

// 초기 데이터 생성 함수들
export const InitialDataGenerator = {
  // 사용자를 위한 기본 냉장고 데이터 생성
  createDefaultFridgeData(userId: string, nickname: string): FridgesData {
    const defaultFridgeId = `fridge-${userId}-default`;

    return {
      allFridges: [
        {
          fridgeId: defaultFridgeId,
          name: `${nickname}님의 냉장고`,
          isDefault: true,
          isFavorite: true,
          memo: '',
          members: [
            {
              userId,
              nickname,
              role: 'owner',
            },
          ],
          compartments: [
            {
              compartmentId: `${defaultFridgeId}-cool`,
              name: '냉장실',
              type: 'COOL',
            },
            {
              compartmentId: `${defaultFridgeId}-freeze`,
              name: '냉동실',
              type: 'FREEZE',
            },
            {
              compartmentId: `${defaultFridgeId}-pantry`,
              name: '실온보관',
              type: 'PANTRY',
            },
          ],
        },
      ],
      defaultFridgeId,
    };
  },

  // 빈 식재료 데이터 생성
  createEmptyIngredientsData(): IngredientsData {
    return {
      allIngredients: [],
    };
  },

  // 기본 레시피 데이터 생성
  createDefaultRecipesData(): RecipesData {
    return {
      recipesList: [
        {
          recipeId: 'recipe-001',
          name: '김치찌개',
          image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300',
          difficulty: '쉬움',
          missingIngredientsCount: 2,
        },
        {
          recipeId: 'recipe-002',
          name: '계란후라이',
          image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300',
          difficulty: '쉬움',
          missingIngredientsCount: 0,
        },
      ],
      favoriteRecipes: [],
      cookingHistory: [],
    };
  },

  // 기본 알림 데이터 생성
  createDefaultNotificationsData(): NotificationsData {
    return {
      allNotifications: [
        {
          notificationId: 'notif-001',
          type: 'MESSAGE',
          message: 'Recipick에 오신 것을 환영합니다!',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };
  },

  // 기본 앱 설정 생성
  createDefaultAppSettings(): AppSettings {
    return {
      darkMode: false,
      notificationEnabled: true,
      language: 'ko',
    };
  },

  // 기본 사용자 통계 생성
  createDefaultUserStatistics(): UserStatistics {
    return {
      ingredientStats: {
        weekly: { added: 0, consumed: 0, disposed: 0 },
        monthly: { added: 0, consumed: 0, disposed: 0 },
        yearly: { added: 0, consumed: 0, disposed: 0 },
      },
      mostUsedFridge: {
        fridgeId: '',
        name: '',
        count: 0,
      },
    };
  },

  // 로그인 성공 시 모든 초기 데이터 생성
  initializeUserData(userId: string, nickname: string): void {
    // 냉장고 데이터 초기화
    const fridgesData = this.createDefaultFridgeData(userId, nickname);
    StorageUtil.saveFridgesData(fridgesData);

    // 식재료 데이터 초기화
    const ingredientsData = this.createEmptyIngredientsData();
    StorageUtil.saveIngredientsData(ingredientsData);

    // 레시피 데이터 초기화
    const recipesData = this.createDefaultRecipesData();
    StorageUtil.saveRecipesData(recipesData);

    // 알림 데이터 초기화
    const notificationsData = this.createDefaultNotificationsData();
    StorageUtil.saveNotificationsData(notificationsData);

    // 앱 설정 초기화
    const appSettings = this.createDefaultAppSettings();
    StorageUtil.saveAppSettings(appSettings);

    // 사용자 통계 초기화
    const userStatistics = this.createDefaultUserStatistics();
    StorageUtil.saveUserStatistics(userStatistics);
  },
};