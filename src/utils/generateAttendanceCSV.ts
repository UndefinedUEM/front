import type { Member, Scout } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GenerateCSVParams {
  eventName: string;
  eventDate: Date;
  scouts: Scout[];
  members: Member[];
}

export const generateAttendanceCSV = ({
  eventName,
  eventDate,
  scouts,
  members,
}: GenerateCSVParams) => {
  const formattedDate = format(eventDate, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  let csv = `# Lista de Presença\n`;
  csv += `# Evento: ${eventName}\n`;
  csv += `# Data: ${formattedDate}\n`;
  csv += `# Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  })}\n`;
  csv += `\n`;

  // Escoteiros
  csv += `# ESCOTEIROS\n`;
  csv += `Nome,Seção,Presença\n`;
  scouts.forEach((scout) => {
    csv += `${scout.name},${scout.section},${
      scout.isPresent ? 'Presente' : 'Ausente'
    }\n`;
  });

  csv += `\n`;

  // Chefes/Monitores
  csv += `# CHEFES E MONITORES\n`;
  csv += `Nome,Função,Presença\n`;
  members.forEach((member) => {
    csv += `${member.name},${member.role},${
      member.isPresent ? 'Presente' : 'Ausente'
    }\n`;
  });

  return csv;
};

export const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
