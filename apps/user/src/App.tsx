import { useEffect } from 'react';
import UserRoutes from './routes/UserRoutes.tsx';
import UserHeader from './layout/header/UserHeader.tsx';
import UserFooter from './layout/footer/UserFooter.jsx';
import { BrowserRouter } from "react-router-dom";
import { StorageUtil, MockDataGenerator } from './utils/localStorage';

const App = () => {
    console.log('App component rendering');

    useEffect(() => {
        // localStorage가 비어있는지 확인
        const userAccounts = StorageUtil.getUserAccounts();
        const fridgesData = StorageUtil.getFridgesData();

        // 데이터가 없으면 리얼한 목업 데이터 생성
        if (!userAccounts || userAccounts.accounts.length === 0 || !fridgesData || fridgesData.allFridges.length === 0) {
            console.log('📝 localStorage가 비어있습니다. 리얼한 목업 데이터를 생성합니다...');
            MockDataGenerator.generateAllMockData();
        } else {
            console.log('✅ 기존 데이터가 있습니다:', {
                사용자수: userAccounts.accounts.length,
                냉장고수: fridgesData.allFridges.length
            });
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <UserHeader />
                <main className="flex-grow container mx-auto p-4 md:p-8 pt-24 md:pt-28">
                    <UserRoutes />
                </main>
                <UserFooter />
            </div>
        </BrowserRouter>
    );
};

export default App;