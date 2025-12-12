import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/useToast';
import EventDeleteConfirmationDialog from './components/EventDeleteConfirmationDialog';
import CreateEventDialog from './components/CreateEventDialog';
import EditEventDialog from './components/EditEventDialog';
import UpcomingEventsTab from './components/UpcomingEventsTab';
import PastEventsTab from './components/PastEventsTab';
import EventDetailsDialog from './components/EventDetailsDialog';
import {
  generateAttendanceCSV,
  downloadCSV,
} from '@/utils/generateAttendanceCSV';
import type { Event, EventFormData } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Section, type Scout, type Member } from '@/types';
import { mockAttendanceData } from '@/mock-list';

const initialUpcomingEvents: Event[] = [
  {
    id: '1',
    name: 'Reunião Semanal',
    date: '2025-12-03',
    time: '14:00',
    location: 'Sede do Grupo',
    description: 'Reunião regular de atividades',
    status: 'ongoing',
  },
  {
    id: '2',
    name: 'Acampamento Regional',
    date: '2025-12-15',
    time: '08:00',
    location: 'Parque Municipal',
    description: 'Acampamento de integração regional',
    status: 'scheduled',
  },
];

const initialPastEvents: Event[] = [
  {
    id: '4',
    name: 'Cerimônia de Abertura',
    date: '2025-11-28',
    time: '18:00',
    location: 'Sede do Grupo',
    status: 'completed',
    attendees: 42,
  },
];

const EventsPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(
    initialUpcomingEvents
  );
  const [pastEvents] = useState<Event[]>(initialPastEvents);

  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();

  const canManageEvents =
    user?.role === Role.MASTER || user?.role === Role.CHEFE_SECAO;

  const handleCreateEvent = (data: EventFormData) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      name: data.name,
      date: data.date,
      time: data.time,
      location: data.location,
      description: data.description,
      status: 'scheduled',
    };
    setUpcomingEvents((prev) => [...prev, newEvent]);
    toast({
      title: 'Evento criado!',
      description: 'O novo evento foi adicionado com sucesso.',
    });
  };

  const handleSaveEdit = (id: string, data: EventFormData) => {
    setUpcomingEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...data } : event))
    );
    toast({
      title: 'Evento atualizado',
      description: 'As alterações foram salvas com sucesso.',
    });
    setEditingEvent(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setEventToDelete({ id, name });
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setUpcomingEvents((prev) =>
        prev.filter((event) => event.id !== eventToDelete.id)
      );
      toast({
        title: 'Excluir',
        description: `${eventToDelete.name} foi removido`,
        variant: 'destructive',
      });
      setEventToDelete(null);
    }
  };

  const handleDownload = (event: Event) => {
    try {
      const csvContent = generateAttendanceCSV({
        eventName: event.name,
        eventDate: new Date(event.date + 'T12:00:00'),
        scouts: mockAttendanceData.scouts as Scout[],
        members: mockAttendanceData.leaders as Member[],
      });
      const fileName = `presenca_${event.date}_${event.name.replace(/\s+/g, '_')}.csv`;
      downloadCSV(csvContent, fileName);
      toast({
        title: 'Download iniciado',
        description: `A lista de presença de "${event.name}" foi baixada.`,
      });
    } catch (error) {
      toast({
        title: 'Erro no download',
        description: 'Não foi possível gerar o arquivo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout title="Eventos">
      <div className="space-y-4 p-4">
        {canManageEvents && <CreateEventDialog onCreate={handleCreateEvent} />}

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="past">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <UpcomingEventsTab
              events={upcomingEvents}
              onEdit={setEditingEvent}
              onDelete={handleDeleteClick}
              onViewDetails={setViewingEvent}
              canManage={canManageEvents}
            />
          </TabsContent>

          <TabsContent value="past">
            <PastEventsTab
              events={pastEvents}
              onViewDetails={setViewingEvent}
              onDownload={handleDownload}
            />
          </TabsContent>
        </Tabs>

        <EventDeleteConfirmationDialog
          isOpen={!!eventToDelete}
          onClose={() => setEventToDelete(null)}
          onConfirm={handleConfirmDelete}
          eventName={eventToDelete?.name || ''}
        />

        <EditEventDialog
          isOpen={!!editingEvent}
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEdit}
        />

        <EventDetailsDialog
          isOpen={!!viewingEvent}
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
        />
      </div>
    </AppLayout>
  );
};

export default EventsPage;
