'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, AlertTriangle, Clock, Sun, Moon } from 'lucide-react';

interface Ingredient {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    expirationDate: string;
    status: 'FRESH' | 'NEAR_EXPIRY' | 'EXPIRED';
    memo: string;
    createdAt: string;
}

interface CompartmentDetail {
    id: number;
    name: string;
    type: 'FROZEN' | 'REFRIGERATED' | 'ROOM_TEMP';
    fridgeName: string;
    ingredients: Ingredient[];
}

const CompartmentDetailPage = () => {
    const [compartment, setCompartment] = useState<CompartmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [newIngredient, setNewIngredient] = useState({
        name: '',
        category: '채소류',
        quantity: 1,
        unit: '개',
        expirationDate: '',
        memo: ''
    });
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const statusFilters = [
        { key: 'ALL', label: '전체', color: 'text-gray-600' },
        { key: 'FRESH', label: '신선', color: 'text-green-600' },
        { key: 'NEAR_EXPIRY', label: '임박', color: 'text-yellow-600' },
        { key: 'EXPIRED', label: '만료', color: 'text-red-600' }
    ];

    const categories = ['채소류', '육류', '유제품', '과일류', '곡물류', '양념류', '기타'];
    const units = ['개', 'kg', 'g', 'L', 'mL', '팩', '묶음'];

    useEffect(() => {
        loadCompartmentDetail();
        if (document.body.classList.contains('dark')) {
            setIsDarkMode(true);
        }
    }, []);

    const loadCompartmentDetail = () => {
        // Mock 데이터 로드
        const mockCompartment: CompartmentDetail = {
            id: 1,
            name: '야채칸',
            type: 'REFRIGERATED',
            fridgeName: '우리집 냉장고',
            ingredients: [
                {
                    id: 1,
                    name: '양파',
                    category: '채소류',
                    quantity: 2,
                    unit: '개',
                    expirationDate: '2024-01-20',
                    status: 'FRESH',
                    memo: '볶음용',
                    createdAt: '2024-01-15T10:30:00Z'
                },
                {
                    id: 2,
                    name: '우유',
                    category: '유제품',
                    quantity: 1,
                    unit: 'L',
                    expirationDate: '2024-01-17',
                    status: 'NEAR_EXPIRY',
                    memo: '1L 저지방',
                    createdAt: '2024-01-14T15:20:00Z'
                },
                {
                    id: 3,
                    name: '계란',
                    category: '기타',
                    quantity: 8,
                    unit: '개',
                    expirationDate: '2024-01-16',
                    status: 'EXPIRED',
                    memo: '',
                    createdAt: '2024-01-10T09:00:00Z'
                },
                {
                    id: 4,
                    name: '당근',
                    category: '채소류',
                    quantity: 3,
                    unit: '개',
                    expirationDate: '2024-01-25',
                    status: 'FRESH',
                    memo: '',
                    createdAt: '2024-01-12T14:30:00Z'
                }
            ]
        };

        setTimeout(() => {
            setCompartment(mockCompartment);
            setLoading(false);
        }, 500);
    };

    const handleBack = () => {
        console.log('Go back to fridge detail');
    };

    const handleIngredientClick = (ingredientId: number) => {
        console.log('Show ingredient detail/edit modal:', ingredientId);
    };

    const handleAddIngredient = () => {
        if (!newIngredient.name.trim()) {
            alert('식재료 이름을 입력해주세요');
            return;
        }

        if (!newIngredient.expirationDate) {
            alert('소비기한을 입력해주세요');
            return;
        }

        const ingredient: Ingredient = {
            id: Date.now(),
            name: newIngredient.name,
            category: newIngredient.category,
            quantity: newIngredient.quantity,
            unit: newIngredient.unit,
            expirationDate: newIngredient.expirationDate,
            status: getStatusByDate(newIngredient.expirationDate),
            memo: newIngredient.memo,
            createdAt: new Date().toISOString()
        };

        if (compartment) {
            setCompartment({
                ...compartment,
                ingredients: [...compartment.ingredients, ingredient]
            });
        }

        setNewIngredient({
            name: '',
            category: '채소류',
            quantity: 1,
            unit: '개',
            expirationDate: '',
            memo: ''
        });
        setShowAddIngredientModal(false);
    };

    const getStatusByDate = (expirationDate: string): 'FRESH' | 'NEAR_EXPIRY' | 'EXPIRED' => {
        const today = new Date();
        const expiry = new Date(expirationDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'EXPIRED';
        if (diffDays <= 3) return 'NEAR_EXPIRY';
        return 'FRESH';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'FRESH': return 'bg-[#CCE0D7] text-[#3A7558] border-[#9ED6B6] dark:bg-[#2C4A3C] dark:text-[#8ED6A2] dark:border-[#5C7A6C]';
            case 'NEAR_EXPIRY': return 'bg-[#F7E1B3] text-[#A67C00] border-[#E8C581] dark:bg-[#5E4C24] dark:text-[#E8C581] dark:border-[#8E7E52]';
            case 'EXPIRED': return 'bg-[#F7C6C6] text-[#A62626] border-[#E89E9E] dark:bg-[#5E3030] dark:text-[#E89E9E] dark:border-[#8E5E5E]';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'NEAR_EXPIRY':
            case 'EXPIRED':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getDaysLeft = (expirationDate: string) => {
        const today = new Date();
        const expiry = new Date(expirationDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)}일 지남`;
        if (diffDays === 0) return '오늘까지';
        return `${diffDays}일 남음`;
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'FROZEN': return '냉동';
            case 'REFRIGERATED': return '냉장';
            case 'ROOM_TEMP': return '실온';
            default: return type;
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark', !isDarkMode);
    };


    const filteredIngredients = compartment?.ingredients.filter(ingredient =>
        filterStatus === 'ALL' || ingredient.status === filterStatus
    ) || [];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6789A5] mx-auto mb-4"></div>
                    <p className="text-[#878787] dark:text-[#A0A0A0]">식재료를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!compartment) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 text-[#4B4B4B] dark:text-[#E0E0E0]">😔</div>
                    <h2 className="text-xl font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">보관칸을 찾을 수 없어요</h2>
                    <button
                        onClick={handleBack}
                        className="text-[#6789A5] dark:text-[#8cb5e2] hover:text-[#5A7E9D] dark:hover:text-[#6a92b9]"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424]">
            {isDarkMode && (
                <style>{`
          .dark .text-[#4B4B4B] { color: #E0E0E0; }
          .dark .text-[#878787] { color: #A0A0A0; }
          .dark .bg-[#FAF7F2] { background-color: #242424; }
          .dark .border-[#D1D1D1] { border-color: #404040; }
          .dark .bg-white { background-color: #333; }
          .dark .shadow-sm { box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.05); }
          .dark .hover\\:bg-\\[\\#E0EBF7\\]:hover { background-color: #404040; }
          .dark .hover\\:text-\\[\\#6789A5\\]:hover { color: #8cb5e2; }
          .dark .bg-\\[\\#E0EBF7\\] { background-color: #404040; }
        `}</style>
            )}

            {/* Dark Mode Toggle for demonstration */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-[#E0EBF7] dark:bg-[#333] transition-colors focus:outline-none z-50"
                title={isDarkMode ? "라이트 모드" : "다크 모드"}
            >
                {isDarkMode ? <Sun className="text-[#878787] dark:text-[#A0A0A0]" /> : <Moon className="text-[#878787]" />}
            </button>

            {/* 헤더 */}
            <header className="bg-white dark:bg-[#333] shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-[#878787] dark:text-[#A0A0A0] hover:text-[#6789A5] dark:hover:text-[#8cb5e2]"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            {compartment.fridgeName}
                        </button>
                    </div>

                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0]">{compartment.name}</h1>
                        <p className="text-[#878787] dark:text-[#A0A0A0]">{getTypeLabel(compartment.type)} 보관칸</p>
                    </div>

                    {/* 상태 필터 */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setFilterStatus(filter.key)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                    filterStatus === filter.key
                                        ? 'bg-[#6789A5] text-white'
                                        : 'bg-[#E0EBF7] text-[#4B4B4B] dark:bg-[#404040] dark:text-[#E0E0E0] hover:bg-[#D4E0F0] dark:hover:bg-[#505050]'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 식재료 추가 버튼 */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowAddIngredientModal(true)}
                        className="flex items-center gap-3 w-full p-4 border-2 border-dashed border-[#D1D1D1] dark:border-[#404040] hover:border-[#6789A5] dark:hover:border-[#8cb5e2] hover:bg-[#E0EBF7] dark:hover:bg-[#404040] text-[#4B4B4B] dark:text-[#E0E0E0] rounded-2xl transition-colors"
                    >
                        <div className="p-2 bg-[#F0EEEB] dark:bg-[#2C2C2C] rounded-full">
                            <Plus className="w-5 h-5 text-[#6789A5] dark:text-[#8cb5e2]" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">식재료 추가</p>
                            <p className="text-sm text-[#878787] dark:text-[#A0A0A0]">새로운 식재료를 등록하세요</p>
                        </div>
                    </button>
                </div>

                {/* 식재료 목록 */}
                {filteredIngredients.length > 0 ? (
                    <div className="space-y-3">
                        {filteredIngredients.map((ingredient) => (
                            <div
                                key={ingredient.id}
                                onClick={() => handleIngredientClick(ingredient.id)}
                                className="bg-white dark:bg-[#333] rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">{ingredient.name}</h3>
                                        <span className="text-sm text-[#878787] dark:text-[#A0A0A0]">({ingredient.category})</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ingredient.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(ingredient.status)}
                          {ingredient.status === 'FRESH' ? '신선' :
                              ingredient.status === 'NEAR_EXPIRY' ? '임박' : '만료'}
                      </div>
                    </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="flex items-center gap-2 text-[#878787] dark:text-[#A0A0A0]">
                                        <span className="font-medium">수량:</span>
                                        <span>{ingredient.quantity}{ingredient.unit}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#878787] dark:text-[#A0A0A0]">
                                        <Clock className="w-4 h-4" />
                                        <span>{getDaysLeft(ingredient.expirationDate)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-[#878787] dark:text-[#A0A0A0]">
                                    <span>소비기한: {new Date(ingredient.expirationDate).toLocaleDateString('ko-KR')}</span>
                                    <span>{new Date(ingredient.createdAt).toLocaleDateString('ko-KR')} 추가</span>
                                </div>

                                {ingredient.memo && (
                                    <div className="mt-3 p-2 bg-[#F0EEEB] dark:bg-[#2C2C2C] rounded-lg">
                                        <p className="text-sm text-[#4B4B4B] dark:text-[#E0E0E0]">📝 {ingredient.memo}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4 text-[#4B4B4B] dark:text-[#E0E0E0]">🥬</div>
                        <h2 className="text-xl font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
                            {filterStatus === 'ALL' ? '식재료가 없어요' : `${statusFilters.find(f => f.key === filterStatus)?.label} 식재료가 없어요`}
                        </h2>
                        <p className="text-[#878787] dark:text-[#A0A0A0]">
                            {filterStatus === 'ALL' ? '첫 번째 식재료를 추가해보세요!' : '다른 상태를 확인해보세요'}
                        </p>
                    </div>
                )}
            </div>

            {/* 식재료 추가 모달 */}
            {showAddIngredientModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#333] rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] mb-4">식재료 추가</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">식재료 이름</label>
                                <input
                                    type="text"
                                    value={newIngredient.name}
                                    onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                                    placeholder="예: 양파, 우유, 계란"
                                    className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2] bg-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">카테고리</label>
                                <select
                                    value={newIngredient.category}
                                    onChange={(e) => setNewIngredient({...newIngredient, category: e.target.value})}
                                    className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2] bg-white dark:bg-[#333] text-[#4B4B4B] dark:text-[#E0E0E0]"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">수량</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={newIngredient.quantity}
                                        onChange={(e) => setNewIngredient({...newIngredient, quantity: parseInt(e.target.value) || 1})}
                                        className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2] bg-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">단위</label>
                                    <select
                                        value={newIngredient.unit}
                                        onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                                        className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2] bg-white dark:bg-[#333] text-[#4B4B4B] dark:text-[#E0E0E0]"
                                    >
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">소비기한</label>
                                <input
                                    type="date"
                                    value={newIngredient.expirationDate}
                                    onChange={(e) => setNewIngredient({...newIngredient, expirationDate: e.target.value})}
                                    className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2] bg-transparent"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">메모 (선택사항)</label>
                                <input
                                    type="text"
                                    value={newIngredient.memo}
                                    onChange={(e) => setNewIngredient({...newIngredient, memo: e.target.value})}
                                    placeholder="예: 볶음용, 1L 저지방"
                                    className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:focus:ring-[#8cb5e2] bg-transparent"
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddIngredientModal(false)}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] text-[#4B4B4B] dark:text-[#E0E0E0] rounded-lg hover:bg-[#E0EBF7] dark:hover:bg-[#404040] transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleAddIngredient}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#5A7E9D] text-white rounded-lg transition-colors"
                            >
                                추가
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompartmentDetailPage;
