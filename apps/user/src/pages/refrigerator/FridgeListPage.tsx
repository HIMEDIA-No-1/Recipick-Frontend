import { useState, useEffect } from 'react';
import { Plus, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil, type FridgesData, type Fridge } from '../../utils/localStorage';

const FridgeListPage = () => {
    const navigate = useNavigate();
    const [fridgesData, setFridgesData] = useState<FridgesData>({ allFridges: [], defaultFridgeId: '' });
    const [loading, setLoading] = useState(true);
    const [showNewFridgeModal, setShowNewFridgeModal] = useState(false);
    const [newFridgeName, setNewFridgeName] = useState('');

    useEffect(() => {
        loadFridges();
    }, []);

    const loadFridges = () => {
        const data = StorageUtil.getFridgesData();
        if (data) {
            setFridgesData(data);
        }
        setLoading(false);
    };

    const handleCreateFridge = () => {
        if (!newFridgeName.trim()) {
            return;
        }

        const userState = StorageUtil.getUserState();
        if (!userState) return;

        const newFridgeId = `fridge-${Date.now()}`;
        const newFridge: Fridge = {
            fridgeId: newFridgeId,
            name: newFridgeName,
            isDefault: fridgesData.allFridges.length === 0,
            isFavorite: false,
            memo: '',
            members: [
                {
                    userId: userState.userId,
                    nickname: userState.nickname,
                    role: 'owner',
                },
            ],
            compartments: [
                {
                    compartmentId: `${newFridgeId}-cool`,
                    name: '냉장실',
                    type: 'COOL',
                },
                {
                    compartmentId: `${newFridgeId}-freeze`,
                    name: '냉동실',
                    type: 'FREEZE',
                },
                {
                    compartmentId: `${newFridgeId}-pantry`,
                    name: '실온보관',
                    type: 'PANTRY',
                },
            ],
        };

        const updatedData: FridgesData = {
            allFridges: [...fridgesData.allFridges, newFridge],
            defaultFridgeId: fridgesData.allFridges.length === 0 ? newFridgeId : fridgesData.defaultFridgeId,
        };

        StorageUtil.saveFridgesData(updatedData);
        setFridgesData(updatedData);
        setNewFridgeName('');
        setShowNewFridgeModal(false);
    };

    const handleFridgeClick = (fridgeId: string) => {
        navigate(`/fridges/${fridgeId}`);
    };

    const handleToggleFavorite = (fridgeId: string) => {
        const updatedData: FridgesData = {
            ...fridgesData,
            allFridges: fridgesData.allFridges.map(fridge =>
                fridge.fridgeId === fridgeId
                    ? { ...fridge, isFavorite: !fridge.isFavorite }
                    : fridge
            ),
        };

        StorageUtil.saveFridgesData(updatedData);
        setFridgesData(updatedData);
    };

    const handleSetDefault = (fridgeId: string) => {
        const updatedData: FridgesData = {
            allFridges: fridgesData.allFridges,
            defaultFridgeId: fridgeId,
        };

        StorageUtil.saveFridgesData(updatedData);
        setFridgesData(updatedData);
    };

    const sortedFridges = [...fridgesData.allFridges].sort((a, b) => {
        // 기본 냉장고가 최상단
        if (a.fridgeId === fridgesData.defaultFridgeId && b.fridgeId !== fridgesData.defaultFridgeId) return -1;
        if (a.fridgeId !== fridgesData.defaultFridgeId && b.fridgeId === fridgesData.defaultFridgeId) return 1;

        // 즐겨찾기가 그 다음
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;

        return 0;
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
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#6789A5]">냉장고 관리</h1>
                    <button
                        onClick={() => setShowNewFridgeModal(true)}
                        className="p-2 rounded-full hover:bg-[#E0EBF7] text-[#7A7E7B] hover:text-[#6789A5] transition-colors"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>

                {/* 냉장고 목록 */}
                {sortedFridges.length > 0 ? (
                    <div className="space-y-4">
                        {sortedFridges.map((fridge) => (
                            <div
                                key={fridge.fridgeId}
                                onClick={() => handleFridgeClick(fridge.fridgeId)}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {fridge.fridgeId === fridgesData.defaultFridgeId && (
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
                                                handleToggleFavorite(fridge.fridgeId);
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

                                        {fridge.members.length > 1 && (
                                            <div className="flex items-center gap-1 text-[#7A7E7B]">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">{fridge.members.length}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-3 bg-[#F0EEEB] rounded-lg">
                                        <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.compartments.length}</p>
                                        <p className="text-sm text-[#7A7E7B]">보관칸</p>
                                    </div>
                                    <div className="text-center p-3 bg-[#F0EEEB] rounded-lg">
                                        <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.members.length}</p>
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
                                    <span>소유자: {fridge.members.find(m => m.role === 'owner')?.nickname}</span>

                                    {fridge.fridgeId !== fridgesData.defaultFridgeId && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSetDefault(fridge.fridgeId);
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
        </div>
    );
};

export default FridgeListPage;