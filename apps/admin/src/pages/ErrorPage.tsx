import React, { useState } from 'react';
import { RefreshCw, Home, AlertTriangle, X } from 'lucide-react';

interface ErrorPageProps {
    errorMessage?: string;
    errorCode?: string;
}

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#FAF7F2] rounded-xl shadow-2xl p-6 relative max-w-sm w-full">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

const ErrorIcon: React.FC = () => {
    return (
        <div className="mx-auto w-24 h-24 bg-[#E0EBF7] rounded-full flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-12 h-12 text-[#6789A5]" />
        </div>
    );
};

const ErrorPage: React.FC<ErrorPageProps> = ({
                                                 errorMessage = "예상치 못한 오류가 발생했습니다.",
                                                 errorCode = "ERROR_500"
                                             }) => {
    const [showModal, setShowModal] = useState(false);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        console.log('Navigate to home page');
        // window.location.href = '/';
    };

    const handleReportError = () => {
        console.log('Report error:', { errorCode, errorMessage, userAgent: navigator.userAgent });
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <div className="max-w-md w-full text-center">
                {/* 오류 아이콘 */}
                <div className="mb-8">
                    <ErrorIcon />
                </div>

                {/* 오류 메시지 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#4B4B4B] mb-2">문제가 발생했습니다</h1>
                    <p className="text-[#878787] text-lg mb-2">{errorMessage}</p>
                    <p className="text-sm text-[#A8A8A8]">오류 코드: {errorCode}</p>
                </div>

                {/* 액션 버튼들 */}
                <div className="space-y-4">
                    <button
                        onClick={handleRefresh}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#6789A5] hover:bg-[#53738F] text-white font-semibold rounded-xl transition-colors shadow-md transform active:scale-95"
                    >
                        <RefreshCw className="w-5 h-5" />
                        페이지 새로고침
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-[#D1D1D1] text-[#7A7E7B] hover:bg-[#F0EEEB] font-semibold rounded-xl transition-colors shadow-sm transform active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        홈으로 이동
                    </button>

                    <button
                        onClick={handleReportError}
                        className="w-full px-6 py-3 text-[#A89F94] hover:text-[#7A7E7B] font-medium rounded-lg transition-colors"
                    >
                        오류 신고하기
                    </button>
                </div>

                {/* 추가 정보 */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-[#A8A8A8]">
                        문제가 계속 발생하면 고객센터로 문의해 주세요.
                    </p>
                    <p className="text-sm text-[#A8A8A8] mt-2">
                        support@recipick.com
                    </p>
                </div>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#4B4B4B] mb-4">오류 신고 접수 완료</h2>
                        <p className="text-[#878787] mb-6">
                            오류 신고가 접수되었습니다. <br />
                            빠른 시일 내에 문제를 해결하겠습니다.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full px-6 py-3 bg-[#6789A5] hover:bg-[#53738F] text-white font-semibold rounded-lg transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </Modal>
            )}

            {/* 배경 장식 */}
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E0EBF7] rounded-full"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#A89F94] rounded-full"></div>
            </div>
        </div>
    );
};

export default ErrorPage;
