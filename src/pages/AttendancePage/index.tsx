import { useState } from 'react';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/useToast';
import { initialMembers, initialScouts } from '@/mock-list';
import {
  generateAttendanceCSV,
  downloadCSV,
} from '@/utils/generateAttendanceCSV';
import AttendanceSavedDialog from './components/AttendanceSavedDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Role, type Member, type Scout } from '@/types';

import EventHeader from './components/EventHeader';
import AttendanceStats from './components/AttendanceStats';
import SearchAndActions from './components/SearchAndActions';
import AttendanceList from './components/AttendanceList';
import ActionButtons from './components/ActionButtons';

type AttendanceStatus = 'em_andamento' | 'salva';
type LocalScout = Scout & { isPresent: boolean };
type LocalMember = Member & { isPresent: boolean };

const AttendancePage = () => {
  const [scouts, setScouts] = useState<LocalScout[]>(
    initialScouts.map((s) => ({ ...s, isPresent: false }))
  );
  const [members, setMembers] = useState<LocalMember[]>(
    initialMembers.map((m) => ({ ...m, isPresent: false }))
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [leaderSearchTerm, setLeaderSearchTerm] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('em_andamento');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const canManageLeaders =
    user?.role === Role.MASTER || user?.role === Role.CHEFE_SECAO;

  const eventName = 'Reunião Semanal';
  const eventDate = new Date();
  const isLocked = status === 'salva';

  const presentCount = scouts.filter((s) => s.isPresent).length;
  const totalCount = scouts.length;
  const presentLeadersCount = members.filter((l) => l.isPresent).length;

  const filteredScouts = scouts.filter((scout) =>
    scout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaders = members.filter((leader) =>
    leader.name.toLowerCase().includes(leaderSearchTerm.toLowerCase())
  );

  const toggleScoutPresence = (id: string) => {
    if (isLocked) return;
    setScouts((prev) =>
      prev.map((scout) =>
        scout.id === id ? { ...scout, isPresent: !scout.isPresent } : scout
      )
    );
  };

  const selectAllScouts = () => {
    if (isLocked) return;
    setScouts((prev) => prev.map((scout) => ({ ...scout, isPresent: true })));
    toast({
      title: 'Todos selecionados',
      description: 'Todos os escoteiros foram marcados como presentes.',
    });
  };

  const clearAllScouts = () => {
    if (isLocked) return;
    setScouts((prev) => prev.map((scout) => ({ ...scout, isPresent: false })));
    toast({
      title: 'Seleção limpa',
      description: 'Todos os escoteiros foram desmarcados.',
    });
  };

  const toggleLeaderPresence = (id: string) => {
    if (isLocked || !canManageLeaders) return;
    setMembers((prev) =>
      prev.map((leader) =>
        leader.id === id ? { ...leader, isPresent: !leader.isPresent } : leader
      )
    );
  };

  const selectAllLeaders = () => {
    if (isLocked || !canManageLeaders) return;
    setMembers((prev) => prev.map((m) => ({ ...m, isPresent: true })));
    toast({
      title: 'Todos selecionados',
      description: 'Todos os chefes/monitores foram marcados como presentes.',
    });
  };

  const clearAllLeaders = () => {
    if (isLocked || !canManageLeaders) return;
    setMembers((prev) => prev.map((m) => ({ ...m, isPresent: false })));
    toast({
      title: 'Seleção limpa',
      description: 'Todos os chefes/monitores foram desmarcados.',
    });
  };

  const handleSaveAttendance = () => {
    setStatus('salva');
    setIsConfirmationOpen(true);
  };

  const handleDownload = () => {
    const csvContent = generateAttendanceCSV({
      eventName,
      eventDate,
      scouts,
      members,
    });

    const fileName = `presenca_${format(eventDate, 'yyyy-MM-dd')}_${eventName.replace(/\s+/g, '_')}.csv`;
    downloadCSV(csvContent, fileName);
    toast({
      title: 'Download concluído',
      description: 'O arquivo CSV foi baixado com sucesso.',
    });
  };

  return (
    <AppLayout title="Lista de Presença">
      <div className="space-y-4 p-4 pb-60">
        <EventHeader
          eventName={eventName}
          eventDate={eventDate}
          status={status}
        />

        <AttendanceStats total={totalCount} present={presentCount} />

        <Tabs defaultValue="scouts" className="w-full">
          <TabsList
            className={`grid w-full ${
              canManageLeaders ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            <TabsTrigger value="scouts">Escoteiros</TabsTrigger>
            {canManageLeaders && (
              <TabsTrigger value="leaders">Chefes/Monitores</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="scouts" className="space-y-4">
            <SearchAndActions
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSelectAll={selectAllScouts}
              onClearAll={clearAllScouts}
              isDisabled={isLocked}
              placeholder="Buscar escoteiro..."
            />
            <AttendanceList
              items={filteredScouts}
              onToggle={toggleScoutPresence}
              isDisabled={isLocked}
              type="scout"
              emptyMessage="Nenhum escoteiro encontrado."
            />
          </TabsContent>

          {canManageLeaders && (
            <TabsContent value="leaders" className="space-y-4">
              <SearchAndActions
                searchTerm={leaderSearchTerm}
                onSearchChange={setLeaderSearchTerm}
                onSelectAll={selectAllLeaders}
                onClearAll={clearAllLeaders}
                isDisabled={isLocked || !canManageLeaders}
                placeholder="Buscar chefe ou monitor..."
              />
              <AttendanceList
                items={filteredLeaders}
                onToggle={toggleLeaderPresence}
                isDisabled={isLocked || !canManageLeaders}
                type="leader"
                emptyMessage="Nenhum membro encontrado."
              />
            </TabsContent>
          )}
        </Tabs>

        <ActionButtons
          status={status}
          onSave={handleSaveAttendance}
          onDownload={handleDownload}
        />

        <AttendanceSavedDialog
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onDownload={handleDownload}
          stats={{
            presentScouts: presentCount,
            totalScouts: totalCount,
            presentLeaders: presentLeadersCount,
            totalLeaders: members.length,
          }}
        />
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
