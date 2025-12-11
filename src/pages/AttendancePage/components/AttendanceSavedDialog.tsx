import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download } from 'lucide-react';

interface AttendanceSavedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  stats: {
    presentScouts: number;
    totalScouts: number;
    presentLeaders: number;
    totalLeaders: number;
  };
}

const AttendanceSavedDialog = ({
  isOpen,
  onClose,
  onDownload,
  stats,
}: AttendanceSavedDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center">Presença Salva!</DialogTitle>
          <DialogDescription className="text-center">
            A lista de presença foi salva e finalizada com sucesso.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Escoteiros presentes:
              </span>
              <span className="font-medium">
                {stats.presentScouts}/{stats.totalScouts}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-muted-foreground">Chefes/Monitores:</span>
              <span className="font-medium">
                {stats.presentLeaders}/{stats.totalLeaders}
              </span>
            </div>
          </div>
          <Button className="w-full" onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar CSV agora
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceSavedDialog;
