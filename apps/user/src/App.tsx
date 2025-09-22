import UserRoutes from './routes/UserRoutes.tsx';
import UserHeader from './layout/header/UserHeader.tsx';
import UserFooter from './layout/footer/UserFooter.jsx';
import {BrowserRouter} from "react-router-dom";


const App = () => {
    console.log('App component rendering');
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