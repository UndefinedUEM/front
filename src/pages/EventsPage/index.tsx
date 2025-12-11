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
import {
  initialPastEvents,
  initialUpcomingEvents,
  mockAttendanceData,
} from '@/mock-list';

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
        scouts: mockAttendanceData.scouts.map((s) => ({
          ...s,
          section: s.section || '',
        })),
        leaders: mockAttendanceData.leaders.map((l) => ({
          ...l,
          role: l.role || '',
        })),
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
        <CreateEventDialog onCreate={handleCreateEvent} />

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
