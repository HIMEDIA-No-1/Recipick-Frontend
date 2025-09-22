import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Search, Filter, Users, UserCheck, UserX } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const { users, initializeData, toggleUserStatus } = useAdminStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'deleted'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const usersPerPage = 10;

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && !user.isDeleted) ||
                         (filterStatus === 'deleted' && user.isDeleted);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleToggleStatus = (userId: string) => {
    toggleUserStatus(userId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusBadge: React.FC<{ isDeleted: boolean }> = ({ isDeleted }) => (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
      isDeleted
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }`}>
      {isDeleted ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
      {isDeleted ? '비활성화' : '활성화'}
    </span>
  );

  const Pagination: React.FC = () => (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        전체 {filteredUsers.length}명 중 {startIndex + 1}-{Math.min(startIndex + usersPerPage, filteredUsers.length)}명 표시
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          이전
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 text-sm border rounded-md ${
                currentPage === pageNum
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          다음
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">사용자 관리</h1>
          <p className="text-[#878787] dark:text-[#A0A0A0]">전체 사용자 현황을 관리하세요</p>
        </div>
        <div className="text-sm text-[#878787] dark:text-[#A0A0A0] bg-[#E0EBF7] dark:bg-[#404040] px-4 py-2 rounded-lg">
          총 {users.length}명의 사용자
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                사용자 검색
              </div>
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름 또는 이메일로 검색..."
              className="w-full px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:bg-[#242424] dark:text-[#E0E0E0] text-[#4B4B4B] placeholder-[#878787] dark:placeholder-[#A0A0A0]"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                상태 필터
              </div>
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'deleted')}
              className="px-4 py-3 border border-[#D1D1D1] dark:border-[#404040] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:bg-[#242424] dark:text-[#E0E0E0] text-[#4B4B4B]"
            >
              <option value="all">전체</option>
              <option value="active">활성화</option>
              <option value="deleted">비활성화</option>
            </select>
          </div>
        </div>
      </div>

      {/* 사용자 테이블 */}
      <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D1D1D1] dark:divide-[#404040]">
            <thead className="bg-[#E0EBF7] dark:bg-[#404040]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] uppercase tracking-wider">
                  사용자 정보
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] uppercase tracking-wider">
                  마지막 로그인
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#4B4B4B] dark:text-[#E0E0E0] uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#FAF7F2] dark:bg-[#333333] divide-y divide-[#D1D1D1] dark:divide-[#404040]">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#E0EBF7] dark:hover:bg-[#404040] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profileImage ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.profileImage}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#E0EBF7] dark:bg-[#404040] flex items-center justify-center">
                            <span className="text-sm font-medium text-[#6789A5]">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0]">
                          {user.name}
                        </div>
                        <div className="text-sm text-[#878787] dark:text-[#A0A0A0]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge isDeleted={user.isDeleted} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B4B4B] dark:text-[#E0E0E0]">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4B4B4B] dark:text-[#E0E0E0]">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : (
                      <span className="text-[#878787] dark:text-[#A0A0A0]">로그인 기록 없음</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        user.isDeleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                          : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                      }`}
                    >
                      {user.isDeleted ? '활성화' : '비활성화'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#878787] dark:text-[#A0A0A0] mx-auto mb-4" />
            <p className="text-[#878787] dark:text-[#A0A0A0] text-lg">검색 결과가 없습니다.</p>
          </div>
        )}

        {paginatedUsers.length > 0 && <Pagination />}
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">활성 사용자</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {users.filter(u => !u.isDeleted).length}명
          </p>
          <p className="text-sm text-[#878787] dark:text-[#A0A0A0] mt-2">
            전체의 {users.length > 0 ? ((users.filter(u => !u.isDeleted).length / users.length) * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">비활성 사용자</h3>
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {users.filter(u => u.isDeleted).length}명
          </p>
          <p className="text-sm text-[#878787] dark:text-[#A0A0A0] mt-2">
            전체의 {users.length > 0 ? ((users.filter(u => u.isDeleted).length / users.length) * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="bg-[#FAF7F2] dark:bg-[#333333] rounded-lg shadow-sm border border-[#D1D1D1] dark:border-[#404040] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg">
              <Users className="w-5 h-5 text-[#6789A5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">전체 사용자</h3>
          </div>
          <p className="text-3xl font-bold text-[#6789A5]">
            {users.length}명
          </p>
          <p className="text-sm text-[#878787] dark:text-[#A0A0A0] mt-2">
            누적 가입자 수
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;