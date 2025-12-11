import type { ReactNode } from 'react';
import MobileHeader from './MobileHeader';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MobileHeader title={title} />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
