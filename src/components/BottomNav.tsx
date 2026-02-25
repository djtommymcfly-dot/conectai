import { useState, useEffect } from 'react';
import { router, type Route } from '@/router';
import { t } from '@/i18n';
import { state } from '@/state';
import {
  Home,
  ClipboardList,
  MessageSquare,
  User,
  PlusCircle,
  Shield,
} from 'lucide-react';

interface NavItem {
  route: Route;
  label: string;
  icon: React.ElementType;
  showFor: ('client' | 'provider' | 'admin')[];
}

export default function BottomNav() {
  const [currentRoute, setCurrentRoute] = useState<Route>(router.getCurrentRoute());
  const [userType, setUserType] = useState(state.getState().user?.type);

  useEffect(() => {
    const unsubscribe = router.subscribe((route) => {
      setCurrentRoute(route);
    });

    const unsubscribeState = state.subscribe((newState) => {
      setUserType(newState.user?.type);
    });

    return () => {
      unsubscribe();
      unsubscribeState();
    };
  }, []);

  const navItems: NavItem[] = [
    { route: 'dashboard', label: t('dashboard'), icon: Home, showFor: ['client', 'provider', 'admin'] },
    { route: 'orders', label: t('myOrders'), icon: ClipboardList, showFor: ['client', 'provider', 'admin'] },
    { route: 'new-order', label: t('publishOrder'), icon: PlusCircle, showFor: ['client'] },
    { route: 'proposals', label: t('proposals'), icon: ClipboardList, showFor: ['provider'] },
    { route: 'chat', label: t('messages'), icon: MessageSquare, showFor: ['client', 'provider', 'admin'] },
    { route: 'profile', label: t('profile'), icon: User, showFor: ['client', 'provider', 'admin'] },
    { route: 'admin', label: t('adminPanel'), icon: Shield, showFor: ['admin'] },
  ];

  const visibleItems = navItems.filter(item => 
    userType && item.showFor.includes(userType)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => {
          const isActive = currentRoute === item.route;
          const Icon = item.icon;

          return (
            <button
              key={item.route}
              onClick={() => router.navigate(item.route)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
