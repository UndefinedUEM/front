import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from 'lucide-react';
import type { Scout } from '@/types';

interface ScoutImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  importedScouts: Omit<Scout, 'id' | 'attendance'>[];
}

const ScoutImportDialog: React.FC<ScoutImportDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  importedScouts,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirmar Importação</DialogTitle>
          <DialogDescription>
            {importedScouts.length} escoteiros serão importados. Confira os
            dados abaixo:
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {importedScouts.map((scout, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{scout.name}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {scout.scoutId} • {scout.section}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            Importar {importedScouts.length} escoteiros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScoutImportDialog;
