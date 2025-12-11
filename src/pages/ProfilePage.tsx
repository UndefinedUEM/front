import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Shield,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Save,
  Flag,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Section, ROLES, SECTIONS } from '@/types';
import { initialMembers } from '@/mock-list';
import { getSectionColor } from '@/utils/getSectionColor';
import { getRoleColor } from '@/utils/getRoleColor';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const activeUser = user && user.name ? user : initialMembers[0];

  const [formData, setFormData] = useState({
    name: activeUser.name,
    email: activeUser.email,
    role: activeUser.role as Role,
    section: activeUser.section as Section,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso.',
    });
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Senha alterada!',
      description: 'Sua senha foi atualizada com sucesso.',
    });
    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Até logo!', description: 'Você foi desconectado.' });
    navigate('/');
  };

  const renderEditButtonContent = () => {
    if (isEditing) {
      return (
        <>
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </>
      );
    }
    return 'Editar';
  };

  const renderPasswordToggleButton = () => {
    const Icon = showPassword ? EyeOff : Eye;
    const type = showPassword ? 'text' : 'password';

    return (
      <>
        <Input
          id="currentPassword"
          type={type}
          value={formData.currentPassword}
          onChange={(e) => handleChange('currentPassword', e.target.value)}
          className="bg-background pr-10"
          placeholder="Digite sua senha atual"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </>
    );
  };

  const renderSection = () => {
    if (!formData.section) return null;

    return (
      <Badge
        variant="outline"
        className={`text-xs ${getSectionColor(formData.section)}`}
      >
        {formData.section}
      </Badge>
    );
  };

  const renderProfileHeader = () => (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <User className="h-10 w-10 text-primary-foreground" />
        </div>
        <div className="text-center flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-card-foreground">
            {formData.name}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${getRoleColor(formData.role)}`}
            >
              <Shield className="mr-1 h-3 w-3" />
              {formData.role}
            </Badge>
            {renderSection()}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPersonalInfo = () => (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg text-card-foreground">
          Dados Pessoais
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {renderEditButtonContent()}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            Nome completo
          </Label>
          {isEditing ? (
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-background"
            />
          ) : (
            <p className="text-foreground">{formData.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            E-mail
          </Label>
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-background"
            />
          ) : (
            <p className="text-foreground">{formData.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            Cargo
          </Label>
          {isEditing ? (
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-foreground">{formData.role}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <Flag className="h-4 w-4" />
            Seção
          </Label>
          {isEditing ? (
            <Select
              value={formData.section}
              onValueChange={(value) => handleChange('section', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione a seção" />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-foreground">{formData.section}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderChangePassword = () => (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Lock className="h-5 w-5" />
          Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha atual</Label>
          <div className="relative">{renderPasswordToggleButton()}</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova senha</Label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            className="bg-background"
            placeholder="Digite a nova senha"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="bg-background"
            placeholder="Repita a nova senha"
          />
        </div>

        <Button className="w-full" onClick={handleChangePassword}>
          Alterar Senha
        </Button>
      </CardContent>
    </Card>
  );

  const renderLogout = () => (
    <>
      <Separator />
      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Sair da Conta
      </Button>
    </>
  );

  return (
    <AppLayout title="Meu Perfil">
      <div className="space-y-4 p-4 pb-24">
        {renderProfileHeader()}

        {renderPersonalInfo()}

        {renderChangePassword()}

        {renderLogout()}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
