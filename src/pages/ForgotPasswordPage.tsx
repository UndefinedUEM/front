import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/lib/validations';

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setSentEmail(data.email);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  const renderSubmitButtonContent = () => {
    if (isLoading) {
      return (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          Enviando...
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Enviar e-mail
      </span>
    );
  };

  const renderSentConfirmation = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <Card className="w-full max-w-sm border-border bg-card shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center text-xl text-card-foreground">
            E-mail enviado!
          </CardTitle>
          <CardDescription className="text-center">
            Enviamos uma senha temporária para <strong>{sentEmail}</strong>.
            Verifique sua caixa de entrada.
          </CardDescription>
          <Link to="/" className="w-full">
            <Button className="w-full">Voltar para o login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  if (isSent) {
    return renderSentConfirmation();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <Card className="w-full max-w-sm border-border bg-card shadow-lg">
        <CardHeader className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <CardTitle className="text-xl text-card-foreground">
            Recuperar senha
          </CardTitle>
          <CardDescription>
            Digite seu e-mail cadastrado para receber uma senha temporária.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-background"
                        {...field}
                      />
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
