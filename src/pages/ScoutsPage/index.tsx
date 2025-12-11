import React, { useState, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Upload, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { type ScoutFormData } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Section, SECTIONS, type Scout } from '@/types';
import { initialScouts } from '@/mock-list';
import ScoutImportDialog from './components/ScoutImportDialog';
import ScoutDeleteConfirmationDialog from './components/ScoutDeleteConfirmationDialog';
import ScoutsList from './components/ScoutsList';
import ScoutFormDialog from './components/ScoutFormDialog.tsx';

const ScoutsPage = () => {
  const [scouts, setScouts] = useState<Scout[]>(initialScouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingScout, setEditingScout] = useState<Scout | null>(null);
  const [scoutToDelete, setScoutToDelete] = useState<Scout | null>(null);
  const [importedScouts, setImportedScouts] = useState<
    Omit<Scout, 'id' | 'attendance'>[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const isMaster = user?.role === Role.MASTER;

  const availableSections = isMaster
    ? SECTIONS
    : user?.section
      ? [user.section]
      : [];

  const filteredScouts = scouts.filter((scout) => {
    const matchesSearch = scout.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSection =
      filterSection === 'all' || scout.section === filterSection;
    const canViewScout = isMaster || scout.section === user?.section;

    return matchesSearch && matchesSection && canViewScout;
  });

  const openAddDialog = () => {
    setEditingScout(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (scout: Scout) => {
    setEditingScout(scout);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ScoutFormData) => {
    if (editingScout) {
      setScouts((prev) =>
        prev.map((s) =>
          s.id === editingScout.id
            ? {
                ...s,
                scoutId: data.scoutId,
                name: data.name,
                section: data.section as Section,
              }
            : s
        )
      );
      toast({
        title: 'Escoteiro atualizado!',
        description: 'Os dados foram salvos com sucesso.',
      });
    } else {
      const newScout: Scout = {
        id: String(Date.now()),
        scoutId: data.scoutId,
        name: data.name,
        section: data.section as Section,
        attendance: 0,
      };
      setScouts((prev) => [...prev, newScout]);
      toast({
        title: 'Escoteiro cadastrado!',
        description: 'O novo escoteiro foi adicionado com sucesso.',
      });
    }
    setIsDialogOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione um arquivo CSV',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        toast({
          title: 'Erro',
          description: 'O arquivo CSV está vazio ou inválido',
          variant: 'destructive',
        });
        return;
      }

      const header = lines[0]
        .toLowerCase()
        .split(',')
        .map((h) => h.trim());
      const idIndex = header.findIndex((h) => h === 'id');
      const nameIndex = header.findIndex((h) => h === 'nome');
      const sectionIndex = header.findIndex(
        (h) => h === 'turma' || h === 'seção' || h === 'secao'
      );

      if (idIndex === -1 || nameIndex === -1 || sectionIndex === -1) {
        toast({
          title: 'Erro no formato',
          description: 'O CSV deve conter as colunas: ID, Nome, Turma/Seção',
          variant: 'destructive',
        });
        return;
      }

      const parsed: Omit<Scout, 'id' | 'attendance'>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.length >= 3) {
          const sectionValue = values[sectionIndex];

          if (SECTIONS.includes(sectionValue as Section)) {
            parsed.push({
              scoutId: values[idIndex],
              name: values[nameIndex],
              section: sectionValue as Section,
            });
          }
        }
      }

      if (parsed.length === 0) {
        toast({
          title: 'Erro',
          description: 'Nenhum escoteiro válido encontrado no arquivo',
          variant: 'destructive',
        });
        return;
      }

      setImportedScouts(parsed);
      setIsImportDialogOpen(true);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    const newScouts: Scout[] = importedScouts.map((scout, index) => ({
      id: String(Date.now() + index),
      ...scout,
      attendance: 0,
    }));

    setScouts((prev) => [...prev, ...newScouts]);
    setIsImportDialogOpen(false);
    setImportedScouts([]);
    toast({
      title: 'Importação concluída!',
      description: `${newScouts.length} escoteiros foram adicionados com sucesso.`,
    });
  };

  const handleDownloadTemplate = () => {
    const availableSections = Object.values(Section).join(' | ');
    const headerComment = `# Seções disponíveis: ${availableSections}`;

    const csvContent =
      `${headerComment}\n` +
      `ID,Nome,Seção\n` +
      `ESC001,Ciclano Beltrano,${Section.TROPA_SENIOR_KAINGANG}\n` +
      `ESC002,Fulano de Tal,${Section.ALCATEIA_JANGAL}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_escoteiros.csv';
    link.click();
  };

  const openDeleteDialog = (scout: Scout) => {
    setScoutToDelete(scout);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmedDelete = () => {
    if (scoutToDelete) {
      setScouts((prev) => prev.filter((s) => s.id !== scoutToDelete.id));
      toast({
        title: 'Excluído',
        description: `${scoutToDelete.name} foi removido`,
        variant: 'destructive',
      });
      setScoutToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const renderMasterSectionFilter = () => {
    if (!isMaster) return null;

    return (
      <div className="w-[35%] min-w-[200px]">
        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Seção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {SECTIONS.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderSearchAndFilter = () => (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar escoteiro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card pl-10"
        />
      </div>
      {renderMasterSectionFilter()}
    </div>
  );

  const renderActionButtons = () => (
    <div className="flex gap-2">
      <Button className="flex-1" onClick={openAddDialog}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Escoteiro
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        Importar
      </Button>
    </div>
  );

  const renderCsvTemplateInfo = () => (
    <Card className="border-dashed border-primary/50 bg-primary/5">
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            Modelo CSV: <strong>ID, Nome, Seção</strong>
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
          <Download className="mr-1 h-3 w-3" />
          Baixar modelo
        </Button>
      </CardContent>
    </Card>
  );

  const renderStats = () => (
    <div className="rounded-lg bg-primary/10 p-3">
      <p className="text-sm text-foreground">
        <span className="font-semibold">{filteredScouts.length}</span>{' '}
        escoteiros encontrados
      </p>
    </div>
  );

  return (
    <AppLayout title="Escoteiros">
      <div className="space-y-4 p-4">
        {renderSearchAndFilter()}

        {renderActionButtons()}

        {renderCsvTemplateInfo()}

        <ScoutFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={onSubmit}
          editingScout={editingScout}
          availableSections={availableSections}
        />

        <ScoutImportDialog
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onConfirm={handleConfirmImport}
          importedScouts={importedScouts}
        />

        <ScoutDeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmedDelete}
          scoutName={scoutToDelete?.name || ''}
        />

        {renderStats()}

        <ScoutsList
          scouts={filteredScouts}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      </div>
    </AppLayout>
  );
};

export default ScoutsPage;
