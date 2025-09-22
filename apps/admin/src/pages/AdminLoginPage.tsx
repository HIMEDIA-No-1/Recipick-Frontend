import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Lock, User } from 'lucide-react';

interface LoginFormData {
    email: string;
    password: string;
}

const AdminLoginPage = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError('이메일과 비밀번호를 모두 입력해주세요');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Mock API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock 관리자 계정 검증
            if (formData.email === 'admin@recipick.com' && formData.password === 'admin123!') {
                console.log('Admin login successful');
                alert('관리자 로그인 성공!');
            } else {
                setError('이메일 또는 비밀번호가 올바르지 않습니다');
            }
        } catch (error) {
            setError('로그인 중 오류가 발생했습니다');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col justify-center items-center p-4">
            {/* 보안 경고 배너 */}
            <div className="w-full max-w-md mb-6">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg text-center text-sm">
                    <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>관리자 전용 영역 • 무단 접근 금지</span>
                    </div>
                </div>
            </div>

            {/* 로고 섹션 */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <h1 className="text-4xl font-bold text-white mr-3">Recipick</h1>
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded">
            ADMIN
          </span>
                </div>
                <p className="text-slate-300">관리자 로그인</p>
            </div>

            {/* 로그인 카드 */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-slate-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">관리자 인증</h2>
                    <p className="text-gray-600 text-sm mt-2">
                        인증된 관리자만 접근할 수 있습니다
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            관리자 이메일
                        </label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="admin@recipick.com"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="관리자 비밀번호"
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        onClick={handleLogin}
                        disabled={loading || !formData.email || !formData.password}
                        className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mt-6"
                    >
                        {loading ? '인증 중...' : '관리자 로그인'}
                    </button>
                </div>

                {/* 보안 안내 */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-slate-600">
                            <p className="font-medium mb-1">보안 정책</p>
                            <ul className="space-y-1">
                                <li>• 로그인 시도는 기록됩니다</li>
                                <li>• 5회 실패 시 계정이 일시 잠금됩니다</li>
                                <li>• 의심스러운 활동은 즉시 보고됩니다</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 개발자 정보 (개발 환경에서만) */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800 text-center">
                        <strong>개발 환경 테스트 계정</strong><br/>
                        ID: admin@recipick.com<br/>
                        PW: admin123!
                    </p>
                </div>
            </div>

            {/* 하단 정보 */}
            <div className="mt-8 text-center text-slate-400">
                <p className="text-sm">© 2024 Recipick Admin System</p>
                <p className="text-xs mt-1">Unauthorized access is prohibited</p>
            </div>

            {/* 배경 장식 */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-800 rounded-full opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600 rounded-full opacity-20"></div>
            </div>
        </div>
    );
};

export default AdminLoginPage;