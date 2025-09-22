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
  inviteData?: {
    fridgeId: string;
    fridgeName: string;
    inviterUserId: string;
    inviterNickname: string;
  };
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

  // 멀티유저 냉장고 공유 기능
  // 모든 등록된 사용자 검색 (현재 사용자 제외)
  searchUsers(query: string): UserAccount[] {
    const accounts = this.getUserAccounts();
    const currentUser = this.getCurrentUserAccount();
    if (!accounts || !currentUser) return [];

    return accounts.accounts.filter(account =>
      account.userId !== currentUser.userId &&
      (account.nickname.toLowerCase().includes(query.toLowerCase()) ||
       account.email.toLowerCase().includes(query.toLowerCase()))
    );
  },

  // 냉장고 공유 요청 보내기
  sendFridgeInvitation(fridgeId: string, targetUserId: string): boolean {
    const currentUser = this.getCurrentUserAccount();
    const fridgesData = this.getFridgesData();

    if (!currentUser || !fridgesData) return false;

    const fridge = fridgesData.allFridges.find(f => f.fridgeId === fridgeId);
    if (!fridge) return false;

    // 이미 멤버인지 확인
    if (fridge.members.some(member => member.userId === targetUserId)) {
      return false; // 이미 멤버임
    }

    // 모든 사용자의 알림 데이터에 초대 알림 추가
    const accounts = this.getUserAccounts();
    if (!accounts) return false;

    accounts.accounts.forEach(account => {
      if (account.userId === targetUserId) {
        // 해당 사용자로 임시 전환해서 알림 추가
        const originalUserState = this.getUserState();

        // 임시로 대상 사용자로 전환
        this.saveUserState({
          ...originalUserState!,
          userId: account.userId,
          nickname: account.nickname
        });

        const targetNotifications = this.getNotificationsData() || { allNotifications: [] };

        const newNotification: Notification = {
          notificationId: `invite-${Date.now()}`,
          type: 'INVITE_FRIDGE',
          message: `${currentUser.nickname}님이 "${fridge.name}" 냉장고에 초대했습니다.`,
          isRead: false,
          createdAt: new Date().toISOString(),
          // 초대 관련 추가 데이터
          inviteData: {
            fridgeId: fridgeId,
            fridgeName: fridge.name,
            inviterUserId: currentUser.userId,
            inviterNickname: currentUser.nickname
          }
        };

        targetNotifications.allNotifications.unshift(newNotification);
        this.saveNotificationsData(targetNotifications);

        // 원래 사용자로 복구
        if (originalUserState) {
          this.saveUserState(originalUserState);
        }
      }
    });

    return true;
  },

  // 냉장고 초대 수락
  acceptFridgeInvitation(notificationId: string): boolean {
    const currentUser = this.getCurrentUserAccount();
    const notifications = this.getNotificationsData();

    if (!currentUser || !notifications) return false;

    const invitation = notifications.allNotifications.find(n => n.notificationId === notificationId);
    if (!invitation || invitation.type !== 'INVITE_FRIDGE' || !invitation.inviteData) return false;

    const { fridgeId, inviterUserId } = invitation.inviteData;

    // 모든 사용자의 냉장고 데이터 동기화
    const accounts = this.getUserAccounts();
    if (!accounts) return false;

    let fridgeToShare: Fridge | null = null;

    // 초대자의 냉장고 데이터에서 해당 냉장고 찾기
    accounts.accounts.forEach(account => {
      if (account.userId === inviterUserId) {
        const originalUserState = this.getUserState();

        // 임시로 초대자로 전환
        this.saveUserState({
          ...originalUserState!,
          userId: account.userId,
          nickname: account.nickname
        });

        const inviterFridgesData = this.getFridgesData();
        if (inviterFridgesData) {
          fridgeToShare = inviterFridgesData.allFridges.find(f => f.fridgeId === fridgeId) || null;
        }

        // 원래 사용자로 복구
        if (originalUserState) {
          this.saveUserState(originalUserState);
        }
      }
    });

    if (!fridgeToShare) return false;

    // 현재 사용자를 냉장고 멤버로 추가
    const updatedFridge: Fridge = Object.assign({}, fridgeToShare, {
      members: [...(fridgeToShare as Fridge).members, {
        userId: currentUser.userId,
        nickname: currentUser.nickname,
        role: 'member'
      }]
    });

    // 모든 관련 사용자의 냉장고 데이터 업데이트
    this.syncFridgeToAllMembers(updatedFridge);

    // 알림 제거
    const updatedNotifications = {
      ...notifications,
      allNotifications: notifications.allNotifications.filter(n => n.notificationId !== notificationId)
    };
    this.saveNotificationsData(updatedNotifications);

    return true;
  },

  // 냉장고 초대 거절
  rejectFridgeInvitation(notificationId: string): boolean {
    const notifications = this.getNotificationsData();
    if (!notifications) return false;

    const updatedNotifications = {
      ...notifications,
      allNotifications: notifications.allNotifications.filter(n => n.notificationId !== notificationId)
    };
    this.saveNotificationsData(updatedNotifications);

    return true;
  },

  // 냉장고 데이터를 모든 멤버에게 동기화
  syncFridgeToAllMembers(updatedFridge: Fridge): void {
    const accounts = this.getUserAccounts();
    if (!accounts) return;

    const originalUserState = this.getUserState();

    // 냉장고의 모든 멤버에게 업데이트된 냉장고 데이터 동기화
    updatedFridge.members.forEach(member => {
      const memberAccount = accounts.accounts.find(acc => acc.userId === member.userId);
      if (memberAccount) {
        // 임시로 해당 멤버로 전환
        this.saveUserState({
          ...originalUserState!,
          userId: memberAccount.userId,
          nickname: memberAccount.nickname
        });

        const memberFridgesData = this.getFridgesData() || { allFridges: [], defaultFridgeId: '' };

        // 해당 냉장고 업데이트 또는 추가
        const fridgeIndex = memberFridgesData.allFridges.findIndex(f => f.fridgeId === updatedFridge.fridgeId);

        if (fridgeIndex >= 0) {
          memberFridgesData.allFridges[fridgeIndex] = updatedFridge;
        } else {
          memberFridgesData.allFridges.push(updatedFridge);
        }

        this.saveFridgesData(memberFridgesData);
      }
    });

    // 원래 사용자로 복구
    if (originalUserState) {
      this.saveUserState(originalUserState);
    }
  },

  // 공유된 냉장고 업데이트 (모든 멤버에게 동기화)
  updateSharedFridge(fridgeId: string, updates: Partial<Fridge>): boolean {
    const currentFridgesData = this.getFridgesData();
    if (!currentFridgesData) return false;

    const fridgeIndex = currentFridgesData.allFridges.findIndex(f => f.fridgeId === fridgeId);
    if (fridgeIndex === -1) return false;

    const updatedFridge = { ...currentFridgesData.allFridges[fridgeIndex], ...updates };

    // 모든 멤버에게 동기화
    this.syncFridgeToAllMembers(updatedFridge);

    return true;
  },

  // 냉장고에서 멤버 제거
  removeFridgeMember(fridgeId: string, memberUserId: string): boolean {
    const fridgesData = this.getFridgesData();
    if (!fridgesData) return false;

    const fridge = fridgesData.allFridges.find(f => f.fridgeId === fridgeId);
    if (!fridge) return false;

    const updatedFridge: Fridge = {
      ...fridge,
      members: fridge.members.filter(member => member.userId !== memberUserId)
    };

    // 제거된 멤버의 냉장고 목록에서도 해당 냉장고 제거
    const accounts = this.getUserAccounts();
    if (accounts) {
      const originalUserState = this.getUserState();

      const removedMemberAccount = accounts.accounts.find(acc => acc.userId === memberUserId);
      if (removedMemberAccount) {
        // 임시로 제거된 멤버로 전환
        this.saveUserState({
          ...originalUserState!,
          userId: removedMemberAccount.userId,
          nickname: removedMemberAccount.nickname
        });

        const memberFridgesData = this.getFridgesData();
        if (memberFridgesData) {
          const updatedMemberFridgesData = {
            ...memberFridgesData,
            allFridges: memberFridgesData.allFridges.filter(f => f.fridgeId !== fridgeId)
          };
          this.saveFridgesData(updatedMemberFridgesData);
        }

        // 원래 사용자로 복구
        if (originalUserState) {
          this.saveUserState(originalUserState);
        }
      }
    }

    // 나머지 멤버들에게 업데이트된 냉장고 동기화
    this.syncFridgeToAllMembers(updatedFridge);

    return true;
  },
};

