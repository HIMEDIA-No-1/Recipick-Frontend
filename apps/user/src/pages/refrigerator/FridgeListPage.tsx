import React, { useState, useEffect } from 'react';
import { Plus, Star, Users } from 'lucide-react';

// window.alert를 대체하는 커스텀 모달 컴포넌트
const CustomModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
                <h3 className="text-xl font-semibold text-[#7A7E7B] mb-4">알림</h3>
                <p className="text-sm text-[#4B4B4B] mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors"
                >
                    확인
                </button>
            </div>
        </div>
    );
};

// 냉장고 타입 인터페이스
interface Refrigerator {
    id: number;
    name: string;
    isDefault: boolean;
    isFavorite: boolean;
    ownerId: number;
    memberCount: number;
    ingredientCount: number;
    createdAt: string;
    memo?: string;
}

// 신규 사용자 가이드 인터페이스
interface NewUserGuidance {
    show: boolean;
    step: number;
}

const FridgeListPage = () => {
    const [refrigerators, setRefrigerators] = useState<Refrigerator[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewFridgeModal, setShowNewFridgeModal] = useState(false);
    const [newFridgeName, setNewFridgeName] = useState('');
    const [guidance, setGuidance] = useState<NewUserGuidance>({ show: false, step: 1 });
    const [isNewUser, setIsNewUser] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Tailwind CSS 및 Inter 폰트를 로드하기 위한 스크립트
    const TW_SCRIPT = `
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
      }
    </style>
  `;

    useEffect(() => {
        // 컴포넌트 마운트 시 Tailwind CSS 및 폰트 스크립트 삽입
        const script = document.createElement('div');
        script.innerHTML = TW_SCRIPT;
        document.head.appendChild(script);

        loadRefrigerators();

        return () => {
            // 컴포넌트 언마운트 시 스크립트 제거
            document.head.removeChild(script);
        };
    }, []);

    const loadRefrigerators = () => {
        // Mock 데이터 로드 - 신규 사용자 체크
        const mockRefrigerators: Refrigerator[] = [
            {
                id: 1,
                name: '우리집 냉장고',
                isDefault: true,
                isFavorite: true,
                ownerId: 1,
                memberCount: 1,
                ingredientCount: 15,
                createdAt: '2024-01-01T10:00:00Z',
                memo: '우유 떨어지면 구매하기'
            },
            {
                id: 2,
                name: '공유 냉장고',
                isDefault: false,
                isFavorite: false,
                ownerId: 2,
                memberCount: 3,
                ingredientCount: 8,
                createdAt: '2024-01-10T15:30:00Z'
            },
            {
                id: 3,
                name: '사무실 냉장고',
                isDefault: false,
                isFavorite: true,
                ownerId: 1,
                memberCount: 5,
                ingredientCount: 12,
                createdAt: '2024-01-15T09:20:00Z'
            }
        ];

        // 신규 사용자인 경우 가이드 표시 (데이터가 비어있는 경우)
        if (mockRefrigerators.length === 0) {
            setIsNewUser(true);
            setGuidance({ show: true, step: 1 });
        } else {
            setRefrigerators(mockRefrigerators);
        }

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const handleCreateFridge = () => {
        if (!newFridgeName.trim()) {
            setAlertMessage('냉장고 이름을 입력해주세요');
            setShowAlert(true);
            return;
        }

        const newFridge: Refrigerator = {
            id: Date.now(),
            name: newFridgeName,
            isDefault: refrigerators.length === 0,
            isFavorite: false,
            ownerId: 1,
            memberCount: 1,
            ingredientCount: 0,
            createdAt: new Date().toISOString()
        };

        setRefrigerators([...refrigerators, newFridge]);
        setNewFridgeName('');
        setShowNewFridgeModal(false);

        // 신규 사용자 가이드 완료
        if (isNewUser) {
            setGuidance({ show: false, step: 1 });
            setIsNewUser(false);
        }
    };

    const handleFridgeClick = (fridgeId: number) => {
        console.log('Navigate to fridge detail:', fridgeId);
    };

    const handleToggleFavorite = (fridgeId: number) => {
        setRefrigerators(prev =>
            prev.map(fridge =>
                fridge.id === fridgeId
                    ? { ...fridge, isFavorite: !fridge.isFavorite }
                    : fridge
            )
        );
    };

    const handleSetDefault = (fridgeId: number) => {
        setRefrigerators(prev =>
            prev.map(fridge => ({
                ...fridge,
                isDefault: fridge.id === fridgeId
            }))
        );
    };

    const handleCloseGuidance = () => {
        setGuidance({ show: false, step: 1 });
    };

    const sortedRefrigerators = [...refrigerators].sort((a, b) => {
        // 기본 냉장고가 최상단
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;

        // 즐겨찾기가 그 다음
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;

        // 나머지는 생성일 기준
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6789A5] mx-auto mb-4"></div>
                    <p className="text-[#878787]">냉장고를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            {/* 신규 사용자 가이드 */}
            {guidance.show && (
                <div className="bg-[#A7C8E8] text-white">
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold mb-1">환영합니다! 첫 번째 냉장고를 만들어보세요</h2>
                                <p className="text-sm text-[#E0EBF7]">냉장고를 생성하면 식재료 관리를 시작할 수 있어요</p>
                            </div>
                            <button
                                onClick={handleCloseGuidance}
                                className="text-[#E0EBF7] hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#6789A5]">냉장고 관리</h1>
                    <button
                        onClick={() => setShowNewFridgeModal(true)}
                        className={`p-2 rounded-full transition-colors ${
                            guidance.show
                                ? 'bg-[#E0EBF7] text-[#6789A5] animate-pulse'
                                : 'hover:bg-[#E0EBF7] text-[#7A7E7B] hover:text-[#6789A5]'
                        }`}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                {/* 냉장고 목록 */}
                {sortedRefrigerators.length > 0 ? (
                    <div className="space-y-4">
                        {sortedRefrigerators.map((fridge) => (
                            <div
                                key={fridge.id}
                                onClick={() => handleFridgeClick(fridge.id)}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {fridge.isDefault && (
                                            <span className="px-3 py-1 bg-[#6789A5] text-white text-xs font-medium rounded-full">
                        기본
                      </span>
                                        )}
                                        <h3 className="text-xl font-semibold text-[#4B4B4B]">
                                            {fridge.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(fridge.id);
                                            }}
                                            className="p-2 hover:bg-[#F0EEEB] rounded-full transition-colors"
                                        >
                                            <Star
                                                className={`w-5 h-5 ${
                                                    fridge.isFavorite
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-[#D1D1D1]'
                                                }`}
                                            />
                                        </button>

                                        {fridge.memberCount > 1 && (
                                            <div className="flex items-center gap-1 text-[#7A7E7B]">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">{fridge.memberCount}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 bg-[#F0EEEB] rounded-lg">
                                        <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.ingredientCount}</p>
                                        <p className="text-sm text-[#7A7E7B]">식재료</p>
                                    </div>
                                    <div className="text-center p-3 bg-[#F0EEEB] rounded-lg">
                                        <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.memberCount}</p>
                                        <p className="text-sm text-[#7A7E7B]">멤버</p>
                                    </div>
                                </div>

                                {fridge.memo && (
                                    <div className="mb-3">
                                        <p className="text-sm text-[#4B4B4B] bg-[#FEF9E7] p-3 rounded-lg">
                                            📝 {fridge.memo}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm text-[#878787]">
                  <span>
                    {new Date(fridge.createdAt).toLocaleDateString('ko-KR')} 생성
                  </span>

                                    {!fridge.isDefault && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSetDefault(fridge.id);
                                            }}
                                            className="text-[#6789A5] hover:text-[#52708E] font-medium"
                                        >
                                            기본으로 설정
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏠</div>
                        <h2 className="text-xl font-semibold text-[#4B4B4B] mb-2">첫 번째 냉장고를 만들어보세요</h2>
                        <p className="text-[#7A7E7B]">냉장고를 추가하고 식재료 관리를 시작해보세요!</p>
                    </div>
                )}
            </div>

            {/* 새 냉장고 생성 모달 */}
            {showNewFridgeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">새 냉장고 만들기</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                냉장고 이름
                            </label>
                            <input
                                type="text"
                                value={newFridgeName}
                                onChange={(e) => setNewFridgeName(e.target.value)}
                                placeholder="예: 우리집 냉장고, 사무실 냉장고"
                                className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                maxLength={20}
                                autoFocus
                            />
                            <p className="text-xs text-[#878787] mt-1">20자 이내로 입력해주세요</p>
                        </div>

                        {isNewUser && (
                            <div className="mb-6 p-4 bg-[#E0EBF7] rounded-lg">
                                <p className="text-sm text-[#6789A5]">
                                    💡 첫 번째 냉장고는 자동으로 '기본 냉장고'로 설정됩니다
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowNewFridgeModal(false)}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCreateFridge}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors"
                            >
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Modal */}
            {showAlert && <CustomModal message={alertMessage} onClose={() => setShowAlert(false)} />}
        </div>
    );
};

export default FridgeListPage;
