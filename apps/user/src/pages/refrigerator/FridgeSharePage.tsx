import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserPlus, Users, Trash2, Crown, Check, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { StorageUtil, type Fridge, type UserAccount } from '../../utils/localStorage';

const FridgeSharePage: React.FC = () => {
    const navigate = useNavigate();
    const { fridgeId } = useParams<{ fridgeId: string }>();
    const [fridge, setFridge] = useState<Fridge | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserAccount[]>([]);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        loadFridge();
    }, [fridgeId]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const results = StorageUtil.searchUsers(searchQuery);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const loadFridge = () => {
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
        setLoading(false);
    };

    const handleBack = () => {
        navigate(`/fridges/${fridgeId}`);
    };

    const handleInviteUser = (targetUserId: string) => {
        if (!fridge) return;

        const success = StorageUtil.sendFridgeInvitation(fridge.fridgeId, targetUserId);

        if (success) {
            const targetUser = searchResults.find(user => user.userId === targetUserId);
            setMessage({
                text: `${targetUser?.nickname}님에게 초대 요청을 보냈습니다.`,
                type: 'success'
            });
            setShowSearchModal(false);
            setSearchQuery('');
        } else {
            setMessage({
                text: '초대 요청 전송에 실패했습니다. 이미 멤버이거나 오류가 발생했습니다.',
                type: 'error'
            });
        }

        setTimeout(() => setMessage(null), 3000);
    };

    const handleRemoveMember = (memberUserId: string) => {
        if (!fridge) return;

        const currentUser = StorageUtil.getCurrentUserAccount();
        if (!currentUser) return;

        // 자기 자신을 제거하거나, 소유자만 다른 멤버를 제거할 수 있음
        const currentUserMember = fridge.members.find(m => m.userId === currentUser.userId);
        const targetMember = fridge.members.find(m => m.userId === memberUserId);

        if (!currentUserMember || !targetMember) return;

        // 소유자는 제거할 수 없음
        if (targetMember.role === 'owner') {
            setMessage({ text: '냉장고 소유자는 제거할 수 없습니다.', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        // 권한 확인
        if (memberUserId !== currentUser.userId && currentUserMember.role !== 'owner') {
            setMessage({ text: '다른 멤버를 제거할 권한이 없습니다.', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        const success = StorageUtil.removeFridgeMember(fridge.fridgeId, memberUserId);

        if (success) {
            // 자기 자신을 제거한 경우 냉장고 목록으로 이동
            if (memberUserId === currentUser.userId) {
                navigate('/fridges');
                return;
            }

            // 다른 멤버를 제거한 경우 상태 업데이트
            setFridge(prev => prev ? {
                ...prev,
                members: prev.members.filter(m => m.userId !== memberUserId)
            } : null);

            setMessage({
                text: `${targetMember.nickname}님이 냉장고에서 제거되었습니다.`,
                type: 'success'
            });
        } else {
            setMessage({ text: '멤버 제거에 실패했습니다.', type: 'error' });
        }

        setTimeout(() => setMessage(null), 3000);
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
                        onClick={() => navigate('/fridges')}
                        className="text-[#6789A5] hover:text-[#52708E]"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const currentUser = StorageUtil.getCurrentUserAccount();
    const currentUserMember = fridge.members.find(m => m.userId === currentUser?.userId);
    const isOwner = currentUserMember?.role === 'owner';

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-[#E0EBF7] rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#7A7E7B]" />
                        </button>
                        <h1 className="text-2xl font-bold text-[#6789A5]">냉장고 공유 관리</h1>
                    </div>

                    {isOwner && (
                        <button
                            onClick={() => setShowSearchModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            멤버 초대
                        </button>
                    )}
                </div>

                {/* 메시지 */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-600'
                            : 'bg-red-50 border border-red-200 text-red-600'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* 냉장고 정보 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-xl font-semibold text-[#4B4B4B] mb-4">{fridge.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-[#7A7E7B]">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{fridge.members.length}명</span>
                        </div>
                    </div>
                </div>

                {/* 멤버 목록 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#4B4B4B] mb-4">냉장고 멤버</h3>

                    <div className="space-y-3">
                        {fridge.members.map((member) => (
                            <div key={member.userId} className="flex items-center justify-between p-4 bg-[#F0EEEB] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#6789A5] rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold">
                                            {member.nickname.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-[#4B4B4B]">
                                                {member.nickname}
                                                {member.userId === currentUser?.userId && ' (나)'}
                                            </span>
                                            {member.role === 'owner' && (
                                                <Crown className="w-4 h-4 text-yellow-500" />
                                            )}
                                        </div>
                                        <span className="text-sm text-[#7A7E7B]">
                                            {member.role === 'owner' ? '소유자' : '멤버'}
                                        </span>
                                    </div>
                                </div>

                                {/* 제거 버튼 */}
                                {member.role !== 'owner' && (isOwner || member.userId === currentUser?.userId) && (
                                    <button
                                        onClick={() => handleRemoveMember(member.userId)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title={member.userId === currentUser?.userId ? '나가기' : '내보내기'}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 사용자 검색 모달 */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-[#4B4B4B]">멤버 초대</h3>
                            <button
                                onClick={() => {
                                    setShowSearchModal(false);
                                    setSearchQuery('');
                                }}
                                className="p-2 hover:bg-[#F0EEEB] rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-[#7A7E7B]" />
                            </button>
                        </div>

                        {/* 검색창 */}
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-[#7A7E7B]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="닉네임 또는 이메일로 검색"
                                className="w-full pl-10 pr-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        {/* 검색 결과 */}
                        <div className="flex-1 overflow-y-auto">
                            {searchQuery.trim() === '' ? (
                                <div className="text-center py-8 text-[#7A7E7B]">
                                    <Users className="w-12 h-12 mx-auto mb-2 text-[#D1D1D1]" />
                                    <p>닉네임 또는 이메일로 사용자를 검색하세요</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-8 text-[#7A7E7B]">
                                    <p>검색 결과가 없습니다</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {searchResults.map((user) => (
                                        <div key={user.userId} className="flex items-center justify-between p-3 hover:bg-[#F0EEEB] rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#6789A5] rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-semibold">
                                                        {user.nickname.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#4B4B4B]">{user.nickname}</p>
                                                    <p className="text-sm text-[#7A7E7B]">{user.email}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleInviteUser(user.userId)}
                                                className="p-2 text-[#6789A5] hover:bg-[#E0EBF7] rounded-full transition-colors"
                                                disabled={fridge?.members.some(m => m.userId === user.userId)}
                                            >
                                                {fridge?.members.some(m => m.userId === user.userId) ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <UserPlus className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FridgeSharePage;