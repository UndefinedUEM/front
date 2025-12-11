import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { ScoutImage } from '@/assets/images';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    const success = await login(data.userId, data.password);

    setIsLoading(false);

    if (success) {
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Erro',
        description: 'ID ou senha incorretos.',
        variant: 'destructive',
      });
    }
  };

  const renderPasswordToggleButton = () => {
    const Icon = showPassword ? EyeOff : Eye;
    const type = showPassword ? 'text' : 'password';

    return (
      <>
        <Input
          type={type}
          placeholder="Digite sua senha"
          className="bg-background pr-10"
          {...form.register('password')}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </>
    );
  };

  const renderSubmitButtonContent = () => {
    if (isLoading) {
      return (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          Entrando...
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        <LogIn className="h-4 w-4" />
        Entrar
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden bg-primary rounded-full shadow-lg">
          <img
            src={ScoutImage.scout1x}
            alt="Logo Presença Escoteira"
            style={{ width: '100%', height: '100%' }}
            srcSet={`${ScoutImage.scout1x} 1x, ${ScoutImage.scout2x} 2x, ${ScoutImage.scout3x} 3x`}
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Presença Escoteira
        </h1>
        <p className="text-center text-muted-foreground">
          Sistema de controle de presença
        </p>
      </div>

      <Card className="w-full max-w-sm border-border bg-card shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-xl text-card-foreground">
            Entrar
          </CardTitle>
          <CardDescription className="text-center">
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Usuário</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu ID"
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
                name="password"
                render={() => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {renderPasswordToggleButton()}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {renderSubmitButtonContent()}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Novo por aqui?{' '}
        <Link
          to="/register"
          className="text-primary underline-offset-4 hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
