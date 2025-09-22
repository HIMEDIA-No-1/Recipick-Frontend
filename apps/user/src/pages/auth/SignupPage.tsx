import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil } from '../../utils/localStorage';

interface FormData {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
    agreePrivacy: boolean;
}

interface FormErrors {
    nickname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
    agreePrivacy?: string;
    general?: string;
}

const SignupPage = React.memo(() => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        agreePrivacy: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        setMessage(null);
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        // 닉네임 유효성
        if (!formData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
        else if (formData.nickname.length < 2) newErrors.nickname = '닉네임은 2글자 이상이어야 합니다.';

        // 이메일 유효성 및 중복 체크
        if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
        else {
            // 실제 계정 데이터에서 중복 체크
            const accounts = StorageUtil.getUserAccounts();
            if (accounts && accounts.accounts.find(acc => acc.email === formData.email)) {
                newErrors.email = '이미 사용 중인 이메일입니다.';
            }
        }

        // 비밀번호 유효성
        if (!formData.password.trim()) newErrors.password = '비밀번호를 입력해주세요.';
        else if (formData.password.length < 6) newErrors.password = '비밀번호는 6자리 이상이어야 합니다.';

        // 비밀번호 확인
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

        // 동의 체크박스
        if (!formData.agreeTerms) newErrors.agreeTerms = '이용약관에 동의해야 합니다.';
        if (!formData.agreePrivacy) newErrors.agreePrivacy = '개인정보 처리방침에 동의해야 합니다.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) {
            setMessage({ text: '입력 정보를 확인해주세요.', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            // 실제 계정 등록
            StorageUtil.registerAccount({
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname,
                profileImage: '',
                credentialType: 'EMAIL',
            });

            setMessage({ text: '회원가입 성공!', type: 'success' });

            // 성공 메시지 표시 후 2초 뒤 로그인 페이지로 이동
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4 font-sans">
            {/* 배경 */}
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A89F94] rounded-full"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E0EBF7] rounded-full"></div>
            </div>

            {/* 메인 컨테이너 */}
            <div className="max-w-md w-full text-center">
                {/* 로고 */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-[#4B4B4B] mb-2">Recipick</h1>
                    <p className="text-[#878787] text-lg">냉장고 속 재료로 맛있는 레시피를</p>
                </div>

                {/* 가입 카드 */}
                <div className="bg-[#FAF7F2] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#F0EEEB]">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#4B4B4B] mb-2">회원가입</h2>
                        <p className="text-[#A8A8A8]">필수 정보를 입력해주세요</p>
                    </div>

                    {message && (
                        <div className={`border px-4 py-3 rounded-lg text-sm mb-4 ${
                            message.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-600'
                                : 'bg-red-50 border-red-200 text-red-600'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* 닉네임 */}
                        <div>
                            <input
                                type="text"
                                name="nickname"
                                placeholder="닉네임"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.nickname ? 'border-red-400' : 'border-[#D1D1D1]'} focus:outline-none focus:ring-2 focus:ring-[#6789A5]`}
                            />
                            {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>}
                        </div>

                        {/* 이메일 */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-[#D1D1D1]'} focus:outline-none focus:ring-2 focus:ring-[#6789A5]`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-[#D1D1D1]'} focus:outline-none focus:ring-2 focus:ring-[#6789A5]`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-400' : 'border-[#D1D1D1]'} focus:outline-none focus:ring-2 focus:ring-[#6789A5]`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* 이용약관 동의 */}
                        <div className="flex items-start gap-2 text-left">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleInputChange}
                                className="mt-1"
                            />
                            <label className="text-sm text-[#4B4B4B]">
                                <span className="text-[#6789A5] hover:text-[#53738F] font-semibold transition-colors cursor-pointer">
                                    이용약관
                                </span>
                                에 동의합니다.
                            </label>
                        </div>
                        {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

                        {/* 개인정보 처리방침 동의 */}
                        <div className="flex items-start gap-2 text-left">
                            <input
                                type="checkbox"
                                name="agreePrivacy"
                                checked={formData.agreePrivacy}
                                onChange={handleInputChange}
                                className="mt-1"
                            />
                            <label className="text-sm text-[#4B4B4B]">
                                <span className="text-[#6789A5] hover:text-[#53738F] font-semibold transition-colors cursor-pointer">
                                    개인정보 처리방침
                                </span>
                                에 동의합니다.
                            </label>
                        </div>
                        {errors.agreePrivacy && <p className="text-red-500 text-sm">{errors.agreePrivacy}</p>}

                        {/* 회원가입 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#6789A5] hover:bg-[#53738F] text-white font-semibold rounded-xl transition-colors"
                        >
                            {isLoading ? '가입 중...' : '회원가입'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default SignupPage;