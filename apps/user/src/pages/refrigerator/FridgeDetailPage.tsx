import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Settings, StickyNote, Thermometer, Snowflake, Home } from 'lucide-react';

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

// 보관칸 타입 인터페이스
interface Compartment {
    id: number;
    name: string;
    type: 'FROZEN' | 'REFRIGERATED' | 'ROOM_TEMP';
    ingredientCount: number;
    createdAt: string;
}

// 냉장고 상세 정보 인터페이스
interface FridgeDetail {
    id: number;
    name: string;
    isDefault: boolean;
    isFavorite: boolean;
    ownerId: number;
    memberCount: number;
    ingredientCount: number;
    memo: string;
    compartments: Compartment[];
}

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

const FridgeDetailPage = () => {
    const [fridge, setFridge] = useState<FridgeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMemoModal, setShowMemoModal] = useState(false);
    const [showAddCompartmentModal, setShowAddCompartmentModal] = useState(false);
    const [memoText, setMemoText] = useState('');
    const [newCompartmentName, setNewCompartmentName] = useState('');
    const [newCompartmentType, setNewCompartmentType] = useState<'FROZEN' | 'REFRIGERATED' | 'ROOM_TEMP'>('REFRIGERATED');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // 보관칸 타입 정보 (아이콘 색상 포함)
    const compartmentTypes = [
        { key: 'FROZEN' as const, label: '냉동', icon: Snowflake, color: 'bg-[#6789A5]' },
        { key: 'REFRIGERATED' as const, label: '냉장', icon: Thermometer, color: 'bg-green-500' },
        { key: 'ROOM_TEMP' as const, label: '실온', icon: Home, color: 'bg-yellow-500' }
    ];

    useEffect(() => {
        // 컴포넌트 마운트 시 Tailwind CSS 및 폰트 스크립트 삽입
        const script = document.createElement('div');
        script.innerHTML = TW_SCRIPT;
        document.head.appendChild(script);

        loadFridgeDetail();

        return () => {
            // 컴포넌트 언마운트 시 스크립트 제거
            document.head.removeChild(script);
        };
    }, []);

    const loadFridgeDetail = () => {
        // Mock 데이터 로드
        const mockFridge: FridgeDetail = {
            id: 1,
            name: '우리집 냉장고',
            isDefault: true,
            isFavorite: true,
            ownerId: 1,
            memberCount: 2,
            ingredientCount: 15,
            memo: '우유 떨어지면 구매하기\n계란 유통기한 체크',
            compartments: [
                {
                    id: 1,
                    name: '야채칸',
                    type: 'REFRIGERATED',
                    ingredientCount: 8,
                    createdAt: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    name: '냉동실',
                    type: 'FROZEN',
                    ingredientCount: 5,
                    createdAt: '2024-01-15T10:35:00Z'
                },
                {
                    id: 3,
                    name: '상온 보관함',
                    type: 'ROOM_TEMP',
                    ingredientCount: 2,
                    createdAt: '2024-01-15T10:40:00Z'
                }
            ]
        };

        setTimeout(() => {
            setFridge(mockFridge);
            setMemoText(mockFridge.memo);
            setLoading(false);
        }, 500);
    };

    const handleBack = () => {
        console.log('냉장고 목록으로 돌아가기');
    };

    const handleCompartmentClick = (compartmentId: number) => {
        console.log('보관칸 상세 보기:', compartmentId);
    };

    const handleMemoSave = () => {
        if (fridge) {
            setFridge({ ...fridge, memo: memoText });
            setShowMemoModal(false);
        }
    };

    const handleAddCompartment = () => {
        if (!newCompartmentName.trim()) {
            setAlertMessage('보관칸 이름을 입력해주세요');
            setShowAlert(true);
            return;
        }

        if (fridge) {
            const newCompartment: Compartment = {
                id: Date.now(),
                name: newCompartmentName,
                type: newCompartmentType,
                ingredientCount: 0,
                createdAt: new Date().toISOString()
            };

            setFridge({
                ...fridge,
                compartments: [...fridge.compartments, newCompartment]
            });

            setNewCompartmentName('');
            setNewCompartmentType('REFRIGERATED');
            setShowAddCompartmentModal(false);
        }
    };

    const handleShareFridge = () => {
        console.log('냉장고 공유 페이지로 이동');
    };

    const handleFridgeSettings = () => {
        console.log('냉장고 설정 페이지로 이동');
    };

    const getCompartmentIcon = (type: string) => {
        const typeInfo = compartmentTypes.find(t => t.key === type);
        const IconComponent = typeInfo?.icon || Thermometer;
        return <IconComponent className="w-5 h-5" />;
    };

    const getCompartmentColor = (type: string) => {
        const typeInfo = compartmentTypes.find(t => t.key === type);
        return typeInfo?.color || 'bg-[#7A7E7B]';
    };

    const getTypeLabel = (type: string) => {
        const typeInfo = compartmentTypes.find(t => t.key === type);
        return typeInfo?.label || type;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6789A5] mx-auto mb-4"></div>
                    <p className="text-[#878787]">냉장고 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!fridge) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-xl font-semibold text-[#4B4B4B] mb-2">냉장고를 찾을 수 없어요</h2>
                    <button
                        onClick={handleBack}
                        className="text-[#6789A5] hover:text-[#52708E]"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            {/* 헤더 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-[#7A7E7B] hover:text-[#4B4B4B]"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            냉장고 목록
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleShareFridge}
                                className="p-2 text-[#7A7E7B] hover:text-[#4B4B4B] hover:bg-[#E0EBF7] rounded-full transition-colors"
                            >
                                <Users className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleFridgeSettings}
                                className="p-2 text-[#7A7E7B] hover:text-[#4B4B4B] hover:bg-[#E0EBF7] rounded-full transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 냉장고 정보 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {fridge.isDefault && (
                                <span className="px-3 py-1 bg-[#6789A5] text-white text-xs font-medium rounded-full">
                  기본
                </span>
                            )}
                            <h1 className="text-2xl font-bold text-[#4B4B4B]">{fridge.name}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-[#F0EEEB] rounded-lg">
                            <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.ingredientCount}</p>
                            <p className="text-sm text-[#7A7E7B]">총 식재료</p>
                        </div>
                        <div className="text-center p-4 bg-[#F0EEEB] rounded-lg">
                            <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.compartments.length}</p>
                            <p className="text-sm text-[#7A7E7B]">보관칸</p>
                        </div>
                        <div className="text-center p-4 bg-[#F0EEEB] rounded-lg">
                            <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.memberCount}</p>
                            <p className="text-sm text-[#7A7E7B]">멤버</p>
                        </div>
                    </div>

                    {/* 메모 */}
                    {fridge.memo && (
                        <div
                            onClick={() => setShowMemoModal(true)}
                            className="p-4 bg-[#FEF9E7] rounded-lg cursor-pointer hover:bg-[#FCEFCA] transition-colors"
                        >
                            <div className="flex items-start gap-2">
                                <StickyNote className="w-5 h-5 text-[#A0522D] flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-[#4B4B4B] whitespace-pre-line">{fridge.memo}</p>
                                    <p className="text-xs text-[#A0522D] mt-2">클릭하여 수정</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!fridge.memo && (
                        <button
                            onClick={() => setShowMemoModal(true)}
                            className="w-full p-4 border-2 border-dashed border-[#D1D1D1] rounded-lg text-[#7A7E7B] hover:border-[#FCEFCA] hover:bg-[#FEF9E7] hover:text-[#A0522D] transition-colors"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <StickyNote className="w-5 h-5" />
                                <span>메모 추가하기</span>
                            </div>
                        </button>
                    )}
                </div>

                {/* 보관칸 추가 버튼 */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowAddCompartmentModal(true)}
                        className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-[#D1D1D1] hover:border-[#6789A5] hover:bg-[#E0EBF7] text-[#7A7E7B] hover:text-[#6789A5] rounded-2xl transition-colors"
                    >
                        <div className="p-2 bg-[#E0EBF7] rounded-full">
                            <Plus className="w-5 h-5 text-[#6789A5]" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">새 보관칸 추가</p>
                            <p className="text-sm text-[#7A7E7B]">냉동, 냉장, 실온 보관칸을 추가하세요</p>
                        </div>
                    </button>
                </div>

                {/* 보관칸 목록 */}
                {fridge.compartments.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {fridge.compartments.map((compartment) => (
                            <div
                                key={compartment.id}
                                onClick={() => handleCompartmentClick(compartment.id)}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 ${getCompartmentColor(compartment.type)} rounded-lg text-white`}>
                                            {getCompartmentIcon(compartment.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#4B4B4B]">{compartment.name}</h3>
                                            <p className="text-sm text-[#7A7E7B]">{getTypeLabel(compartment.type)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center p-4 bg-[#F0EEEB] rounded-lg mb-3">
                                    <p className="text-2xl font-bold text-[#4B4B4B]">{compartment.ingredientCount}</p>
                                    <p className="text-sm text-[#7A7E7B]">식재료</p>
                                </div>

                                <p className="text-xs text-[#878787] text-center">
                                    {new Date(compartment.createdAt).toLocaleDateString('ko-KR')} 생성
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-xl font-semibold text-[#4B4B4B] mb-2">보관칸이 없어요</h2>
                        <p className="text-[#7A7E7B]">첫 번째 보관칸을 추가해보세요!</p>
                    </div>
                )}
            </div>

            {/* 메모 편집 모달 */}
            {showMemoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">냉장고 메모</h3>

                        <div className="mb-6">
              <textarea
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  placeholder="냉장고 관련 메모를 작성하세요&#10;예: 우유 떨어지면 구매하기"
                  className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent resize-none"
                  rows={5}
                  maxLength={1000}
              />
                            <p className="text-xs text-[#878787] mt-1">{memoText.length}/1000자</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMemoModal(false)}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleMemoSave}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 보관칸 추가 모달 */}
            {showAddCompartmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">새 보관칸 추가</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                보관칸 이름
                            </label>
                            <input
                                type="text"
                                value={newCompartmentName}
                                onChange={(e) => setNewCompartmentName(e.target.value)}
                                placeholder="예: 야채칸, 냉동실, 상온 보관함"
                                className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                maxLength={20}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#7A7E7B] mb-3">
                                보관 타입
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {compartmentTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <button
                                            key={type.key}
                                            onClick={() => setNewCompartmentType(type.key)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                                newCompartmentType === type.key
                                                    ? 'border-[#6789A5] bg-[#E0EBF7]'
                                                    : 'border-[#D1D1D1] hover:border-[#BDBDBD] hover:bg-[#F0EEEB]'
                                            }`}
                                        >
                                            <div className={`p-2 ${type.color} rounded-lg text-white`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium text-[#7A7E7B]">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddCompartmentModal(false)}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddCompartment}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors"
                            >
                                추가
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

export default FridgeDetailPage;
