import { Button } from '@/components/ui/button';
import { Download, Save } from 'lucide-react';

interface ActionButtonsProps {
  status: 'em_andamento' | 'salva';
  onSave: () => void;
  onDownload: () => void;
}

const ActionButtons = ({ status, onSave, onDownload }: ActionButtonsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card p-4 pb-24">
      {status === 'salva' ? (
        <Button className="w-full" onClick={onDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Baixar CSV
        </Button>
      ) : (
        <Button className="w-full" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar e Finalizar Presença
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
