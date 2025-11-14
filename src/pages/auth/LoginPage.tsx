import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Link,
  Text,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginData } from '@/services/scoutApi.types';
import { useAuth } from '@/contexts/AuthContext';
import useAsync from '@/hooks/useAsync';
import scoutApi from '@/services/scoutApi';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Digite um e-mail válido.'),
  password: z.string().min(1, 'Confirme sua senha.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const defaultValues: LoginFormData = {
  email: '',
  password: '',
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<LoginFormData>({
    mode: 'all',
    defaultValues: defaultValues,
    resolver: zodResolver(loginSchema),
  });

  const { call: handleLogin, loading: isLoading } = useAsync(
    async (data: LoginData) => {
      try {
        await scoutApi.login(data);
        const userData = await scoutApi.getUserData();
        login(userData);
        navigate('/');
      } catch (error) {
        toast({
          title: 'Erro no login.',
          description: getErrorMessage(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    },
    [login, navigate, toast]
  );

  const onSubmit = (data: LoginData) => {
    handleLogin({ email: data.email, password: data.password });
  };

  return (
    <Container maxW="container.md" py={{ base: '12', md: '24' }} centerContent>
      <Box
        bg="white"
        w="full"
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
            Entrar
          </Heading>
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
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Senha</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
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
          {/* <Stack direction="row" justify="flex-end" align="center">
            <Link as={RouterLink} to="/recuperar-senha" color="teal.500" fontSize="sm">
              Esqueceu a senha?
            </Link>
          </Stack> */}
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            isLoading={isSubmitting || isLoading}
            isDisabled={!isDirty || !isValid || isSubmitting || isLoading}
          >
            Entrar
          </Button>
          <Flex justify="center">
            <Text fontSize="sm">
              Não tem uma conta?{' '}
              <Link
                as={RouterLink}
                to="/cadastro/usuario"
                color="teal.500"
                fontWeight="bold"
              >
                Cadastre-se
              </Link>
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

export default LoginPage;
