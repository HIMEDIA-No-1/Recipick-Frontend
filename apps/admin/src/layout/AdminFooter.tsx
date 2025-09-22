import { Mail, Phone, Shield, Database, Clock } from 'lucide-react';

const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    const handleSupport = () => {
        console.log('Navigate to support');
    };

    const handleDocumentation = () => {
        console.log('Navigate to admin documentation');
    };

    const handleSystemStatus = () => {
        console.log('Navigate to system status');
    };

    return (
        <footer className="bg-gray-50 border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 시스템 정보 */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">시스템 정보</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Database className="w-4 h-4 mr-2" />
                                <span>서버 상태: </span>
                                <span className="text-green-600 font-medium">정상</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>마지막 업데이트: 2024.01.15</span>
                            </div>
                            <div className="flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                <span>보안 레벨: 높음</span>
                            </div>
                        </div>
                    </div>

                    {/* 지원 및 문서 */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">지원 및 문서</h3>
                        <div className="space-y-2">
                            <button
                                onClick={handleDocumentation}
                                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                            >
                                관리자 매뉴얼
                            </button>
                            <button
                                onClick={handleSystemStatus}
                                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                            >
                                시스템 상태 확인
                            </button>
                            <button
                                onClick={handleSupport}
                                className="block text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                            >
                                기술 지원
                            </button>
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">긴급 연락처</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>admin@recipick.com</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>02-1234-5678</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                24시간 모니터링 운영 중
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 정보 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span>© {currentYear} Recipick Admin Panel</span>
                            <span className="hidden sm:block">•</span>
                            <span>Version 1.0.0</span>
                        </div>
                        <div className="mt-2 sm:mt-0">
              <span className="text-xs">
                최고 관리자 전용 • 무단 접근 시 법적 조치
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;