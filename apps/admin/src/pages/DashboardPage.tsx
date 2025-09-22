import React, { useState, useEffect } from 'react';
import { Users, FileText, TrendingUp, Activity, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import AdminHeader from '../layout/AdminHeader';
import AdminFooter from '../layout/AdminFooter';

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalRecipes: number;
    totalRefrigerators: number;
    systemStatus: 'healthy' | 'warning' | 'error';
    serverLoad: number;
    storageUsed: number;
}

interface RecentActivity {
    id: number;
    type: 'user_signup' | 'recipe_created' | 'error' | 'system';
    message: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
}

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        loadDashboardData();

        // 자동 새로고침 (30초마다)
        const interval = setInterval(() => {
            loadDashboardData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            // Mock 데이터 로드
            const mockStats: DashboardStats = {
                totalUsers: 1247,
                activeUsers: 892,
                newUsersToday: 23,
                totalRecipes: 15420,
                totalRefrigerators: 3456,
                systemStatus: 'healthy',
                serverLoad: 45,
                storageUsed: 67
            };

            const mockActivities: RecentActivity[] = [
                {
                    id: 1,
                    type: 'user_signup',
                    message: '새로운 사용자가 가입했습니다: user1234@email.com',
                    timestamp: '2024-01-15T14:30:00Z',
                    severity: 'info'
                },
                {
                    id: 2,
                    type: 'recipe_created',
                    message: '인기 레시피 "김치볶음밥"이 1000회 조회를 달성했습니다',
                    timestamp: '2024-01-15T14:15:00Z',
                    severity: 'info'
                },
                {
                    id: 3,
                    type: 'error',
                    message: 'API 응답 시간이 평균보다 높습니다 (2.3초)',
                    timestamp: '2024-01-15T13:45:00Z',
                    severity: 'warning'
                },
                {
                    id: 4,
                    type: 'system',
                    message: '데이터베이스 백업이 완료되었습니다',
                    timestamp: '2024-01-15T13:00:00Z',
                    severity: 'info'
                }
            ];

            await new Promise(resolve => setTimeout(resolve, 500));

            setStats(mockStats);
            setRecentActivities(mockActivities);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Dashboard data loading failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        loadDashboardData();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-600 bg-green-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy': return <CheckCircle className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'error': return <AlertTriangle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user_signup': return <Users className="w-4 h-4" />;
            case 'recipe_created': return <FileText className="w-4 h-4" />;
            case 'error': return <AlertTriangle className="w-4 h-4" />;
            case 'system': return <Activity className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getActivityColor = (severity: string) => {
        switch (severity) {
            case 'info': return 'text-blue-600 bg-blue-100';
            case 'warning': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes}분 전`;
        } else if (diffMinutes < 1440) {
            return `${Math.floor(diffMinutes / 60)}시간 전`;
        } else {
            return date.toLocaleDateString('ko-KR');
        }
    };

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <AdminHeader currentPage="dashboard" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">대시보드를 불러오는 중...</p>
                    </div>
                </div>
                <AdminFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminHeader currentPage="dashboard" />

            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 헤더 */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
                            <p className="text-gray-600 mt-1">시스템 상태와 주요 지표를 확인하세요</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <p className="text-sm text-gray-500">
                                마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
                            </p>
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                새로고침
                            </button>
                        </div>
                    </div>

                    {/* 통계 카드들 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">전체 사용자</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-green-600 text-sm font-medium">+{stats?.newUsersToday}</span>
                                <span className="text-gray-500 text-sm"> 오늘 신규</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.activeUsers.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                <span className="text-gray-500 text-sm">
                  활성률: {stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">총 레시피</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.totalRecipes.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <FileText className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-gray-500 text-sm">레시피 데이터베이스</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">총 냉장고</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.totalRefrigerators.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className="text-gray-500 text-sm">생성된 냉장고</span>
                            </div>
                        </div>
                    </div>

                    {/* 시스템 상태 및 최근 활동 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 시스템 상태 */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">시스템 상태</h3>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(stats?.systemStatus || 'healthy')}`}>
                                    {getStatusIcon(stats?.systemStatus || 'healthy')}
                                    {stats?.systemStatus === 'healthy' ? '정상' : stats?.systemStatus === 'warning' ? '경고' : '오류'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">서버 부하</span>
                                        <span className="font-medium">{stats?.serverLoad}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${(stats?.serverLoad || 0) > 80 ? 'bg-red-500' : (stats?.serverLoad || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            style={{ width: `${stats?.serverLoad}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">저장공간 사용률</span>
                                        <span className="font-medium">{stats?.storageUsed}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${(stats?.storageUsed || 0) > 80 ? 'bg-red-500' : (stats?.storageUsed || 0) > 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                            style={{ width: `${stats?.storageUsed}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-600">
                                        시스템이 안정적으로 운영되고 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 최근 활동 */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">최근 활동</h3>

                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${getActivityColor(activity.severity)}`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                                    모든 활동 보기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AdminFooter />
        </div>
    );
};

export default DashboardPage;