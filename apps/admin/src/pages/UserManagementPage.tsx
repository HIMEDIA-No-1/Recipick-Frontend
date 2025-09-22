import React, { useState, useEffect } from 'react';
import { Search, Eye, Ban, UserCheck} from 'lucide-react';
import AdminHeader from '../layout/AdminHeader';
import AdminFooter from '../layout/AdminFooter';

interface User {
    id: number;
    email: string;
    nickname: string;
    provider: string;
    status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN';
    joinedAt: string;
    lastLoginAt: string;
    refrigeratorCount: number;
    recipeCount: number;
}

interface UserFilters {
    status: string;
    provider: string;
    dateRange: string;
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<UserFilters>({
        status: 'ALL',
        provider: 'ALL',
        dateRange: 'ALL'
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [showUserDetail, setShowUserDetail] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const statusOptions = [
        { value: 'ALL', label: '전체' },
        { value: 'ACTIVE', label: '활성' },
        { value: 'INACTIVE', label: '비활성' },
        { value: 'WITHDRAWN', label: '탈퇴' }
    ];

    const providerOptions = [
        { value: 'ALL', label: '전체' },
        { value: 'email', label: '이메일' },
        { value: 'google', label: '구글' },
        { value: 'kakao', label: '카카오' },
        { value: 'naver', label: '네이버' }
    ];

    useEffect(() => {
        loadUsers();
    }, [searchQuery, filters, currentPage]);

    const loadUsers = async () => {
        setLoading(true);

        try {
            // Mock 데이터 로드
            const mockUsers: User[] = [
                {
                    id: 1,
                    email: 'user1@example.com',
                    nickname: '김철수',
                    provider: 'google',
                    status: 'ACTIVE',
                    joinedAt: '2024-01-15T10:30:00Z',
                    lastLoginAt: '2024-01-15T14:20:00Z',
                    refrigeratorCount: 2,
                    recipeCount: 15
                },
                {
                    id: 2,
                    email: 'user2@example.com',
                    nickname: '이영희',
                    provider: 'email',
                    status: 'ACTIVE',
                    joinedAt: '2024-01-10T09:15:00Z',
                    lastLoginAt: '2024-01-14T16:30:00Z',
                    refrigeratorCount: 1,
                    recipeCount: 8
                },
                {
                    id: 3,
                    email: 'user3@example.com',
                    nickname: '박민수',
                    provider: 'kakao',
                    status: 'INACTIVE',
                    joinedAt: '2024-01-05T11:45:00Z',
                    lastLoginAt: '2024-01-12T10:00:00Z',
                    refrigeratorCount: 3,
                    recipeCount: 22
                },
                {
                    id: 4,
                    email: 'user4@example.com',
                    nickname: '최유진',
                    provider: 'naver',
                    status: 'WITHDRAWN',
                    joinedAt: '2024-01-01T08:20:00Z',
                    lastLoginAt: '2024-01-13T12:15:00Z',
                    refrigeratorCount: 0,
                    recipeCount: 0
                }
            ];

            await new Promise(resolve => setTimeout(resolve, 500));

            setUsers(mockUsers);
            setTotalElements(mockUsers.length);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(0);
    };

    const handleFilterChange = (key: keyof UserFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(0);
    };

    const handleUserStatusChange = (userId: number, newStatus: 'ACTIVE' | 'INACTIVE') => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
    };

    const handleBulkStatusChange = (newStatus: 'ACTIVE' | 'INACTIVE') => {
        if (selectedUsers.length === 0) {
            alert('사용자를 선택해주세요');
            return;
        }

        if (confirm(`선택된 ${selectedUsers.length}명의 사용자를 ${newStatus === 'ACTIVE' ? '활성화' : '비활성화'}하시겠습니까?`)) {
            setUsers(prev =>
                prev.map(user =>
                    selectedUsers.includes(user.id) ? { ...user, status: newStatus } : user
                )
            );
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId: number) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'INACTIVE': return 'bg-yellow-100 text-yellow-800';
            case 'WITHDRAWN': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ACTIVE': return '활성';
            case 'INACTIVE': return '비활성';
            case 'WITHDRAWN': return '탈퇴';
            default: return status;
        }
    };

    const getProviderLabel = (provider: string) => {
        switch (provider) {
            case 'email': return '이메일';
            case 'google': return '구글';
            case 'kakao': return '카카오';
            case 'naver': return '네이버';
            default: return provider;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchQuery ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.nickname.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filters.status === 'ALL' || user.status === filters.status;
        const matchesProvider = filters.provider === 'ALL' || user.provider === filters.provider;

        return matchesSearch && matchesStatus && matchesProvider;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminHeader currentPage="users" />

            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 헤더 */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
                        <p className="text-gray-600 mt-1">전체 사용자 정보를 관리하고 모니터링합니다</p>
                    </div>

                    {/* 검색 및 필터 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* 검색 */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="이메일 또는 닉네임으로 검색..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* 필터들 */}
                            <div className="flex gap-4">
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.provider}
                                    onChange={(e) => handleFilterChange('provider', e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {providerOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 대량 작업 버튼 */}
                    {selectedUsers.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length}명의 사용자가 선택됨
                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBulkStatusChange('ACTIVE')}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                                    >
                                        활성화
                                    </button>
                                    <button
                                        onClick={() => handleBulkStatusChange('INACTIVE')}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                                    >
                                        비활성화
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 사용자 테이블 */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.length === filteredUsers.length}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">사용자</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입 방식</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">활동</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.nickname}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-900">{getProviderLabel(user.provider)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                              {getStatusLabel(user.status)}
                            </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <div>냉장고 {user.refrigeratorCount}개</div>
                                                        <div className="text-gray-500">레시피 {user.recipeCount}개</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{formatDate(user.joinedAt)}</div>
                                                    <div className="text-sm text-gray-500">최근: {formatDate(user.lastLoginAt)}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setShowUserDetail(user)}
                                                            className="p-2 text-gray-400 hover:text-gray-600"
                                                            title="상세 보기"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {user.status !== 'WITHDRAWN' && (
                                                            <button
                                                                onClick={() => handleUserStatusChange(user.id, user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                                                className={`p-2 ${user.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                                                                title={user.status === 'ACTIVE' ? '비활성화' : '활성화'}
                                                            >
                                                                {user.status === 'ACTIVE' ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* 페이지네이션 */}
                                <div className="px-6 py-4 border-t flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        총 {totalElements}명 중 {filteredUsers.length}명 표시
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={currentPage === 0}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            이전
                                        </button>
                                        <button
                                            disabled={filteredUsers.length < 20}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="text-6xl mb-4">👤</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">사용자가 없습니다</h3>
                                <p className="text-gray-600">검색 조건을 변경해보세요</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* 사용자 상세 모달 */}
            {showUserDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">사용자 상세 정보</h3>
                            <button
                                onClick={() => setShowUserDetail(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">닉네임</label>
                                <p className="mt-1 text-sm text-gray-900">{showUserDetail.nickname}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">이메일</label>
                                <p className="mt-1 text-sm text-gray-900">{showUserDetail.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">가입 방식</label>
                                <p className="mt-1 text-sm text-gray-900">{getProviderLabel(showUserDetail.provider)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">계정 상태</label>
                                <span className={`inline-flex mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(showUserDetail.status)}`}>
                  {getStatusLabel(showUserDetail.status)}
                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">활동 통계</label>
                                <div className="mt-1 text-sm text-gray-900">
                                    <p>냉장고: {showUserDetail.refrigeratorCount}개</p>
                                    <p>찜한 레시피: {showUserDetail.recipeCount}개</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">가입일</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(showUserDetail.joinedAt)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">최근 로그인</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(showUserDetail.lastLoginAt)}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <button
                                onClick={() => setShowUserDetail(null)}
                                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AdminFooter />
        </div>
    );
};

export default UserManagementPage;