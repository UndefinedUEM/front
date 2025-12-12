import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { scoutSchema, type ScoutFormData } from '@/lib/validations';
import type { Scout } from '@/types';

interface ScoutFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScoutFormData) => void;
  editingScout: Scout | null;
  availableSections: string[];
}

const ScoutFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editingScout,
  availableSections,
}: ScoutFormDialogProps) => {
  const form = useForm<ScoutFormData>({
    resolver: zodResolver(scoutSchema),
    defaultValues: {
      name: '',
      scoutId: '',
      section: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingScout) {
        form.reset({
          name: editingScout.name,
          scoutId: editingScout.scoutId,
          section: editingScout.section,
        });
      } else {
        form.reset({
          name: '',
          scoutId: '',
          section: '',
        });
      }
    }
  }, [isOpen, editingScout, form]);

  const handleSubmit = (data: ScoutFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingScout ? 'Editar Escoteiro' : 'Novo Escoteiro'}
          </DialogTitle>
          <DialogDescription>
            {editingScout
              ? 'Atualize os dados do escoteiro. O ID não pode ser alterado.'
              : 'Preencha os dados para cadastrar um novo escoteiro.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="scoutId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID / Registro</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o ID"
                      {...field}
                      disabled={!!editingScout}
                      className={
                        editingScout
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-background'
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seção</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione a seção" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 sm:flex-none">
                {editingScout ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScoutFormDialog;
