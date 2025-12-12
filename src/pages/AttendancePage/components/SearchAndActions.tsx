import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckSquare, XSquare } from 'lucide-react';

interface SearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isDisabled: boolean;
  placeholder: string;
}

const SearchAndActions = ({
  searchTerm,
  onSearchChange,
  onSelectAll,
  onClearAll,
  isDisabled,
  placeholder,
}: SearchAndActionsProps) => {
  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-card pl-10"
          disabled={isDisabled && !onSelectAll}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onSelectAll}
          disabled={isDisabled}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Selecionar todos
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onClearAll}
          disabled={isDisabled}
        >
          <XSquare className="mr-2 h-4 w-4" />
          Limpar seleção
        </Button>
      </div>
    </>
  );
};

export default SearchAndActions;
