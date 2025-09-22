import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Trash2, ChefHat, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil, type UserStatistics } from '../../utils/localStorage';

const MyStatisticsPage = () => {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [statistics, setStatistics] = useState<UserStatistics>({
        ingredientStats: {
            weekly: { added: 0, consumed: 0, disposed: 0 },
            monthly: { added: 0, consumed: 0, disposed: 0 },
            yearly: { added: 0, consumed: 0, disposed: 0 },
        },
        mostUsedFridge: {
            fridgeId: '',
            name: '',
            count: 0,
        }
    });
    const [loading, setLoading] = useState(true);

    const periods = [
        { key: 'weekly' as const, label: '주간' },
        { key: 'monthly' as const, label: '월간' },
        { key: 'yearly' as const, label: '연간' }
    ];

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = () => {
        const data = StorageUtil.getUserStatistics();
        if (data) {
            setStatistics(data);
        }
        setLoading(false);
    };

    const getCurrentPeriodData = () => {
        return statistics.ingredientStats[selectedPeriod];
    };

    const calculateWasteRate = () => {
        const data = getCurrentPeriodData();
        const total = data.added;
        return total > 0 ? Math.round((data.disposed / total) * 100 * 10) / 10 : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6789A5] mx-auto mb-4"></div>
                    <p className="text-[#878787]">통계를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    const currentData = getCurrentPeriodData();
    const wasteRate = calculateWasteRate();

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-[#E0EBF7] rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#7A7E7B]" />
                        </button>
                        <h1 className="text-2xl font-bold text-[#6789A5]">나의 통계</h1>
                    </div>
                </div>

                {/* 기간 필터 */}
                <div className="flex gap-2 mb-6">
                    {periods.map((period) => (
                        <button
                            key={period.key}
                            onClick={() => setSelectedPeriod(period.key)}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                selectedPeriod === period.key
                                    ? 'bg-[#6789A5] text-white'
                                    : 'bg-white text-[#7A7E7B] hover:bg-[#F0EEEB]'
                            }`}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>

                {/* 요약 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-[#4B4B4B]">{currentData.added}</p>
                        <p className="text-sm text-[#7A7E7B]">추가한 식재료</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                            <ChefHat className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-[#4B4B4B]">{currentData.consumed}</p>
                        <p className="text-sm text-[#7A7E7B]">소비한 식재료</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full mx-auto mb-2">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-[#4B4B4B]">{currentData.disposed}</p>
                        <p className="text-sm text-[#7A7E7B]">폐기한 식재료</p>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mx-auto mb-2">
                            <TrendingDown className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold text-[#4B4B4B]">{wasteRate}%</p>
                        <p className="text-sm text-[#7A7E7B]">폐기율</p>
                    </div>
                </div>

                {/* 가장 많이 사용한 냉장고 */}
                {statistics.mostUsedFridge.name && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                        <h2 className="text-lg font-semibold text-[#4B4B4B] mb-4">가장 많이 사용한 냉장고</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[#4B4B4B]">{statistics.mostUsedFridge.name}</p>
                                <p className="text-sm text-[#7A7E7B]">{statistics.mostUsedFridge.count}번 사용</p>
                            </div>
                            <div className="flex items-center gap-1 text-[#6789A5]">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">자주 사용</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 도움말 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#4B4B4B] mb-4">통계 안내</h2>
                    <div className="space-y-3 text-sm text-[#7A7E7B]">
                        <p>• 통계는 명세서에 정의된 로컬 스토리지 데이터를 기반으로 표시됩니다.</p>
                        <p>• 폐기율이 낮을수록 식재료를 효율적으로 관리하고 있음을 의미합니다.</p>
                        <p>• 식재료를 추가, 소비, 폐기할 때마다 자동으로 통계가 업데이트됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyStatisticsPage;