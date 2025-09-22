import { useState, useEffect } from 'react';
import { Bell, Clock, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil, type NotificationsData } from '../../utils/localStorage';

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notificationsData, setNotificationsData] = useState<NotificationsData>({ allNotifications: [] });
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        const data = StorageUtil.getNotificationsData();
        if (data) {
            setNotificationsData(data);
        }
        setLoading(false);
    };

    const handleMarkAsRead = (notificationId: string) => {
        const updatedData: NotificationsData = {
            allNotifications: notificationsData.allNotifications.map(notification =>
                notification.notificationId === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            ),
        };

        StorageUtil.saveNotificationsData(updatedData);
        setNotificationsData(updatedData);
    };

    const handleMarkAllAsRead = () => {
        const updatedData: NotificationsData = {
            allNotifications: notificationsData.allNotifications.map(notification => ({
                ...notification,
                isRead: true,
            })),
        };

        StorageUtil.saveNotificationsData(updatedData);
        setNotificationsData(updatedData);
    };

    const filteredNotifications = notificationsData.allNotifications.filter(notification => {
        if (selectedType === 'ALL') return true;
        return notification.type === selectedType;
    });

    const notificationTypes = [
        { id: 'ALL', label: '전체', icon: Bell },
        { id: 'MESSAGE', label: '메시지', icon: Clock },
        { id: 'INVITE_FRIDGE', label: '냉장고 초대', icon: Users },
    ];

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'INVITE_FRIDGE':
                return <Users className="w-5 h-5 text-blue-500" />;
            case 'MESSAGE':
            default:
                return <Bell className="w-5 h-5 text-green-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6789A5] mx-auto mb-4"></div>
                    <p className="text-[#878787]">알림을 불러오는 중...</p>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-2xl font-bold text-[#6789A5]">알림</h1>
                    </div>

                    {notificationsData.allNotifications.some(n => !n.isRead) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 text-sm text-[#6789A5] hover:bg-[#E0EBF7] rounded-lg transition-colors"
                        >
                            모두 읽음
                        </button>
                    )}
                </div>

                {/* 필터 탭 */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {notificationTypes.map((type) => {
                        const Icon = type.icon;
                        const count = type.id === 'ALL'
                            ? notificationsData.allNotifications.length
                            : notificationsData.allNotifications.filter(n => n.type === type.id).length;

                        return (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${
                                    selectedType === type.id
                                        ? 'bg-[#6789A5] text-white'
                                        : 'bg-white text-[#7A7E7B] hover:bg-[#F0EEEB]'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{type.label}</span>
                                {count > 0 && (
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        selectedType === type.id
                                            ? 'bg-white text-[#6789A5]'
                                            : 'bg-[#E0EBF7] text-[#6789A5]'
                                    }`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 알림 목록 */}
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.notificationId}
                                className={`bg-white rounded-2xl p-5 shadow-sm transition-all cursor-pointer hover:shadow-md ${
                                    !notification.isRead ? 'border-l-4 border-l-[#6789A5] bg-blue-50' : ''
                                }`}
                                onClick={() => handleMarkAsRead(notification.notificationId)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-[#4B4B4B]">
                                                {notification.type === 'INVITE_FRIDGE' ? '냉장고 초대' : '메시지'}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-[#6789A5] rounded-full"></span>
                                                )}
                                                <span className="text-xs text-[#878787]">
                                                    {new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-[#7A7E7B] text-sm leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔔</div>
                        <h2 className="text-xl font-semibold text-[#4B4B4B] mb-2">
                            {selectedType === 'ALL' ? '알림이 없습니다' : `${notificationTypes.find(t => t.id === selectedType)?.label} 알림이 없습니다`}
                        </h2>
                        <p className="text-[#7A7E7B]">새로운 알림이 오면 여기에 표시됩니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;