import { useEffect, useState } from 'react';
import { state } from '@/state';
import { router, type Route } from '@/router';
import { initializeMockData } from '@/data/mockData';

// Views
import Home from '@/views/Home';
import Login from '@/views/Login';
import Register from '@/views/Register';
import Dashboard from '@/views/Dashboard';
import Orders from '@/views/Orders';
import OrderDetail from '@/views/OrderDetail';
import NewOrder from '@/views/NewOrder';
import Proposals from '@/views/Proposals';
import Chat from '@/views/Chat';
import Profile from '@/views/Profile';
import Admin from '@/views/Admin';
import ProviderProfile from '@/views/ProviderProfile';

// Components
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>(router.getCurrentRoute());
  const [routeParams, setRouteParams] = useState<Record<string, string>>(router.getParams());
  const [isAuthenticated, setIsAuthenticated] = useState(state.getState().isAuthenticated);
  const [userType, setUserType] = useState(state.getState().user?.type);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar dados mock
    initializeMockData();

    // Verificar autenticação
    const checkAuth = () => {
      const authState = state.getState();
      setIsAuthenticated(authState.isAuthenticated);
      setUserType(authState.user?.type);
      setIsLoading(false);
    };
    checkAuth();

    // Subscrever a mudanças no estado
    const unsubscribe = state.subscribe((newState) => {
      setIsAuthenticated(newState.isAuthenticated);
      setUserType(newState.user?.type);
    });

    // Subscrever a mudanças de rota
    const unsubscribeRouter = router.subscribe((route, params) => {
      setCurrentRoute(route);
      setRouteParams(params);
    });

    return () => {
      unsubscribe();
      unsubscribeRouter();
    };
  }, []);

  // Verificar permissões de rota
  useEffect(() => {
    if (router.requiresAuth(currentRoute) && !isAuthenticated) {
      router.navigate('login');
      return;
    }

    if (userType && !router.hasPermission(currentRoute, userType)) {
      toast.error('Acesso negado');
      router.navigate('dashboard');
      return;
    }
  }, [currentRoute, isAuthenticated, userType]);

  // Renderizar view atual
  const renderView = () => {
    switch (currentRoute) {
      case 'home':
        return <Home />;
      case 'login':
        return isAuthenticated ? <Dashboard /> : <Login />;
      case 'register':
        return isAuthenticated ? <Dashboard /> : <Register />;
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'order-detail':
        return <OrderDetail orderId={routeParams.id} />;
      case 'new-order':
        return <NewOrder />;
      case 'proposals':
        return <Proposals />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <Admin />;
      case 'provider-profile':
        return <ProviderProfile providerId={routeParams.id} />;
      default:
        return <Home />;
    }
  };

  // Mostrar loading inicial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const showHeader = currentRoute !== 'login' && currentRoute !== 'register';
  const showBottomNav = isAuthenticated && currentRoute !== 'login' && currentRoute !== 'register';

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      <main className={`${showHeader ? 'pt-16' : ''} ${showBottomNav ? 'pb-20' : ''} min-h-screen`}>
        {renderView()}
      </main>

      {showBottomNav && <BottomNav />}
      
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
