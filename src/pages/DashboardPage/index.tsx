import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import StatsGrid from './components/StatsGrid';
import UpcomingEventsCarousel from './components/UpcomingEventsCarousel';
import RecentAttendanceList from './components/RecentAttendanceList';

const DashboardPage = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  return (
    <AppLayout title="Início">
      <div className="space-y-6 p-4 pb-24">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Olá, {firstName}! 👋
          </h2>
          <p className="text-muted-foreground">Bem-vindo de volta ao sistema</p>
        </div>

        <StatsGrid />

        <UpcomingEventsCarousel />

        <RecentAttendanceList />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
