import React, { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Users, FileText, Trash2, TrendingUp, Star } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const {
    initializeData,
    getUserStats,
    getRecipeStats,
    getIngredientStats
  } = useAdminStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const userStats = getUserStats();
  const recipeStats = getRecipeStats();
  const ingredientStats = getIngredientStats();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
    trend?: number;
  }> = ({ title, value, description, icon, trend }) => {
    return (
      <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg text-[#6789A5]">
                {icon}
              </div>
              <h3 className="text-sm font-medium text-[#878787] dark:text-[#A0A0A0] uppercase tracking-wide">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">{value}</p>
            {description && (
              <p className="text-sm text-[#878787] dark:text-[#A0A0A0]">{description}</p>
            )}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center text-sm font-medium ${
              trend > 0
                ? 'text-green-600 dark:text-green-400'
                : trend < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-[#878787] dark:text-[#A0A0A0]'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  const BarChart: React.FC<{
    data: { label: string; value: number }[];
    title: string;
  }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.value));

    return (
      <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
        <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-28 text-sm text-[#4B4B4B] dark:text-[#E0E0E0] font-medium truncate">
                {item.label}
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-[#F0EEEB] dark:bg-[#242424] rounded-full h-3">
                  <div
                    className="bg-[#6789A5] h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm text-[#878787] dark:text-[#A0A0A0] text-right font-medium">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const dailySignupsData = Object.entries(userStats.dailySignups)
    .map(([date, count]) => ({
      label: new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      value: count
    }))
    .slice(-7); // 최근 7일

  const topRecipesData = recipeStats.favoriteStats
    .slice(0, 5)
    .map(recipe => ({
      label: recipe.title.length > 15 ? `${recipe.title.substring(0, 15)}...` : recipe.title,
      value: recipe.favoriteCount
    }));

  const categoryData = Object.entries(ingredientStats.categoryStats)
    .map(([category, count]) => ({
      label: category,
      value: count
    }));

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">대시보드</h1>
          <p className="text-[#878787] dark:text-[#A0A0A0]">서비스 현황을 한눈에 확인하세요</p>
        </div>
        <div className="text-sm text-[#878787] dark:text-[#A0A0A0] bg-[#E0EBF7] dark:bg-[#404040] px-4 py-2 rounded-lg">
          마지막 업데이트: {new Date().toLocaleString('ko-KR')}
        </div>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 사용자"
          value={userStats.totalUsers}
          description="전체 가입자 수"
          icon={<Users className="w-5 h-5" />}
          trend={12}
        />
        <StatCard
          title="활성 사용자"
          value={userStats.activeUsers}
          description="활성화된 사용자"
          icon={<TrendingUp className="w-5 h-5" />}
          trend={8}
        />
        <StatCard
          title="총 레시피"
          value={recipeStats.totalRecipes}
          description="등록된 레시피 수"
          icon={<FileText className="w-5 h-5" />}
          trend={15}
        />
        <StatCard
          title="식재료 폐기율"
          value={`${ingredientStats.disposalRate.toFixed(1)}%`}
          description={`${ingredientStats.disposedCount}/${ingredientStats.totalIngredients} 폐기`}
          icon={<Trash2 className="w-5 h-5" />}
          trend={-3}
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={dailySignupsData}
          title="최근 7일 신규 가입자"
        />
        <BarChart
          data={topRecipesData}
          title="인기 레시피 TOP 5 (찜 기준)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={categoryData}
          title="카테고리별 식재료 등록 현황"
        />

        {/* 사용자 활동 요약 */}
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg text-[#6789A5]">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">사용자 활동 요약</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg">
              <span className="text-[#4B4B4B] dark:text-[#E0E0E0] font-medium">활성 사용자 비율</span>
              <span className="font-bold text-[#6789A5] text-lg">
                {userStats.totalUsers > 0 ? ((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg">
              <span className="text-[#4B4B4B] dark:text-[#E0E0E0] font-medium">평균 레시피당 찜 수</span>
              <span className="font-bold text-[#6789A5] text-lg">
                {recipeStats.totalRecipes > 0
                  ? (recipeStats.favoriteStats.reduce((sum, recipe) => sum + recipe.favoriteCount, 0) / recipeStats.totalRecipes).toFixed(1)
                  : 0
                }
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg">
              <span className="text-[#4B4B4B] dark:text-[#E0E0E0] font-medium">총 식재료 등록 수</span>
              <span className="font-bold text-[#6789A5] text-lg">
                {ingredientStats.totalIngredients}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;