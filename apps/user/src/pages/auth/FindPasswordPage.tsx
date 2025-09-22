import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const FindPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const handleBackClick = () => {
        console.log('Navigate back to login page');
    };

    const handleEmailSubmit = async () => {
        if (!email.trim()) {
            setError('이메일을 입력해주세요');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('올바른 이메일 형식이 아닙니다');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Mock API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 실제로는 서버에서 이메일 존재 여부를 확인하고 비밀번호 재설정 이메일을 발송
            console.log('비밀번호 재설정 이메일 발송:', email);
            setEmailSent(true);
        } catch (error) {
            setError('오류가 발생했습니다. 다시 시도해주세요');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setEmailSent(false);
        setEmail('');
        setError('');
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col justify-center items-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">이메일이 발송되었습니다</h2>

                    <p className="text-gray-600 mb-6">
                        <span className="font-medium">{email}</span>로<br/>
                        비밀번호 재설정 링크를 보내드렸습니다.<br/>
                        이메일을 확인하여 비밀번호를 재설정해주세요.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            다른 이메일로 시도
                        </button>

                        <button
                            onClick={handleBackClick}
                            className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                        >
                            로그인 페이지로
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-6">
                        이메일이 오지 않았나요? 스팸 폴더를 확인해보세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col justify-center items-center p-4">
            {/* 헤더 */}
            <div className="w-full max-w-md mb-6">
                <button
                    onClick={handleBackClick}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    로그인으로 돌아가기
                </button>
            </div>

            {/* 로고 섹션 */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-emerald-600 mb-2">Recipick</h1>
                <p className="text-gray-600">비밀번호를 잊으셨나요?</p>
            </div>

            {/* 비밀번호 찾기 카드 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">비밀번호 찾기</h2>
                    <p className="text-gray-600 text-sm">
                        가입할 때 사용한 이메일 주소를 입력하시면<br/>
                        비밀번호 재설정 링크를 보내드립니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            이메일 주소
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            placeholder="example@recipick.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                error
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                            }`}
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleEmailSubmit}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {loading ? '전송 중...' : '재설정 링크 보내기'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        계정이 없으시다면?{' '}
                        <button
                            onClick={() => console.log('Navigate to signup')}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                        >
                            회원가입
                        </button>
                    </p>
                </div>
            </div>

            {/* 푸터 */}
            <div className="mt-8 text-center text-gray-400">
                <p>© 2024 Recipick. All rights reserved.</p>
            </div>
        </div>
    );
};

export default FindPasswordPage;