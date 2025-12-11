import {
  Home,
  ClipboardList,
  Users,
  Calendar,
  User,
  TentTree,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Início', path: '/dashboard' },
  { icon: ClipboardList, label: 'Presença', path: '/attendance' },
  { icon: TentTree, label: 'Escoteiros', path: '/scouts' },
  { icon: Calendar, label: 'Eventos', path: '/events' },
  { icon: Users, label: 'Membros', path: '/members' },
  { icon: User, label: 'Perfil', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon
                className={cn('h-5 w-5', isActive && 'fill-primary/20')}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
