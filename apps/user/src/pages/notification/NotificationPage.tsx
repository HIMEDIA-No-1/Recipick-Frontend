import { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Clock, Users, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Notification {
    id: number;
    type: 'EXPIRATION' | 'SHARE_REQUEST' | 'SHARE_ACCEPTED';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: {
        ingredientId?: number;
        ingredientName?: string;
        refrigeratorId?: number;
        daysLeft?: number;
        shareRequestId?: number;
        requesterName?: string;
        refrigeratorName?: string;
    };
}

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore] = useState(true);

    // 커스텀 debounce 함수
    const debounce = useCallback((func: Function, delay: number) => {
        let timeoutId: number;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);

    const notificationTypes = [
        { key: 'ALL', label: '전체', icon: Bell },
        { key: 'EXPIRATION', label: '소비기한', icon: Clock },
        { key: 'SHARE_REQUEST', label: '공유 요청', icon: Users },
        { key: 'SHARE_ACCEPTED', label: '공유 승인', icon: Users }
    ];

    useEffect(() => {
        loadNotifications();
    }, [selectedType, currentPage]);

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            handleSearch();
        }, 300);

        debouncedSearch();

        // cleanup function
        return () => {
            // debounce cleanup은 자동으로 처리됨
        };
    }, [searchQuery, notifications, debounce]);

    const loadNotifications = () => {
        // Mock 데이터 로드
        const mockNotifications: Notification[] = [
            {
                id: 1,
                type: 'EXPIRATION',
                title: '소비기한 알림',
                message: '우유의 소비기한이 2일 남았습니다.',
                isRead: false,
                createdAt: '2024-01-15T10:30:00Z',
                data: {
                    ingredientId: 1,
                    ingredientName: '우유',
                    refrigeratorId: 1,
                    daysLeft: 2
                }
            },
            {
                id: 2,
                type: 'SHARE_REQUEST',
                title: '냉장고 공유 요청',
                message: '홍길동님이 우리집 냉장고 공유를 요청했습니다.',
                isRead: true,
                createdAt: '2024-01-14T15:20:00Z',
                data: {
                    shareRequestId: 1,
                    requesterName: '홍길동',
                    refrigeratorName: '우리집 냉장고'
                }
            },
            {
                id: 3,
                type: 'EXPIRATION',
                title: '소비기한 알림',
                message: '계란의 소비기한이 오늘까지입니다.',
                isRead: false,
                createdAt: '2024-01-15T09:00:00Z',
                data: {
                    ingredientId: 2,
                    ingredientName: '계란',
                    refrigeratorId: 1,
                    daysLeft: 0
                }
            },
            {
                id: 4,
                type: 'SHARE_ACCEPTED',
                title: '냉장고 공유 승인',
                message: '김철수님이 공유 냉장고 요청을 수락했습니다.',
                isRead: true,
                createdAt: '2024-01-13T14:10:00Z',
                data: {
                    requesterName: '김철수',
                    refrigeratorName: '공유 냉장고'
                }
            },
            {
                id: 5,
                type: 'EXPIRATION',
                title: '소비기한 알림',
                message: '토마토의 소비기한이 3일 남았습니다.',
                isRead: true,
                createdAt: '2024-01-12T11:45:00Z',
                data: {
                    ingredientId: 3,
                    ingredientName: '토마토',
                    refrigeratorId: 1,
                    daysLeft: 3
                }
            }
        ];

        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 500);
    };

    const handleSearch = () => {
        let filtered = notifications;

        // 타입 필터링
        if (selectedType !== 'ALL') {
            filtered = filtered.filter(notification => notification.type === selectedType);
        }

        // 검색어 필터링
        if (searchQuery.trim()) {
            filtered = filtered.filter(notification =>
                notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredNotifications(filtered);
    };

    const handleBack = () => {
        console.log('Go back to previous page');
    };

    const markAsRead = (notificationId: number) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // 알림 타입에 따른 액션
        switch (notification.type) {
            case 'EXPIRATION':
                console.log('Navigate to ingredient:', notification.data?.ingredientId);
                break;
            case 'SHARE_REQUEST':
                console.log('Navigate to share request:', notification.data?.shareRequestId);
                break;
            case 'SHARE_ACCEPTED':
                console.log('Navigate to shared refrigerator');
                break;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'EXPIRATION':
                return <Clock className="w-5 h-5 text-orange-500" />;
            case 'SHARE_REQUEST':
                return <Users className="w-5 h-5 text-blue-500" />;
            case 'SHARE_ACCEPTED':
                return <Users className="w-5 h-5 text-green-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationColor = (type: string, isRead: boolean) => {
        if (isRead) return 'bg-white border-gray-200';

        switch (type) {
            case 'EXPIRATION':
                return 'bg-orange-50 border-orange-200';
            case 'SHARE_REQUEST':
                return 'bg-blue-50 border-blue-200';
            case 'SHARE_ACCEPTED':
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `${diffMinutes}분 전`;
            }
            return `${diffHours}시간 전`;
        } else if (diffDays === 1) {
            return '어제';
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            return date.toLocaleDateString('ko-KR');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">알림을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            뒤로
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">알림</h1>
                        <div className="w-20" /> {/* 스페이서 */}
                    </div>

                    {/* 검색바 */}
                    <div className="relative mb-4">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="알림 내용을 검색하세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* 카테고리 필터 */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {notificationTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                                <button
                                    key={type.key}
                                    onClick={() => setSelectedType(type.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                                        selectedType === type.key
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* 알림 목록 */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${getNotificationColor(
                                    notification.type,
                                    notification.isRead
                                )}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <h3 className={`text-sm font-semibold ${
                                                notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                            }`}>
                                                {notification.title}
                                            </h3>
                                            <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(notification.createdAt)}
                        </span>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                )}
                                            </div>
                                        </div>

                                        <p className={`text-sm mt-1 ${
                                            notification.isRead ? 'text-gray-600' : 'text-gray-800'
                                        }`}>
                                            {notification.message}
                                        </p>

                                        {/* 소비기한 알림의 경우 추가 정보 표시 */}
                                        {notification.type === 'EXPIRATION' && notification.data?.daysLeft !== undefined && (
                                            <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            notification.data.daysLeft === 0
                                ? 'bg-red-100 text-red-800'
                                : notification.data.daysLeft <= 1
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                            {notification.data.daysLeft === 0
                                ? '오늘까지'
                                : `${notification.data.daysLeft}일 남음`}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔔</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {searchQuery ? '검색 결과가 없어요' : '알림이 없어요'}
                        </h2>
                        <p className="text-gray-600">
                            {searchQuery ? '다른 키워드로 검색해보세요' : '새로운 알림이 있을 때 알려드릴게요'}
                        </p>
                    </div>
                )}

                {/* 더 보기 버튼 */}
                {hasMore && filteredNotifications.length > 0 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            더 보기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;