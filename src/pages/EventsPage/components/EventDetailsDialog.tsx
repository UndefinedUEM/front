import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Users, UserCheck } from 'lucide-react';
import {
  generateAttendanceCSV,
  downloadCSV,
} from '@/utils/generateAttendanceCSV';
import type { Event, EventDetails } from '../types';

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const mockDetails: EventDetails = {
  scouts: [
    { id: '1', name: 'João Silva', section: 'Tropa Sênior', isPresent: true },
    { id: '2', name: 'Maria Santos', section: 'Tropa Sênior', isPresent: true },
    {
      id: '3',
      name: 'Pedro Oliveira',
      section: 'Tropa Sênior',
      isPresent: false,
    },
    { id: '4', name: 'Ana Costa', section: 'Alcateia', isPresent: true },
  ],
  leaders: [
    { id: 'l1', name: 'Carlos Souza', role: 'Chefe de Seção', isPresent: true },
    { id: 'l2', name: 'Fernanda Rocha', role: 'Monitor', isPresent: true },
  ],
};

const EventDetailsDialog = ({
  isOpen,
  onClose,
  event,
}: EventDetailsDialogProps) => {
  if (!event) return null;

  const handleDownload = () => {
    const csvContent = generateAttendanceCSV({
      eventName: event.name,
      eventDate: new Date(event.date + 'T12:00:00'),
      scouts: mockDetails.scouts.map((s) => ({
        ...s,
        section: s.section || '',
      })),
      leaders: mockDetails.leaders.map((l) => ({ ...l, role: l.role || '' })),
    });

    const fileName = `presenca_${event.date}_${event.name.replace(/\s+/g, '_')}.csv`;
    downloadCSV(csvContent, fileName);
  };

  const presentScouts = mockDetails.scouts.filter((s) => s.isPresent).length;
  const presentLeaders = mockDetails.leaders.filter((l) => l.isPresent).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>
            {new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', {
              dateStyle: 'long',
            })}{' '}
            • {event.time}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-2">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="flex justify-center mb-1">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{presentScouts}</p>
            <p className="text-xs text-muted-foreground">
              Escoteiros Presentes
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="flex justify-center mb-1">
              <UserCheck className="h-5 w-5 text-chart-2" />
            </div>
            <p className="text-2xl font-bold">{presentLeaders}</p>
            <p className="text-xs text-muted-foreground">Chefia Presente</p>
          </div>
        </div>

        <Tabs
          defaultValue="scouts"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scouts">Escoteiros</TabsTrigger>
            <TabsTrigger value="leaders">Chefia</TabsTrigger>
          </TabsList>

          <TabsContent
            value="scouts"
            className="flex-1 overflow-y-auto mt-2 pr-1"
          >
            <div className="space-y-2">
              {mockDetails.scouts.map((scout) => (
                <div
                  key={scout.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{scout.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {scout.section}
                    </p>
                  </div>
                  <Badge variant={scout.isPresent ? 'default' : 'outline'}>
                    {scout.isPresent ? 'Presente' : 'Ausente'}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent
            value="leaders"
            className="flex-1 overflow-y-auto mt-2 pr-1"
          >
            <div className="space-y-2">
              {mockDetails.leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{leader.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {leader.role}
                    </p>
                  </div>
                  <Badge variant={leader.isPresent ? 'default' : 'outline'}>
                    {leader.isPresent ? 'Presente' : 'Ausente'}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t">
          <Button className="w-full" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Lista Completa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
