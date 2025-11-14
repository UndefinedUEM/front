import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/utils/getErrorMessage';
import useAsync from '@/hooks/useAsync';
import scoutApi from '@/services/scoutApi';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UserData } from '@/services/scoutApi.types';

const registrationSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório.'),
    email: z
      .string()
      .min(1, 'O e-mail é obrigatório.')
      .email('Digite um e-mail válido.'),
    confirmEmail: z.string().min(1, 'Confirme seu e-mail.'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Os e-mails não coincidem',
    path: ['confirmEmail'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

const defaultValues: RegistrationFormData = {
  name: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
};

const UserRegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<RegistrationFormData>({
    mode: 'all',
    defaultValues: defaultValues,
    resolver: zodResolver(registrationSchema),
  });

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const { call: handleRegister, loading: isLoading } = useAsync(
    async (data: UserData) => {
      try {
        await scoutApi.registerUser(data);

        toast({
          title: 'Cadastro realizado com sucesso!',
          description: 'Você será redirecionado para a página de login.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });

        navigate('/login');
      } catch (error) {
        toast({
          title: 'Erro no cadastro.',
          description: getErrorMessage(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    },
    [navigate, toast]
  );

  const onSubmit = (data: RegistrationFormData) => {
    handleRegister({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Container maxW="container.md" py={{ base: '12', md: '24' }}>
      <Box
        bg="white"
        p={{ base: '6', md: '8' }}
        borderRadius="lg"
        boxShadow="md"
      >
        <VStack
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing="6"
          align="stretch"
        >
          <Heading as="h1" size="lg" textAlign="center">
            Cadastro de Usuário
          </Heading>

          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              {...register('name')}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">E-mail</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              {...register('email')}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmEmail}>
            <FormLabel htmlFor="confirmEmail">Confirmar E-mail</FormLabel>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="Digite seu e-mail novamente"
              {...register('confirmEmail')}
            />
            <FormErrorMessage>{errors.confirmEmail?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha (mín. 6 caracteres)"
                {...register('password')}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  icon={showPassword ? <EyeOff /> : <Eye />}
                  onClick={handlePasswordVisibility}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel htmlFor="confirmPassword">Confirmar Senha</FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Digite sua senha novamente"
                {...register('confirmPassword')}
              />
              <InputRightElement>
                <IconButton
                  size="sm"
                  variant="ghost"
                  onClick={handleConfirmPasswordVisibility}
                  icon={showConfirmPassword ? <EyeOff /> : <Eye />}
                  aria-label={
                    showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'
                  }
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            size="lg"
            width="full"
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting || isLoading}
            isDisabled={!isDirty || !isValid || isSubmitting || isLoading}
          >
            Confirmar Cadastro
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default UserRegistrationPage;
