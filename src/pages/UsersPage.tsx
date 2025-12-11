import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Shield,
  UserCog,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/useToast';

const mockUsers = [
  { id: '1', name: 'Carlos Souza', email: 'carlos@email.com', role: 'master' },
  {
    id: '2',
    name: 'Fernanda Rocha',
    email: 'fernanda@email.com',
    role: 'chefe_secao',
  },
  {
    id: '3',
    name: 'Ricardo Santos',
    email: 'ricardo@email.com',
    role: 'monitor',
  },
  {
    id: '4',
    name: 'Patrícia Lima',
    email: 'patricia@email.com',
    role: 'chefe_secao',
  },
  {
    id: '5',
    name: 'Marcos Oliveira',
    email: 'marcos@email.com',
    role: 'monitor',
  },
];

const roleLabels = {
  master: { label: 'Master', icon: Shield, variant: 'default' as const },
  chefe_secao: {
    label: 'Chefe de Seção',
    icon: UserCog,
    variant: 'secondary' as const,
  },
  monitor: { label: 'Monitor', icon: Users, variant: 'outline' as const },
};

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setIsDialogOpen(false);
    toast({
      title: 'Usuário cadastrado!',
      description: 'O novo usuário foi adicionado com sucesso.',
    });
  };

  const handleEdit = (name: string) => {
    toast({ title: 'Editar', description: `Editando ${name}` });
  };

  const handleDelete = (name: string) => {
    toast({
      title: 'Excluir',
      description: `${name} foi removido`,
      variant: 'destructive',
    });
  };

  const renderInfoCard = () => (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-center gap-3 p-4">
        <Shield className="h-5 w-5 text-primary" />
        <p className="text-sm text-foreground">
          Apenas usuários Master podem gerenciar outros usuários.
        </p>
      </CardContent>
    </Card>
  );

  const renderSearch = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar usuário..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-card pl-10"
      />
    </div>
  );

  const renderAddUserDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Nome completo</Label>
            <Input
              id="userName"
              placeholder="Nome do usuário"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">E-mail</Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="email@exemplo.com"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId">ID do Usuário</Label>
            <Input
              id="userId"
              placeholder="ID único"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userRole">Função</Label>
            <Select>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chefe_secao">Chefe de Seção</SelectItem>
                <SelectItem value="monitor">Monitor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPassword">Senha temporária</Label>
            <Input
              id="userPassword"
              type="password"
              placeholder="Senha inicial"
              className="bg-background"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleAddUser}>
            Cadastrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderStats = () => (
    <div className="rounded-lg bg-primary/10 p-3">
      <p className="text-sm text-foreground">
        <span className="font-semibold">{filteredUsers.length}</span> usuários
        cadastrados
      </p>
    </div>
  );

  const renderUserList = () => (
    <div className="space-y-3">
      {filteredUsers.map((user) => {
        const roleInfo = roleLabels[user.role as keyof typeof roleLabels];
        return (
          <Card key={user.id} className="border-border bg-card">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <roleInfo.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <Badge variant={roleInfo.variant} className="mt-1 text-xs">
                    {roleInfo.label}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(user.name)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(user.name)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <AppLayout title="Usuários">
      <div className="space-y-4 p-4">
        {renderInfoCard()}

        {renderSearch()}

        {renderAddUserDialog()}

        {renderStats()}

        {renderUserList()}
      </div>
    </AppLayout>
  );
};

export default UsersPage;
