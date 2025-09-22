import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, Settings, StickyNote, Thermometer, Snowflake, Home, Calendar, Hash, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { StorageUtil, type Fridge, type Compartment, type Ingredient } from '../../utils/localStorage';


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
    const navigate = useNavigate();
    const { fridgeId } = useParams<{ fridgeId: string }>();
    const [fridge, setFridge] = useState<Fridge | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMemoModal, setShowMemoModal] = useState(false);
    const [showAddCompartmentModal, setShowAddCompartmentModal] = useState(false);
    const [memoText, setMemoText] = useState('');
    const [newCompartmentName, setNewCompartmentName] = useState('');
    const [newCompartmentType, setNewCompartmentType] = useState<'COOL' | 'FREEZE' | 'PANTRY'>('COOL');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [selectedCompartmentId, setSelectedCompartmentId] = useState<string>('');
    const [ingredientForm, setIngredientForm] = useState({
        name: '',
        quantity: 1,
        expirationDate: '',
        memo: '',
        category: '채소'
    });

    // 보관칸 타입 정보 (아이콘 색상 포함)
    const compartmentTypes = [
        { key: 'FREEZE' as const, label: '냉동', icon: Snowflake, color: 'bg-[#6789A5]' },
        { key: 'COOL' as const, label: '냉장', icon: Thermometer, color: 'bg-green-500' },
        { key: 'PANTRY' as const, label: '실온', icon: Home, color: 'bg-yellow-500' }
    ];

    useEffect(() => {
        loadFridgeDetail();
    }, [fridgeId]);

    const loadFridgeDetail = () => {
        if (!fridgeId) {
            navigate('/fridges');
            return;
        }

        const fridgesData = StorageUtil.getFridgesData();
        if (!fridgesData) {
            navigate('/fridges');
            return;
        }

        const targetFridge = fridgesData.allFridges.find(f => f.fridgeId === fridgeId);
        if (!targetFridge) {
            navigate('/fridges');
            return;
        }

        setFridge(targetFridge);
        setMemoText(targetFridge.memo);
        setLoading(false);
    };

    const handleBack = () => {
        navigate('/fridges');
    };

    const handleCompartmentClick = (compartmentId: string) => {
        setSelectedCompartmentId(compartmentId);
        setShowIngredientModal(true);
    };

    const handleMemoSave = () => {
        if (!fridge) return;

        // 공유된 냉장고 업데이트 (모든 멤버에게 동기화)
        const success = StorageUtil.updateSharedFridge(fridge.fridgeId, { memo: memoText });

        if (success) {
            // 상태 업데이트
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

        if (!fridge) return;

        const newCompartment: Compartment = {
            compartmentId: `${fridge.fridgeId}-${Date.now()}`,
            name: newCompartmentName,
            type: newCompartmentType
        };

        // 공유된 냉장고 업데이트 (모든 멤버에게 동기화)
        const success = StorageUtil.updateSharedFridge(fridge.fridgeId, {
            compartments: [...fridge.compartments, newCompartment]
        });

        if (success) {
            // 상태 업데이트
            setFridge({
                ...fridge,
                compartments: [...fridge.compartments, newCompartment]
            });

            setNewCompartmentName('');
            setNewCompartmentType('COOL');
            setShowAddCompartmentModal(false);
        }
    };

    const handleShareFridge = () => {
        if (fridge) {
            navigate(`/fridges/${fridge.fridgeId}/share`);
        }
    };

    const handleFridgeSettings = () => {
        console.log('냉장고 설정 페이지로 이동');
    };

    const handleIngredientFormChange = (field: string, value: any) => {
        setIngredientForm(prev => ({ ...prev, [field]: value }));
    };

    const handleAddIngredient = () => {
        if (!ingredientForm.name.trim()) {
            setAlertMessage('식재료 이름을 입력해주세요');
            setShowAlert(true);
            return;
        }

        if (!ingredientForm.expirationDate) {
            setAlertMessage('유통기한을 선택해주세요');
            setShowAlert(true);
            return;
        }

        const ingredientsData = StorageUtil.getIngredientsData() || { allIngredients: [] };

        const newIngredient: Ingredient = {
            ingredientId: `ingredient-${Date.now()}`,
            compartmentId: selectedCompartmentId,
            name: ingredientForm.name,
            quantity: ingredientForm.quantity,
            expirationDate: ingredientForm.expirationDate,
            state: 'FRESH',
            memo: ingredientForm.memo,
            category: ingredientForm.category,
            createdAt: new Date().toISOString()
        };

        const updatedIngredientsData = {
            allIngredients: [...ingredientsData.allIngredients, newIngredient]
        };

        StorageUtil.saveIngredientsData(updatedIngredientsData);

        // 폼 초기화
        setIngredientForm({
            name: '',
            quantity: 1,
            expirationDate: '',
            memo: '',
            category: '채소'
        });

        setShowIngredientModal(false);
        setAlertMessage('식재료가 추가되었습니다');
        setShowAlert(true);
    };

    const getCompartmentName = (compartmentId: string) => {
        return fridge?.compartments.find(c => c.compartmentId === compartmentId)?.name || '보관칸';
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

    const getIngredientCount = (compartmentId: string) => {
        const ingredientsData = StorageUtil.getIngredientsData();
        if (!ingredientsData) return 0;

        return ingredientsData.allIngredients.filter(
            ingredient => ingredient.compartmentId === compartmentId &&
            ingredient.state !== 'CONSUMED' && ingredient.state !== 'DISPOSED'
        ).length;
    };

    const getTotalIngredientCount = () => {
        if (!fridge) return 0;

        return fridge.compartments.reduce((total, compartment) => {
            return total + getIngredientCount(compartment.compartmentId);
        }, 0);
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
                            <p className="text-2xl font-bold text-[#4B4B4B]">{getTotalIngredientCount()}</p>
                            <p className="text-sm text-[#7A7E7B]">총 식재료</p>
                        </div>
                        <div className="text-center p-4 bg-[#F0EEEB] rounded-lg">
                            <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.compartments.length}</p>
                            <p className="text-sm text-[#7A7E7B]">보관칸</p>
                        </div>
                        <div className="text-center p-4 bg-[#F0EEEB] rounded-lg">
                            <p className="text-2xl font-bold text-[#4B4B4B]">{fridge.members.length}</p>
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
                                key={compartment.compartmentId}
                                onClick={() => handleCompartmentClick(compartment.compartmentId)}
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
                                    <p className="text-2xl font-bold text-[#4B4B4B]">{getIngredientCount(compartment.compartmentId)}</p>
                                    <p className="text-sm text-[#7A7E7B]">식재료</p>
                                </div>
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

            {/* 식재료 등록 모달 */}
            {showIngredientModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">
                            식재료 등록 - {getCompartmentName(selectedCompartmentId)}
                        </h3>

                        <div className="space-y-4 mb-6">
                            {/* 식재료 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                    식재료 이름
                                </label>
                                <input
                                    type="text"
                                    value={ingredientForm.name}
                                    onChange={(e) => handleIngredientFormChange('name', e.target.value)}
                                    placeholder="예: 양파, 계란, 우유"
                                    className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                    maxLength={50}
                                />
                            </div>

                            {/* 수량 */}
                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                    <Hash className="w-4 h-4 inline mr-1" />
                                    수량
                                </label>
                                <input
                                    type="number"
                                    value={ingredientForm.quantity}
                                    onChange={(e) => handleIngredientFormChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                />
                            </div>

                            {/* 유통기한 */}
                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    유통기한
                                </label>
                                <input
                                    type="date"
                                    value={ingredientForm.expirationDate}
                                    onChange={(e) => handleIngredientFormChange('expirationDate', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                />
                            </div>

                            {/* 카테고리 */}
                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                    카테고리
                                </label>
                                <select
                                    value={ingredientForm.category}
                                    onChange={(e) => handleIngredientFormChange('category', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                >
                                    <option value="채소">채소</option>
                                    <option value="과일">과일</option>
                                    <option value="육류">육류</option>
                                    <option value="해산물">해산물</option>
                                    <option value="유제품">유제품</option>
                                    <option value="곡류">곡류</option>
                                    <option value="조미료">조미료</option>
                                    <option value="음료">음료</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>

                            {/* 메모 */}
                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                    <FileText className="w-4 h-4 inline mr-1" />
                                    메모 (선택사항)
                                </label>
                                <textarea
                                    value={ingredientForm.memo}
                                    onChange={(e) => handleIngredientFormChange('memo', e.target.value)}
                                    placeholder="예: 유기농, 반값 할인으로 구매"
                                    className="w-full px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent resize-none"
                                    rows={3}
                                    maxLength={200}
                                />
                                <p className="text-xs text-[#878787] mt-1">{ingredientForm.memo.length}/200자</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowIngredientModal(false);
                                    setIngredientForm({
                                        name: '',
                                        quantity: 1,
                                        expirationDate: '',
                                        memo: '',
                                        category: '채소'
                                    });
                                }}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddIngredient}
                                disabled={!ingredientForm.name.trim() || !ingredientForm.expirationDate}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors disabled:bg-[#D1D1D1] disabled:cursor-not-allowed"
                            >
                                등록
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
