import React, { useState, useEffect } from 'react';
import { User, Camera, Edit2, Trash2, ArrowLeft, Check, X, Key, Eye, EyeOff } from 'lucide-react';

// NOTE: This is a single-file React component.
// All styles are handled by Tailwind CSS, which is assumed to be available.
// All components and logic are contained within this one file.

// --- Interfaces and Types ---
interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    profileImage?: string;
    provider: string;
    joinedAt: string;
    lastLoginAt: string;
    status: string;
}

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// --- MessageModal Component (Replaces alert()) ---
interface MessageModalProps {
    title: string;
    message: string;
    onClose: () => void;
    confirmLabel?: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ title, message, onClose, confirmLabel = "확인" }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};

// --- Main MyProfileEditPage Component ---
const MyProfileEditPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPasswordVerifyModal, setShowPasswordVerifyModal] = useState(false);
    const [passwordData, setPasswordData] = useState<PasswordChangeData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [deleteReason, setDeleteReason] = useState('');
    const [deleteFeedback, setDeleteFeedback] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
    const [messageModal, setMessageModal] = useState<{ title: string; message: string; visible: boolean }>({
        title: '',
        message: '',
        visible: false
    });

    const deleteReasons = [
        '서비스를 더 이상 이용하지 않아요',
        '개인정보 보호를 위해서예요',
        '다른 서비스를 이용하게 되었어요',
        '서비스가 기대와 달라요',
        '기타'
    ];

    const showMessage = (title: string, message: string) => {
        setMessageModal({ title, message, visible: true });
    };

    const hideMessage = () => {
        setMessageModal({ ...messageModal, visible: false });
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        // NOTE: Mock 데이터입니다. 실제 API 호출로 교체해야 합니다.
        const mockProfile: UserProfile = {
            id: 1,
            email: 'user@example.com',
            nickname: 'user1',
            profileImage: undefined,
            provider: 'email',
            joinedAt: '2024-01-01T10:00:00Z',
            lastLoginAt: '2024-01-15T10:30:00Z',
            status: 'ACTIVE'
        };

        setTimeout(() => {
            setProfile(mockProfile);
            setNewNickname(mockProfile.nickname);
            setLoading(false);
        }, 500);
    };

    const handleBack = () => {
        console.log('Go back to previous page');
        // NOTE: 실제 라우팅 로직을 여기에 추가하세요.
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Upload image:', file);
            // NOTE: 이미지 URL은 로컬 미리보기용입니다. 실제로는 서버에 업로드해야 합니다.
            const tempUrl = URL.createObjectURL(file);
            setProfile(prev => prev ? { ...prev, profileImage: tempUrl } : null);
        }
    };

    const handleNicknameEdit = () => {
        setIsEditing(true);
    };

    const handleNicknameSave = () => {
        if (!newNickname.trim()) {
            showMessage('닉네임 오류', '닉네임을 입력해주세요');
            return;
        }

        if (newNickname.length < 2 || newNickname.length > 20) {
            showMessage('닉네임 오류', '닉네임은 2-20자 사이여야 합니다');
            return;
        }

        // NOTE: 닉네임 중복 체크 (Mock)
        if (newNickname === 'admin' || newNickname === 'test') {
            showMessage('닉네임 오류', '이미 사용 중인 닉네임입니다');
            return;
        }

        console.log('Update nickname:', newNickname);
        setProfile(prev => prev ? { ...prev, nickname: newNickname } : null);
        setIsEditing(false);
        showMessage('성공', '닉네임이 성공적으로 변경되었습니다.');
    };

    const handleNicknameCancel = () => {
        setNewNickname(profile?.nickname || '');
        setIsEditing(false);
    };

    const handlePasswordChangeClick = () => {
        setShowPasswordVerifyModal(true);
    };

    const validatePassword = (password: string): string | null => {
        if (!password) return '새 비밀번호를 입력해주세요';
        if (password.length < 8) return '비밀번호는 8자리 이상이어야 합니다';
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return '영문과 숫자를 포함해야 합니다';
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return '특수문자를 포함해야 합니다';
        return null;
    };

    const handlePasswordVerify = () => {
        // NOTE: 현재 비밀번호 확인 로직입니다. 실제로는 서버에서 비밀번호를 검증해야 합니다.
        if (!passwordData.currentPassword) {
            showMessage('비밀번호 오류', '현재 비밀번호를 입력해주세요');
            return;
        }
        // Mock 현재 비밀번호
        if (passwordData.currentPassword !== 'password123') {
            showMessage('비밀번호 오류', '현재 비밀번호가 일치하지 않습니다');
            return;
        }

        setShowPasswordVerifyModal(false);
        setShowPasswordModal(true);
        setPasswordData(prev => ({ ...prev, currentPassword: '' }));
    };

    const handlePasswordChange = (field: keyof PasswordChangeData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));

        let error = '';
        if (field === 'newPassword') {
            error = validatePassword(value) || '';
        } else if (field === 'confirmPassword') {
            error = value !== passwordData.newPassword ? '비밀번호가 일치하지 않습니다' : '';
        }

        setPasswordErrors(prev => ({ ...prev, [field]: error }));
    };

    const handlePasswordSave = () => {
        const newPasswordError = validatePassword(passwordData.newPassword);
        const confirmError = passwordData.confirmPassword !== passwordData.newPassword ? '비밀번호가 일치하지 않습니다' : null;

        if (newPasswordError || confirmError) {
            setPasswordErrors({
                newPassword: newPasswordError || '',
                confirmPassword: confirmError || ''
            });
            return;
        }

        console.log('Change password');
        showMessage('비밀번호 변경 완료', '비밀번호가 성공적으로 변경되었습니다');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!deleteReason) {
            showMessage('탈퇴 오류', '탈퇴 사유를 선택해주세요');
            return;
        }

        console.log('Delete account:', { reason: deleteReason, feedback: deleteFeedback });
        showMessage('계정 삭제 완료', '계정이 삭제되었습니다. 이용해주셔서 감사합니다.');
        setShowDeleteModal(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">프로필을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">프로필을 불러올 수 없어요</h2>
                    <button
                        onClick={handleBack}
                        className="text-emerald-500 hover:text-emerald-600 font-medium"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        뒤로
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">프로필 수정</h1>
                    <div className="w-20" />
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Profile Image Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt="프로필 사진"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md">
                                <Camera className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">사진을 클릭하여 변경하세요</p>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h2>

                    {/* Nickname */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="닉네임을 입력하세요"
                                    maxLength={20}
                                />
                                <button
                                    onClick={handleNicknameSave}
                                    className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNicknameCancel}
                                    className="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-800">{profile.nickname}</span>
                                <button
                                    onClick={handleNicknameEdit}
                                    className="p-2 text-gray-500 hover:text-emerald-500 transition-colors"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">2-20자 사이로 입력해주세요</p>
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-800">{profile.email}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
                    </div>

                    {/* Password Change */}
                    {profile.provider === 'email' && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                            <button
                                onClick={handlePasswordChangeClick}
                                className="flex items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors w-full text-left"
                            >
                                <Key className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700 font-medium">비밀번호 변경</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Account Info Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">계정 정보</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">가입일</span>
                            <span className="text-gray-800">{formatDate(profile.joinedAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">최근 로그인</span>
                            <span className="text-gray-800">{formatDate(profile.lastLoginAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">계정 상태</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                활성
              </span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">계정 삭제</h2>
                    <p className="text-gray-600 mb-4">
                        계정을 삭제하면 모든 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        계정 삭제
                    </button>
                </div>
            </div>

            {/* Message Modal */}
            {messageModal.visible && (
                <MessageModal
                    title={messageModal.title}
                    message={messageModal.message}
                    onClose={hideMessage}
                />
            )}

            {/* Current Password Verify Modal */}
            {showPasswordVerifyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">비밀번호 확인</h3>
                        <p className="text-gray-600 mb-4">보안을 위해 현재 비밀번호를 입력해주세요.</p>

                        <div className="relative mb-6">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                                placeholder="현재 비밀번호"
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPasswordVerifyModal(false);
                                    setPasswordData(prev => ({ ...prev, currentPassword: '' }));
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handlePasswordVerify}
                                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">비밀번호 변경</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                        placeholder="새 비밀번호를 입력하세요"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-6">
                            8자 이상, 영문/숫자/특수문자 포함
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    setPasswordErrors({});
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handlePasswordSave}
                                className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                            >
                                변경
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">계정을 삭제하시겠어요?</h3>
                        <p className="text-gray-600 mb-6">
                            삭제된 계정은 복구할 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                탈퇴 사유를 선택해주세요 *
                            </label>
                            <div className="space-y-2">
                                {deleteReasons.map((reason) => (
                                    <label key={reason} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="deleteReason"
                                            value={reason}
                                            checked={deleteReason === reason}
                                            onChange={(e) => setDeleteReason(e.target.value)}
                                            className="mr-3 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                추가 의견 (선택사항)
                            </label>
                            <textarea
                                value={deleteFeedback}
                                onChange={(e) => setDeleteFeedback(e.target.value)}
                                placeholder="서비스 개선을 위한 의견을 남겨주세요"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfileEditPage;