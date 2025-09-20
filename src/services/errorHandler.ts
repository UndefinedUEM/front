import type { AxiosError } from 'axios';

export const errorHandler = (error: AxiosError) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = (data as { message?: string })?.message;

    switch (status) {
      case 401:
        return 'Credenciais inválidas ou token expirado.';
      case 403:
        return 'Você não tem permissão para executar esta ação.';
      case 404:
        return 'O recurso solicitado não foi encontrado.';
      default:
        return message || 'Ocorreu um erro inesperado.';
    }
  }
  return 'Não foi possível conectar ao servidor. Verifique sua rede.';
};
