import AdminRoutes from './routes/AdminRoutes.jsx';
import AdminHeader from './layout/AdminHeader.jsx';
import AdminFooter from './layout/AdminFooter.jsx';

const App = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <AdminHeader />
            <main className="flex-grow p-4 md:p-8">
                <AdminRoutes />
            </main>
            <AdminFooter />
        </div>
    );
};

export default App;