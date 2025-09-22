import React, { useState, useEffect } from 'react';
import { User, Camera, Edit2, Trash2, ArrowLeft, Check, X, Key, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil, type UserAccount } from '../../utils/localStorage';

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

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
                <h3 className="text-xl font-semibold text-[#4B4B4B] mb-2">{title}</h3>
                <p className="text-[#7A7E7B] mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors font-medium"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};

const MyProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserAccount | null>(null);
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
        const currentAccount = StorageUtil.getCurrentUserAccount();
        if (!currentAccount) {
            navigate('/auth/login');
            return;
        }

        setProfile(currentAccount);
        setNewNickname(currentAccount.nickname);
        setLoading(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && profile) {
            // 이미지 파일을 base64로 변환하여 localStorage에 저장
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                const updated = StorageUtil.updateUserAccount(profile.userId, {
                    profileImage: imageUrl
                });

                if (updated) {
                    // UserState도 동시에 업데이트
                    const userState = StorageUtil.getUserState();
                    if (userState) {
                        StorageUtil.saveUserState({ ...userState, profileImage: imageUrl });
                    }

                    setProfile(prev => prev ? { ...prev, profileImage: imageUrl } : null);
                    showMessage('프로필 사진 변경', '프로필 사진이 변경되었습니다.');
                }
            };
            reader.readAsDataURL(file);
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

        if (!profile) return;

        const updated = StorageUtil.updateUserAccount(profile.userId, { nickname: newNickname });

        if (updated) {
            // UserState도 동시에 업데이트
            const userState = StorageUtil.getUserState();
            if (userState) {
                StorageUtil.saveUserState({ ...userState, nickname: newNickname });
            }

            setProfile(prev => prev ? { ...prev, nickname: newNickname } : null);
            setIsEditing(false);
            showMessage('닉네임 변경', '닉네임이 성공적으로 변경되었습니다.');
        } else {
            showMessage('닉네임 오류', '닉네임 변경에 실패했습니다.');
        }
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
        if (password.length < 6) return '비밀번호는 6자리 이상이어야 합니다';
        return null;
    };

    const handlePasswordVerify = () => {
        if (!passwordData.currentPassword) {
            showMessage('비밀번호 오류', '현재 비밀번호를 입력해주세요');
            return;
        }

        if (!profile || profile.password !== passwordData.currentPassword) {
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

        if (!profile) return;

        const updated = StorageUtil.updateUserAccount(profile.userId, { password: passwordData.newPassword });

        if (updated) {
            showMessage('비밀번호 변경 완료', '비밀번호가 성공적으로 변경되었습니다');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordErrors({});
        } else {
            showMessage('비밀번호 변경 실패', '비밀번호 변경에 실패했습니다');
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (!deleteReason) {
            showMessage('탈퇴 오류', '탈퇴 사유를 선택해주세요');
            return;
        }

        if (!profile) return;

        // 모든 데이터 삭제
        StorageUtil.clearAll();
        showMessage('계정 삭제 완료', '계정이 삭제되었습니다. 이용해주셔서 감사합니다.');

        setTimeout(() => {
            navigate('/');
        }, 2000);
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
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6789A5] mx-auto mb-4"></div>
                    <p className="text-[#878787]">프로필을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-xl font-semibold text-[#4B4B4B] mb-2">프로필을 불러올 수 없어요</h2>
                    <button
                        onClick={handleBack}
                        className="text-[#6789A5] hover:text-[#52708E] font-medium"
                    >
                        뒤로 가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2]">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-[#E0EBF7] rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#7A7E7B]" />
                        </button>
                        <h1 className="text-2xl font-bold text-[#6789A5]">프로필 수정</h1>
                    </div>
                </div>

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
                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#6789A5] hover:bg-[#52708E] rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md">
                                <Camera className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-sm text-[#7A7E7B] mt-2">사진을 클릭하여 변경하세요</p>
                    </div>
                </div>

                {/* Basic Info Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-[#4B4B4B] mb-4">기본 정보</h2>

                    {/* Nickname */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#7A7E7B] mb-2">닉네임</label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                    placeholder="닉네임을 입력하세요"
                                    maxLength={20}
                                />
                                <button
                                    onClick={handleNicknameSave}
                                    className="p-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors"
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
                            <div className="flex items-center justify-between p-4 bg-[#F0EEEB] rounded-lg">
                                <span className="text-[#4B4B4B]">{profile.nickname}</span>
                                <button
                                    onClick={handleNicknameEdit}
                                    className="p-2 text-[#7A7E7B] hover:text-[#6789A5] transition-colors"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-[#7A7E7B] mt-1">2-20자 사이로 입력해주세요</p>
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#7A7E7B] mb-2">이메일</label>
                        <div className="p-4 bg-[#F0EEEB] rounded-lg">
                            <span className="text-[#4B4B4B]">{profile.email}</span>
                        </div>
                        <p className="text-xs text-[#7A7E7B] mt-1">이메일은 변경할 수 없습니다</p>
                    </div>

                    {/* Password Change */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#7A7E7B] mb-2">비밀번호</label>
                        <button
                            onClick={handlePasswordChangeClick}
                            className="flex items-center gap-2 p-4 bg-[#F0EEEB] hover:bg-[#E0EBF7] rounded-lg transition-colors w-full text-left"
                        >
                            <Key className="w-5 h-5 text-[#7A7E7B]" />
                            <span className="text-[#4B4B4B] font-medium">비밀번호 변경</span>
                        </button>
                    </div>
                </div>

                {/* Account Info Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-[#4B4B4B] mb-4">계정 정보</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[#7A7E7B]">가입일</span>
                            <span className="text-[#4B4B4B]">{formatDate(profile.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#7A7E7B]">계정 유형</span>
                            <span className="text-[#4B4B4B]">{profile.credentialType === 'EMAIL' ? '이메일' : profile.credentialType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#7A7E7B]">계정 상태</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                활성
                            </span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
                    <h2 className="text-lg font-semibold text-red-600 mb-4">계정 삭제</h2>
                    <p className="text-[#7A7E7B] mb-4">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">비밀번호 확인</h3>
                        <p className="text-[#7A7E7B] mb-4">보안을 위해 현재 비밀번호를 입력해주세요.</p>

                        <div className="relative mb-6">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                                placeholder="현재 비밀번호"
                                className="w-full px-4 py-3 pr-12 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7A7E7B] hover:text-[#4B4B4B]"
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
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handlePasswordVerify}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors font-medium"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">비밀번호 변경</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-1">새 비밀번호</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                        placeholder="새 비밀번호를 입력하세요"
                                        className="w-full px-4 py-3 pr-12 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7A7E7B] hover:text-[#4B4B4B]"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#7A7E7B] mb-1">새 비밀번호 확인</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        className="w-full px-4 py-3 pr-12 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7A7E7B] hover:text-[#4B4B4B]"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-[#7A7E7B] mb-6">
                            6자 이상 입력해주세요
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    setPasswordErrors({});
                                }}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handlePasswordSave}
                                className="flex-1 px-4 py-3 bg-[#6789A5] hover:bg-[#52708E] text-white rounded-lg transition-colors font-medium"
                            >
                                변경
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold text-[#4B4B4B] mb-4">계정을 삭제하시겠어요?</h3>
                        <p className="text-[#7A7E7B] mb-6">
                            삭제된 계정은 복구할 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
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
                                            className="mr-3 text-[#6789A5] focus:ring-[#6789A5]"
                                        />
                                        <span className="text-sm text-[#4B4B4B]">{reason}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#7A7E7B] mb-2">
                                추가 의견 (선택사항)
                            </label>
                            <textarea
                                value={deleteFeedback}
                                onChange={(e) => setDeleteFeedback(e.target.value)}
                                placeholder="서비스 개선을 위한 의견을 남겨주세요"
                                className="w-full px-3 py-2 border border-[#D1D1D1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-transparent"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 border border-[#D1D1D1] text-[#7A7E7B] rounded-lg hover:bg-[#F0EEEB] transition-colors font-medium"
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