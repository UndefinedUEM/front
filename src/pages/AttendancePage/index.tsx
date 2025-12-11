import { useState } from 'react';
import { format } from 'date-fns';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  CheckSquare,
  XSquare,
  Save,
  Download,
  Users,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { initialMembers, initialScouts } from '@/mock-list';
import { getSectionColor } from '@/utils/getSectionColor';
import {
  generateAttendanceCSV,
  downloadCSV,
} from '@/utils/generateAttendanceCSV';
import AttendanceSavedDialog from './components/AttendanceSavedDialog';

type AttendanceStatus = 'em_andamento' | 'salva';

const statusLabels: Record<AttendanceStatus, string> = {
  em_andamento: 'Em andamento',
  salva: 'Finalizada',
};

const statusVariants: Record<AttendanceStatus, 'default' | 'outline'> = {
  em_andamento: 'default',
  salva: 'outline',
};

const AttendancePage = () => {
  const [scouts, setScouts] = useState(initialScouts);
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('em_andamento');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const { toast } = useToast();

  const eventName = 'Reunião Semanal';
  const eventDate = new Date();

  const presentCount = scouts.filter((s) => s.isPresent).length;
  const totalCount = scouts.length;
  const presentLeadersCount = members.filter((l) => l.isPresent).length;

  const filteredScouts = scouts.filter((scout) =>
    scout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLocked = status === 'salva';

  const toggleScoutPresence = (id: string) => {
    if (isLocked) return;
    setScouts((prev) =>
      prev.map((scout) =>
        scout.id === id ? { ...scout, isPresent: !scout.isPresent } : scout
      )
    );
  };

  const toggleLeaderPresence = (id: string) => {
    if (isLocked) return;
    setMembers((prev) =>
      prev.map((leader) =>
        leader.id === id ? { ...leader, isPresent: !leader.isPresent } : leader
      )
    );
  };

  const selectAll = () => {
    if (isLocked) return;
    setScouts((prev) => prev.map((scout) => ({ ...scout, isPresent: true })));
    toast({
      title: 'Todos selecionados',
      description: 'Todos os escoteiros foram marcados como presentes.',
    });
  };

  const clearAll = () => {
    if (isLocked) return;
    setScouts((prev) => prev.map((scout) => ({ ...scout, isPresent: false })));
    toast({
      title: 'Seleção limpa',
      description: 'Todos os escoteiros foram desmarcados.',
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

  const renderEventInfo = () => (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">{eventName}</h3>
            <p className="text-sm text-muted-foreground">
              {format(eventDate, "dd 'de' MMMM, yyyy")}
            </p>
          </div>
          <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  const renderStats = () => (
    <div className="grid grid-cols-2 gap-3">
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-card-foreground">
              {totalCount}
            </p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-chart-2/20 p-2">
            <UserCheck className="h-5 w-5 text-chart-2" />
          </div>
          <div>
            <p className="text-xl font-bold text-card-foreground">
              {presentCount}
            </p>
            <p className="text-xs text-muted-foreground">Presentes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderScoutSearchAndActions = () => (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar escoteiro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={selectAll}
          disabled={isLocked}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Selecionar todos
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={clearAll}
          disabled={isLocked}
        >
          <XSquare className="mr-2 h-4 w-4" />
          Limpar seleção
        </Button>
      </div>
    </>
  );

  const renderScoutList = () => (
    <Card className="border-border bg-card">
      <CardContent className="divide-y divide-border p-0">
        {filteredScouts.map((scout) => (
          <div
            key={scout.id}
            className={`flex items-center justify-between p-4 ${
              isLocked ? 'cursor-default opacity-80' : 'cursor-pointer'
            }`}
            onClick={() => toggleScoutPresence(scout.id)}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={scout.isPresent}
                onCheckedChange={() => toggleScoutPresence(scout.id)}
                onClick={(e) => e.stopPropagation()}
                disabled={isLocked}
              />
              <div>
                <p className="font-medium text-card-foreground">{scout.name}</p>
                <Badge
                  variant="outline"
                  className={`text-xs ${getSectionColor(scout.section)}`}
                >
                  {scout.section}
                </Badge>
              </div>
            </div>
            <Badge variant={scout.isPresent ? 'default' : 'secondary'}>
              {scout.isPresent ? 'Presente' : 'Ausente'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderLeaderList = () => (
    <Card className="border-border bg-card">
      <CardContent className="divide-y divide-border p-0">
        {members.map((leader) => (
          <div
            key={leader.id}
            className={`flex items-center justify-between p-4 ${
              isLocked ? 'cursor-default opacity-80' : 'cursor-pointer'
            }`}
            onClick={() => toggleLeaderPresence(leader.id)}
          >
            <div className="flex items-center gap-3">
              <Checkbox
                checked={leader.isPresent}
                onCheckedChange={() => toggleLeaderPresence(leader.id)}
                onClick={(e) => e.stopPropagation()}
                disabled={isLocked}
              />
              <div>
                <p className="font-medium text-card-foreground">
                  {leader.name}
                </p>
                <p className="text-xs text-muted-foreground">{leader.role}</p>
              </div>
            </div>
            <Badge variant={leader.isPresent ? 'default' : 'secondary'}>
              {leader.isPresent ? 'Presente' : 'Ausente'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderActionButtons = () => {
    if (status === 'salva') {
      return (
        <Button className="w-full" onClick={handleDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Baixar CSV
        </Button>
      );
    }

    return (
      <Button className="w-full" onClick={handleSaveAttendance}>
        <Save className="mr-2 h-4 w-4" />
        Salvar e Finalizar Presença
      </Button>
    );
  };

  return (
    <AppLayout title="Lista de Presença">
      <div className="space-y-4 p-4 pb-32">
        {renderEventInfo()}

        {renderStats()}

        <Tabs defaultValue="scouts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scouts">Escoteiros</TabsTrigger>
            <TabsTrigger value="leaders">Chefes/Monitores</TabsTrigger>
          </TabsList>

          <TabsContent value="scouts" className="space-y-4">
            {renderScoutSearchAndActions()}
            {renderScoutList()}
          </TabsContent>

          <TabsContent value="leaders" className="space-y-4">
            {renderLeaderList()}
          </TabsContent>
        </Tabs>
        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card p-4 pb-24">
          {renderActionButtons()}
        </div>

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
