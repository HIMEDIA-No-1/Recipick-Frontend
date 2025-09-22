import React, { useState } from 'react';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxUsersPerDay: 100,
    dataRetentionDays: 365,
    emailNotifications: true,
    systemAlerts: true,
    debugMode: false,
    cacheEnabled: true
  });

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    alert('설정이 저장되었습니다.');
  };

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#333] rounded-lg border border-[#D1D1D1] dark:border-[#404040]">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0]">{label}</h3>
        {description && (
          <p className="text-xs text-[#878787] dark:text-[#A0A0A0] mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-[#6789A5]' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const NumberInput: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
    description?: string;
    min?: number;
    max?: number;
    unit?: string;
  }> = ({ value, onChange, label, description, min = 0, max = 999999, unit }) => (
    <div className="p-4 bg-white dark:bg-[#333] rounded-lg border border-[#D1D1D1] dark:border-[#404040]">
      <label className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">
        {label}
      </label>
      {description && (
        <p className="text-xs text-[#878787] dark:text-[#A0A0A0] mb-3">{description}</p>
      )}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className="flex-1 px-3 py-2 border border-[#D1D1D1] dark:border-[#404040] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6789A5] dark:bg-gray-700 dark:text-white"
        />
        {unit && (
          <span className="text-sm text-[#878787] dark:text-[#A0A0A0]">{unit}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">시스템 설정</h1>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[#D1D1D1] dark:border-[#404040] text-[#4B4B4B] dark:text-[#E0E0E0] rounded-md hover:bg-[#E0EBF7] dark:hover:bg-[#404040] transition-colors"
          >
            초기화
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-[#6789A5] text-white rounded-md hover:bg-[#5A7E9D] transition-colors"
          >
            설정 저장
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">시스템 상태</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#E0EBF7] dark:bg-[#404040] rounded-lg">
            <div className="text-2xl font-bold text-[#6789A5]">98.5%</div>
            <div className="text-sm text-[#4B4B4B] dark:text-[#E0E0E0]">시스템 가동률</div>
          </div>
          <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">정상</div>
            <div className="text-sm text-[#4B4B4B] dark:text-[#E0E0E0]">서비스 상태</div>
          </div>
          <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">247ms</div>
            <div className="text-sm text-[#4B4B4B] dark:text-[#E0E0E0]">평균 응답시간</div>
          </div>
        </div>
      </div>

      {/* Basic Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">기본 설정</h2>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.maintenanceMode}
            onChange={(value) => handleSettingChange('maintenanceMode', value)}
            label="유지보수 모드"
            description="시스템 점검 시 사용자 접근을 차단합니다"
          />
          <ToggleSwitch
            enabled={settings.allowNewRegistrations}
            onChange={(value) => handleSettingChange('allowNewRegistrations', value)}
            label="신규 회원가입 허용"
            description="새로운 사용자의 회원가입을 허용합니다"
          />
          <NumberInput
            value={settings.maxUsersPerDay}
            onChange={(value) => handleSettingChange('maxUsersPerDay', value)}
            label="일일 최대 신규 회원 수"
            description="하루에 가입할 수 있는 최대 신규 회원 수"
            min={1}
            max={1000}
            unit="명"
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">데이터 관리</h2>
        <div className="space-y-4">
          <NumberInput
            value={settings.dataRetentionDays}
            onChange={(value) => handleSettingChange('dataRetentionDays', value)}
            label="데이터 보관 기간"
            description="사용자 데이터를 보관할 기간 (법적 요구사항 고려)"
            min={30}
            max={2555}
            unit="일"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FAF7F2] dark:bg-[#242424] rounded-lg border border-[#D1D1D1] dark:border-[#404040]">
              <h3 className="text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">데이터베이스 크기</h3>
              <div className="text-2xl font-bold text-[#6789A5]">2.4 GB</div>
              <div className="text-xs text-[#878787] dark:text-[#A0A0A0]">전체 용량의 24% 사용</div>
            </div>
            <div className="p-4 bg-[#FAF7F2] dark:bg-[#242424] rounded-lg border border-[#D1D1D1] dark:border-[#404040]">
              <h3 className="text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-2">백업 상태</h3>
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">완료</div>
              <div className="text-xs text-[#878787] dark:text-[#A0A0A0]">2시간 전 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">알림 설정</h2>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={(value) => handleSettingChange('emailNotifications', value)}
            label="이메일 알림"
            description="중요한 시스템 이벤트 발생 시 이메일 알림"
          />
          <ToggleSwitch
            enabled={settings.systemAlerts}
            onChange={(value) => handleSettingChange('systemAlerts', value)}
            label="시스템 경고"
            description="성능 이슈 발생 시 즉시 경고 알림"
          />
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">고급 설정</h2>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.debugMode}
            onChange={(value) => handleSettingChange('debugMode', value)}
            label="디버그 모드"
            description="개발자 디버그 정보 활성화 (성능 영향)"
          />
          <ToggleSwitch
            enabled={settings.cacheEnabled}
            onChange={(value) => handleSettingChange('cacheEnabled', value)}
            label="캐시 사용"
            description="응답 속도 향상을 위한 데이터 캐싱"
          />
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">시스템 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-[#D1D1D1] dark:border-[#404040] rounded-lg hover:bg-[#E0EBF7] dark:hover:bg-[#404040] transition-colors text-left">
            <h3 className="font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">캐시 초기화</h3>
            <p className="text-xs text-[#878787] dark:text-[#A0A0A0]">시스템 캐시를 모두 삭제합니다</p>
          </button>
          <button className="p-4 border border-[#D1D1D1] dark:border-[#404040] rounded-lg hover:bg-[#E0EBF7] dark:hover:bg-[#404040] transition-colors text-left">
            <h3 className="font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">로그 다운로드</h3>
            <p className="text-xs text-[#878787] dark:text-[#A0A0A0]">시스템 로그를 다운로드합니다</p>
          </button>
          <button className="p-4 border border-orange-300 text-orange-600 dark:border-orange-800 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left">
            <h3 className="font-medium mb-1">데이터베이스 최적화</h3>
            <p className="text-xs opacity-80">백업 후 진행할 DB 최적화 작업</p>
          </button>
          <button className="p-4 border border-red-300 text-red-600 dark:border-red-800 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
            <h3 className="font-medium mb-1">시스템 재시작</h3>
            <p className="text-xs opacity-80">시스템을 완전히 재시작합니다</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;