// 리얼한 목업 데이터 생성기
export const MockDataGenerator = {
  // 리얼한 한국 이름들
  getRealisticNames(): string[] {
    return [
      '김민준', '이서윤', '박지호', '최예린', '정도현', '강하은', '조민수', '윤지우',
      '임서준', '한예나', '오준영', '신다은', '장민재', '배서현', '황동혁', '송지아',
      '안준호', '홍유진', '백시우', '문채원', '양준혁', '권소은', '유민석', '진하늘',
      '서지훈', '김나연', '이태민', '박수빈', '최현우', '정아린', '강민규', '조예원',
      '윤서영', '임도윤', '한지민', '오수아', '신재우', '장윤서', '배준서', '황소영',
      '송현준', '안지윤', '홍민준', '백예은', '문지호', '양서연', '권도현', '유하은',
      '진민호', '서나경', '김준혁', '이소민', '박윤진', '최서우', '정민지', '강지훈',
      '조하린', '윤예준', '임지원', '한민서', '오준기', '신예린', '장현우', '배지안'
    ];
  },

  // 이메일 도메인들
  getEmailDomains(): string[] {
    return ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'outlook.com', 'yahoo.com'];
  },

  // 냉장고 이름들
  getFridgeNames(): string[] {
    return [
      '우리집 냉장고', '메인 냉장고', '주방 냉장고', '거실 냉장고', '사무실 냉장고',
      '김치냉장고', '미니 냉장고', '1층 냉장고', '2층 냉장고', '대용량 냉장고',
      '새 냉장고', '큰 냉장고', '작은 냉장고', '옆집 냉장고', '공용 냉장고'
    ];
  },

  // 보관칸 이름들
  getCompartmentNames(): { [key: string]: string[] } {
    return {
      COOL: ['냉장실', '야채칸', '과일칸', '음료수칸', '반찬칸', '달걀칸', '치즈칸', '우유칸'],
      FREEZE: ['냉동실', '육류칸', '해산물칸', '아이스크림칸', '만두칸', '냉동식품칸', '얼음칸'],
      PANTRY: ['실온보관', '양념칸', '라면칸', '과자칸', '통조림칸', '조미료칸', '쌀통', '빵칸']
    };
  },

  // 메모들
  getFridgeMemos(): string[] {
    return [
      '우유 떨어지면 구매하기\n계란 유통기한 체크',
      '주말에 대청소 예정\n냉동실 정리하기',
      '김치 새로 담갔음\n2주 후 맛보기',
      '야채 신선도 관리 중\n매일 체크하기',
      '생일파티 준비\n케이크 재료 구매',
      '다이어트 중\n고칼로리 음식 제한',
      '아이 이유식 재료\n유기농 위주 구매',
      '명절 준비\n전통음식 재료 확보',
      '손님 접대 준비\n고급 재료 구매',
      '건강식 위주\n영양균형 맞추기'
    ];
  },

  // 실제 알림 메시지들
  getNotificationMessages(): string[] {
    return [
      'Recipick에 오신 것을 환영합니다! 냉장고 관리를 시작해보세요.',
      '새로운 레시피가 추가되었습니다. 확인해보세요!',
      '유통기한이 임박한 식재료가 있습니다.',
      '이번 주 식재료 소비량이 평소보다 높습니다.',
      '냉장고 공유 기능을 사용해보세요.',
      '새로운 요리 도전! 오늘의 추천 레시피를 확인하세요.',
      '식재료 절약 팁이 업데이트되었습니다.',
      '이번 달 식재료 통계를 확인해보세요.'
    ];
  },

  // 리얼한 사용자 계정들 생성
  generateRealisticUsers(count: number = 15): UserAccount[] {
    const names = this.getRealisticNames().slice(0, count);
    const domains = this.getEmailDomains();
    const users: UserAccount[] = [];

    names.forEach((name, index) => {
      const domain = domains[index % domains.length];
      const emailPrefix = name.replace(/[가-힣]/g, (char) => {
        // 한글을 영문으로 간단히 변환
        const hangulToEng = {
          '김': 'kim', '이': 'lee', '박': 'park', '최': 'choi', '정': 'jung',
          '강': 'kang', '조': 'cho', '윤': 'yoon', '임': 'lim', '한': 'han',
          '오': 'oh', '신': 'shin', '장': 'jang', '배': 'bae', '황': 'hwang',
          '송': 'song', '안': 'ahn', '홍': 'hong', '백': 'baek', '문': 'moon',
          '양': 'yang', '권': 'kwon', '유': 'yoo', '진': 'jin', '서': 'seo',
          '민': 'min', '준': 'jun', '지': 'ji',
          '호': 'ho', '예': 'ye', '도': 'do', '현': 'hyun',
          '하': 'ha', '은': 'eun', '수': 'soo', '우': 'woo', '나': 'na',
          '연': 'yeon', '아': 'a', '경': 'kyung', '원': 'won', '영': 'young',
          '태': 'tae', '빈': 'bin', '규': 'kyu', '석': 'seok', '늘': 'neul',
          '훈': 'hoon', '혁': 'hyuk'
        };
        return hangulToEng[char as keyof typeof hangulToEng] || char;
      }).toLowerCase();

      users.push({
        userId: `user-${Date.now() + index}`,
        email: `${emailPrefix}${index + 1}@${domain}`,
        password: 'password123',
        nickname: name,
        profileImage: '',
        credentialType: 'EMAIL',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    });

    return users;
  },

  // 리얼한 냉장고들 생성
  generateRealisticFridges(users: UserAccount[]): Fridge[] {
    const fridgeNames = this.getFridgeNames();
    const memos = this.getFridgeMemos();
    const fridges: Fridge[] = [];

    users.slice(0, 8).forEach((user, index) => {
      const fridgeId = `fridge-${user.userId}`;
      const fridgeName = fridgeNames[index] || `${user.nickname}의 냉장고`;

      // 일부 냉장고는 공유되도록 설정
      const members: FridgeMember[] = [
        {
          userId: user.userId,
          nickname: user.nickname,
          role: 'owner'
        }
      ];

      // 30% 확률로 다른 사용자 추가 (공유 냉장고)
      if (Math.random() < 0.3 && users.length > index + 1) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (randomUser.userId !== user.userId) {
          members.push({
            userId: randomUser.userId,
            nickname: randomUser.nickname,
            role: 'member'
          });
        }
      }

      const compartmentNames = this.getCompartmentNames();
      const compartments: Compartment[] = [
        {
          compartmentId: `${fridgeId}-cool`,
          name: compartmentNames.COOL[Math.floor(Math.random() * compartmentNames.COOL.length)],
          type: 'COOL'
        },
        {
          compartmentId: `${fridgeId}-freeze`,
          name: compartmentNames.FREEZE[Math.floor(Math.random() * compartmentNames.FREEZE.length)],
          type: 'FREEZE'
        },
        {
          compartmentId: `${fridgeId}-pantry`,
          name: compartmentNames.PANTRY[Math.floor(Math.random() * compartmentNames.PANTRY.length)],
          type: 'PANTRY'
        }
      ];

      // 추가 보관칸 (50% 확률)
      if (Math.random() < 0.5) {
        const types: Array<'COOL' | 'FREEZE' | 'PANTRY'> = ['COOL', 'FREEZE', 'PANTRY'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const availableNames = compartmentNames[randomType].filter(name =>
          !compartments.some(c => c.name === name)
        );

        if (availableNames.length > 0) {
          compartments.push({
            compartmentId: `${fridgeId}-extra`,
            name: availableNames[Math.floor(Math.random() * availableNames.length)],
            type: randomType
          });
        }
      }

      fridges.push({
        fridgeId,
        name: fridgeName,
        isDefault: index === 0,
        isFavorite: Math.random() < 0.4,
        memo: Math.random() < 0.6 ? memos[Math.floor(Math.random() * memos.length)] : '',
        members,
        compartments
      });
    });

    return fridges;
  },

  // 리얼한 알림들 생성
  generateRealisticNotifications(users: UserAccount[], currentUserId: string): Notification[] {
    const messages = this.getNotificationMessages();
    const notifications: Notification[] = [];

    // 환영 메시지
    notifications.push({
      notificationId: `notif-welcome-${Date.now()}`,
      type: 'MESSAGE',
      message: messages[0],
      isRead: Math.random() < 0.7,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    // 일반 알림들
    for (let i = 0; i < 3; i++) {
      notifications.push({
        notificationId: `notif-msg-${Date.now() + i}`,
        type: 'MESSAGE',
        message: messages[i + 1],
        isRead: Math.random() < 0.5,
        createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // 냉장고 초대 알림 (30% 확률)
    if (Math.random() < 0.3 && users.length > 1) {
      const inviter = users.find(u => u.userId !== currentUserId);
      if (inviter) {
        notifications.push({
          notificationId: `notif-invite-${Date.now()}`,
          type: 'INVITE_FRIDGE',
          message: `${inviter.nickname}님이 "${inviter.nickname}의 냉장고"에 초대했습니다.`,
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          inviteData: {
            fridgeId: `fridge-${inviter.userId}`,
            fridgeName: `${inviter.nickname}의 냉장고`,
            inviterUserId: inviter.userId,
            inviterNickname: inviter.nickname
          }
        });
      }
    }

    return notifications.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // 전체 목업 데이터 생성
  generateAllMockData(): void {
    console.log('🎭 리얼한 목업 데이터 생성 중...');

    // 사용자들 생성
    const users = this.generateRealisticUsers(15);

    // 첫 번째 사용자를 현재 로그인 사용자로 설정
    const currentUser = users[0];

    // 사용자 계정들 저장
    StorageUtil.saveUserAccounts({ accounts: users });

    // 냉장고들 생성
    const fridges = this.generateRealisticFridges(users);
    const fridgesData: FridgesData = {
      allFridges: fridges,
      defaultFridgeId: fridges[0]?.fridgeId || ''
    };
    StorageUtil.saveFridgesData(fridgesData);

    // 빈 식재료 데이터
    StorageUtil.saveIngredientsData({ allIngredients: [] });

    // 기본 레시피 데이터
    const recipesData: RecipesData = {
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
        {
          recipeId: 'recipe-003',
          name: '된장찌개',
          image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=300',
          difficulty: '보통',
          missingIngredientsCount: 1,
        }
      ],
      favoriteRecipes: [],
      cookingHistory: []
    };
    StorageUtil.saveRecipesData(recipesData);

    // 알림 데이터
    const notifications = this.generateRealisticNotifications(users, currentUser.userId);
    StorageUtil.saveNotificationsData({ allNotifications: notifications });

    // 기본 앱 설정
    StorageUtil.saveAppSettings({
      darkMode: false,
      notificationEnabled: true,
      language: 'ko'
    });

    // 기본 사용자 통계
    StorageUtil.saveUserStatistics({
      ingredientStats: {
        weekly: { added: Math.floor(Math.random() * 20), consumed: Math.floor(Math.random() * 15), disposed: Math.floor(Math.random() * 3) },
        monthly: { added: Math.floor(Math.random() * 80), consumed: Math.floor(Math.random() * 60), disposed: Math.floor(Math.random() * 10) },
        yearly: { added: Math.floor(Math.random() * 800), consumed: Math.floor(Math.random() * 600), disposed: Math.floor(Math.random() * 80) }
      },
      mostUsedFridge: {
        fridgeId: fridges[0]?.fridgeId || '',
        name: fridges[0]?.name || '',
        count: Math.floor(Math.random() * 50) + 10
      }
    });

    console.log(`✅ 목업 데이터 생성 완료: ${users.length}명의 사용자, ${fridges.length}개의 냉장고, ${notifications.length}개의 알림`);
  }
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