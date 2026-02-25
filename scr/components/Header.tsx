import { useState, useEffect } from 'react';
import { state } from '@/state';
import { router } from '@/router';
import { t } from '@/i18n';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  MessageSquare,
  Home,
  ClipboardList,
  Shield,
} from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState(state.getState().user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = state.subscribe((newState) => {
      setUser(newState.user);
      setUnreadCount(newState.unreadCount);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.navigate('home');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navItems = [
    { route: 'dashboard', label: t('dashboard'), icon: Home },
    { route: 'orders', label: t('myOrders'), icon: ClipboardList },
    { route: 'proposals', label: t('myProposals'), icon: ClipboardList },
    { route: 'chat', label: t('messages'), icon: MessageSquare },
    { route: 'profile', label: t('myProfile'), icon: User },
  ];

  if (user?.type === 'admin') {
    navItems.push({ route: 'admin', label: t('adminPanel'), icon: Shield });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => router.navigate('dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
              {t('appName')}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.route}
                variant="ghost"
                size="sm"
                onClick={() => router.navigate(item.route as any)}
                className="text-gray-600 hover:text-gray-900"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => router.navigate('chat')}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu - Desktop */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user ? getInitials(user.name) : '?'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.navigate('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('myProfile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.navigate('profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.route}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    router.navigate(item.route as any);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {t('logout')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
