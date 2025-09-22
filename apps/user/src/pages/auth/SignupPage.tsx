import { useState } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface FormData {
    nickname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ValidationErrors {
    nickname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const SignupPage = () => {
    const [formData, setFormData] = useState<FormData>({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // 유효성 검사 함수들 (오류가 없으면 `undefined` 반환)
    const validateNickname = (nickname: string): string | undefined => {
        if (!nickname.trim()) return '닉네임을 입력해주세요';
        if (nickname.length < 2) return '닉네임은 2글자 이상이어야 합니다';
        if (nickname.length > 20) return '닉네임은 20글자 이하여야 합니다';
        if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname)) return '닉네임은 한글, 영문, 숫자만 사용 가능합니다';

        // Mock 중복 체크
        const duplicateNicknames = ['admin', 'test', 'user1'];
        if (duplicateNicknames.includes(nickname)) return '이미 사용 중인 닉네임입니다';

        return undefined;
    };

    const validateEmail = (email: string): string | undefined => {
        if (!email.trim()) return '이메일을 입력해주세요';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다';

        // Mock 중복 체크
        const duplicateEmails = ['admin@test.com', 'test@test.com'];
        if (duplicateEmails.includes(email)) return '이미 사용 중인 이메일입니다';

        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return '비밀번호를 입력해주세요';
        if (password.length < 8) return '비밀번호는 8자리 이상이어야 합니다';
        if (password.length > 50) return '비밀번호는 50자리 이하여야 합니다';
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return '비밀번호는 영문과 숫자를 포함해야 합니다';
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return '비밀번호는 특수문자를 포함해야 합니다';
        return undefined;
    };

    const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
        if (!confirmPassword) return '비밀번호 확인을 입력해주세요';
        if (confirmPassword !== password) return '비밀번호가 일치하지 않습니다';
        return undefined;
    };

    // 실시간 유효성 검사
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        let error: string | undefined = undefined;
        switch (field) {
            case 'nickname':
                error = validateNickname(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                // 비밀번호 변경 시 확인 비밀번호도 재검증
                if (formData.confirmPassword) {
                    const confirmError = validateConfirmPassword(formData.confirmPassword, value);
                    setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
                }
                break;
            case 'confirmPassword':
                error = validateConfirmPassword(value, formData.password);
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async () => {

        // 전체 유효성 검사
        const newErrors: ValidationErrors = {
            nickname: validateNickname(formData.nickname),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
        };

        setErrors(newErrors);

        // 오류가 있으면 제출하지 않음
        if (Object.values(newErrors).some(Boolean)) {
            return;
        }

        setLoading(true);

        // Mock API 호출
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('회원가입 성공:', formData);
            alert('회원가입이 완료되었습니다!');
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = () => {
        console.log('로그인 페이지로 이동');
    };

    const handleFindPasswordClick = () => {
        console.log('비밀번호 찾기 페이지로 이동');
    };

    const getInputClassName = (field: keyof FormData) => {
        const hasError = errors[field];
        const hasValue = formData[field];

        return `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            hasError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : hasValue && !hasError
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
        }`;
    };

    const getValidationIcon = (field: keyof FormData) => {
        if (!formData[field]) return null;
        return errors[field] ? (
            <XCircle className="w-5 h-5 text-red-500" />
        ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col justify-center items-center p-4 font-sans">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-emerald-600 mb-2">Recipick</h1>
                <p className="text-gray-600">새로운 계정을 만들어보세요</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">회원가입</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => handleInputChange('nickname', e.target.value)}
                                placeholder="닉네임을 입력하세요"
                                className={getInputClassName('nickname')}
                                maxLength={20}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getValidationIcon('nickname')}
                            </div>
                        </div>
                        {errors.nickname && (
                            <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="이메일을 입력하세요"
                                className={getInputClassName('email')}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getValidationIcon('email')}
                            </div>
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className={getInputClassName('password')}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                                {getValidationIcon('password')}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            8자 이상, 영문/숫자/특수문자 포함
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="비밀번호를 다시 입력하세요"
                                className={getInputClassName('confirmPassword')}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                                {getValidationIcon('confirmPassword')}
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || Object.values(errors).some(Boolean)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mt-6"
                    >
                        {loading ? '가입 중...' : '회원가입'}
                    </button>
                </div>
                <div className="mt-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-sm">
                        <button
                            onClick={handleLoginClick}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                        >
                            로그인
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={handleFindPasswordClick}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            비밀번호 찾기
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-4">
                        <p>가입을 진행하면 <span className="text-emerald-500">이용약관</span> 및</p>
                        <p><span className="text-emerald-500">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-gray-400">
                <p>© 2024 Recipick. All rights reserved.</p>
            </div>
        </div>
    );
};

export default SignupPage;